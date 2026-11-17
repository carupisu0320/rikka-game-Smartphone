'use strict';
// 景品・実績・演出データの整合性（ブラウザなしで js/*.js を順に読み込んで調べる）
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm');
const { loadAll } = require('./_sandbox');

const { ctx, errors } = loadAll();
// vmの中で作られた配列は、別の世界(realm)の物なので、JSON経由でこちら側の値にして比べる
const ev = code => JSON.parse(JSON.stringify(vm.runInContext(`(${code})`, ctx)) ?? 'null');

test('すべてのスクリプトが、読み込み時にエラーを出さない', () => {
  assert.deepStrictEqual(errors, []);
});

test('景品ID：重複なし・保存できる形式（17-save-guard の _svId と同じ規則）', () => {
  const ids = ev('GACHA_ITEMS.map(x=>x.id)');
  assert.ok(ids.length > 100, '景品が少なすぎます: ' + ids.length);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  assert.deepStrictEqual([...new Set(dup)], [], '重複');
  const bad = ids.filter(x => !ev(`_svId(${JSON.stringify(x)})`));
  assert.deepStrictEqual(bad, [], 'この形式だとバックアップされません');
});

test('景品には、必要な項目（id・title・category・rarity）がある', () => {
  const bad = ev('GACHA_ITEMS.filter(x=>!x.id||!x.title||!x.category||!x.rarity).map(x=>x.id||"(idなし)")');
  assert.deepStrictEqual(bad, []);
});

test('実績ID：重複なし／報酬の景品が実在する', () => {
  const ids = ev('ACHIEVEMENTS.map(a=>a.id)');
  assert.deepStrictEqual([...new Set(ids.filter((x, i) => ids.indexOf(x) !== i))], []);
  const missing = ev('ACHIEVEMENTS.filter(a=>a.reward&&!GACHA_ITEMS.some(i=>i.id===a.reward)).map(a=>a.id)');
  assert.deepStrictEqual(missing, [], '報酬の景品IDが GACHA_ITEMS にありません');
});

test('役の実績（ROLE_ACHIEVEMENT_ID）が、すべて実在する', () => {
  const missing = ev('Object.values(ROLE_ACHIEVEMENT_ID).filter(id=>!ACHIEVEMENTS.some(a=>a.id===id))');
  assert.deepStrictEqual(missing, []);
});

test('実績の称号景品：実績から自動で作られ、実績IDと結びついている', () => {
  const missing = ev('ACHIEVEMENTS.filter(a=>a.rt&&!GACHA_ITEMS.some(i=>i.achievement===a.id)).map(a=>a.id)');
  assert.deepStrictEqual(missing, []);
});

test('演出の測定データ(16)と音(15)が対応している', () => {
  const sync = ev('Object.keys(FX_SYNC)'), snd = ev('Object.keys(FX_SOUND)');
  assert.deepStrictEqual(sync.filter(k => !snd.includes(k)), [], '測定データはあるが音がない');
  // 標準の演出（確定演出ではないもの）は、測定データなしで鳴らす決まり。増やすときは、ここに足す
  const NO_SYNC_OK = ['win:rainbow', 'ron:default', 'win:default'];
  assert.deepStrictEqual(snd.filter(k => !sync.includes(k) && !NO_SYNC_OK.includes(k)), [], '音はあるが測定データがない');
});

test('演出の測定データの形：env は 1秒に30個、on は長さの範囲内', () => {
  const bad = [];
  const all = ev('FX_SYNC');
  for (const [k, v] of Object.entries(all)) {
    if (!(v.D > 0)) bad.push(k + ': D');
    if (Math.abs(v.env.length - Math.round(v.D * 30)) > 3) bad.push(`${k}: env長さ ${v.env.length} / 期待 ${Math.round(v.D * 30)}`);
    if (v.env.some(n => !(n >= 0 && n <= 99))) bad.push(k + ': envが0〜99でない');
    if (v.on.some(([t, s]) => !(t >= 0 && t <= v.D && s >= 0 && s <= 1))) bad.push(k + ': onの範囲');
  }
  assert.deepStrictEqual(bad, []);
});

test('開発者マッチのGIF測定データ：bright と motion の長さが同じ', () => {
  assert.strictEqual(ev('DEV_GIF_SYNC.bright.length'), ev('DEV_GIF_SYNC.motion.length'));
});
