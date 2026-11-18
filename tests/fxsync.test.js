'use strict';
// 演出の測定データ（js/16-fx-sync.js）：古くなっていないか／測定ツールの計算とファイル書き出しが正しいか（ブラウザは使いません）
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path');
const { ROOT, loadAll } = require('./_sandbox');
const A = require('../tools/lib/analyze'), F = require('../tools/lib/fxsync-file');
const text = fs.readFileSync(path.join(ROOT, 'js/16-fx-sync.js'), 'utf8');

test('測定データは、すべて最新（演出の絵・長さを変えたのに、測り直していないものがない）', () => {
  const { ctx, errors } = loadAll(); assert.deepStrictEqual(errors, []);
  const { stale, commonChanged } = F.findStale(F.parse(text), ctx);
  const WHY = { new: '測定データがない', changed: '絵のプログラムが変わった', duration: '長さが変わった', unknown: 'ハッシュの記録がない（最初に1回 node tools/measure-fx.js --baseline）' };
  assert.deepStrictEqual(stale, [], '測り直しが必要です → node tools/measure-fx.js\n' + (commonChanged ? '（共通の描画部品が変わったため、すべて対象）\n' : '') + stale.map(s => `  ${s.key}: ${WHY[s.why]}${s.detail ? ' ' + s.detail : ''}`).join('\n'));
});

test('古さの検出：演出の絵のプログラムを変えると、その演出だけが「changed」になる', () => {
  const { ctx } = loadAll(), data = F.parse(text);
  vm.runInContext(`(function(){const o=FXS.thunder;FXS.thunder=function(W,H,D){return o(W,H,D);/* 変更 */};})()`, ctx);
  const { stale } = F.findStale(data, ctx);
  assert.deepStrictEqual(stale.map(s => s.key + ':' + s.why), ['riichi:thunder:changed']);
});

test('古さの検出：新しい演出（測定データなし）と、長さの変化も見つける', () => {
  const { ctx } = loadAll(), data = F.parse(text);
  delete data.fx['win:book'];
  data.fx['ron:claw'] = { ...data.fx['ron:claw'], D: 9.9 };
  const w = F.findStale(data, ctx).stale.map(s => s.key + ':' + s.why);
  assert.ok(w.includes('win:book:new') && w.includes('ron:claw:duration'), w.join(','));
});

test('ファイルの読み書き：読んで書き直しても、1文字も変わらない／何度書いても同じ', () => {
  const p = F.parse(text);
  assert.strictEqual(F.serialize(p), text);
  const once = F.serialize({ ...p, hashes: { ...p.hashes } });
  assert.strictEqual(F.serialize(F.parse(once)), once, '2回目で形が変わりました（コメントが増えるなど）');
  assert.strictEqual((text.match(/const FX_SYNC_HASH=/g) || []).length, 1);
  assert.ok(text.includes('const DEV_GIF_SYNC='), 'GIFの測定データが消えています');
});

test('ファイルの書き出し：演出を足すと、名前順に1行で入る。数字の書き方は、既存と同じ（1.0・0.5）', () => {
  const p = F.parse(text); p.fx['win:aaa'] = { D: 2.4, on: [[0.5, 1], [1.25, 0.4]], env: [1, 2, 3] };
  const out = F.serialize(p);
  assert.ok(out.includes(" 'win:aaa':{D:2.4,on:[[0.5,1.0],[1.25,0.4]],env:[1,2,3]}"), out.split('\n').find(l => l.includes('win:aaa')));
  assert.ok(out.indexOf("'win:aaa'") < out.indexOf("'win:book'") && out.indexOf("'win:aaa'") > out.indexOf("'ron:void'"));
});

// ── 測定の計算（合成した信号で確かめる） ──
function spikes(D, times, fps = 60) { // 指定した時刻に、パッと明るくなってすぐ消える信号
  const n = Math.floor(D * fps) + 1, B = Array(n).fill(2), M = Array(n).fill(0);
  times.forEach(([t, h]) => { const i = Math.round(t * fps); for (let k = 0; k < 6; k++) if (i + k < n) { B[i + k] = 2 + h * (1 - k / 6); } M[i] = h; });
  return { D, B, M };
}
test('盛り上がる瞬間の検出：光った時刻を、0.02秒以内で見つける。いちばん強いものが 1.0', () => {
  const times = [[0.3, 100], [0.8, 60], [1.4, 80]], e = A.entryFrom(spikes(2, times));
  assert.strictEqual(e.on.length, 3, JSON.stringify(e.on));
  e.on.forEach(([t], i) => assert.ok(Math.abs(t - times[i][0]) <= 0.02, `${t} vs ${times[i][0]}`));
  assert.strictEqual(Math.max(...e.on.map(x => x[1])), 1);
  assert.ok(e.on.every(([, s]) => s > 0 && s <= 1) && e.on.every((x, i) => !i || x[0] > e.on[i - 1][0]));
});
test('盛り上がる瞬間の検出：近すぎるもの（0.16秒未満）は、強いほうだけ残す／何も起きない絵でも、1個は返す', () => {
  const near = A.entryFrom(spikes(2, [[0.5, 100], [0.58, 70]]));
  assert.strictEqual(near.on.length, 1);
  const flat = A.detectOnsets(Array(121).fill(5), 2);
  assert.strictEqual(flat.length, 1); assert.strictEqual(flat[0][1], 1);
});
test('env：個数は floor(D×30)+1、値は 0〜99、最大が 99', () => {
  for (const D of [2.05, 2.3, 2.4, 4.4]) {
    const e = A.entryFrom(spikes(D, [[0.5, 100]]));
    assert.strictEqual(e.env.length, Math.floor(D * 30 + 1e-9) + 1, 'D=' + D);
    assert.ok(e.env.every(v => Number.isInteger(v) && v >= 0 && v <= 99)); assert.strictEqual(Math.max(...e.env), 99);
  }
});
test('前回との比較：時刻のずれが小さいものだけ「一致」', () => {
  const c = A.compareOn([[0.1, 1], [0.5, 1], [1.0, 1]], [[0.12, 1], [0.9, 1], [1.01, 0.5]]);
  assert.deepStrictEqual([c.old, c.now, c.hit], [3, 3, 2]);
});
test('GIF：明るさ・動きを、それぞれ最大 99 にそろえる', () => {
  const r = A.to99([1, 2, 4]); assert.deepStrictEqual(r, [25, 50, 99]);
});
