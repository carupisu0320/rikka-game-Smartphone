'use strict';
// js/16-fx-sync.js の読み書き。書き出す形は、いまのファイルと同じ（演出1つが1行）なので、変えていない演出は差分に出ません
const crypto = require('crypto');
const fmtNum = x => Number.isInteger(x) ? x.toFixed(1) : String(x);

function entryLine(k, e) { return ` '${k}':{D:${fmtNum(e.D)},on:[${e.on.map(([t, s]) => `[${fmtNum(t)},${fmtNum(s)}]`).join(',')}],env:[${e.env.join(',')}]}`; }

// 16-fx-sync.js の文章を、「前の部分・演出の表・そのあと（GIFの測定データ）・ハッシュの表」に分ける
function split(text) {
  const a = text.indexOf('const FX_SYNC={'), b = text.indexOf('\n};\n', a);
  if (a < 0 || b < 0) throw new Error('16-fx-sync.js の形が、想定と違います（const FX_SYNC={ … }; が見つかりません）');
  let tail = text.slice(b + 4), hashes = {};
  const mark = tail.indexOf('\n// 演出の絵のハッシュ'), h = tail.indexOf('const FX_SYNC_HASH=');
  if (h >= 0) { const m = tail.slice(h).match(/const FX_SYNC_HASH=(\{[\s\S]*?\});/); if (m) hashes = JSON.parse(m[1].replace(/'/g, '"')); tail = tail.slice(0, mark >= 0 && mark < h ? mark : h); }
  return { head: text.slice(0, a), body: text.slice(a + 'const FX_SYNC={'.length, b), tail, hashes };
}
function parse(text) {
  const { head, body, tail, hashes } = split(text);
  const fx = require('vm').runInNewContext('({' + body + '\n})');
  return { head, fx: JSON.parse(JSON.stringify(fx)), tail, hashes };
}
function serialize({ head, fx, tail, hashes }) {
  const keys = Object.keys(fx).sort();
  const hk = Object.keys(hashes || {}).sort((p, q) => p === '_common' ? -1 : q === '_common' ? 1 : p < q ? -1 : 1);
  const hashBlock = hk.length ? `\n// 演出の絵のハッシュ（tools/measure-fx.js が書きます。手で触らないでください）\n// 絵のプログラムを変えたのに測り直していない演出は、CI（tests/fxsync.test.js）が見つけます\nconst FX_SYNC_HASH={${hk.map(k => `'${k}':'${hashes[k]}'`).join(',')}};\n` : '';
  return head + 'const FX_SYNC={\n' + keys.map(k => entryLine(k, fx[k])).join(',\n') + '\n};\n' + tail.replace(/\n*$/, '\n') + hashBlock;
}

// ───────── 演出の絵の「ハッシュ」 ─────────
// 絵（キャンバスの描画）を決めるものは、演出ごとの描画関数 FXS[id] と、共通の部品（下の名前の関数）
const COMMON_NAMES = ['_fR', '_fRn', '_fSm', '_fSpC', 'fxHexA', 'fxSpr', 'fxGlow', 'fxFlare', 'fxPetal', 'fxLeaf', 'fxFlake', 'fxBolt', 'fxCrown', '_flake', 'fxStartScene'];
const sha = s => crypto.createHash('sha1').update(s).digest('hex').slice(0, 8);
const squash = s => String(s).replace(/\s+/g, ' ');
// ctx は、js/*.js を読み込んだあとの vm の世界。{キー: ハッシュ, _common: ハッシュ} を返す
function effectHashes(ctx, keys) {
  const vm = require('vm'), out = {};
  const common = COMMON_NAMES.map(n => { try { return n + '=' + squash(vm.runInContext(`typeof ${n}==='undefined'?'':${n}.toString()`, ctx)); } catch (e) { return n + '=?'; } }).join('\n');
  out._common = sha(common);
  for (const k of keys) { const id = k.split(':')[1]; let src = ''; try { src = squash(vm.runInContext(`FXS[${JSON.stringify(id)}]?FXS[${JSON.stringify(id)}].toString():''`, ctx)); } catch (e) {} out[k] = sha(k + '|' + out._common + '|' + src); }
  return out;
}

// 標準の演出（確定演出ではないもの）は、測定データなしで鳴らす決まり
const NO_SYNC = ['win:rainbow', 'ron:default', 'win:default'];
// 測る対象：音のある演出 ＋ 測定データのある演出（標準のものを除く）
function managedKeys(ctx, fx) {
  const vm = require('vm'), snd = JSON.parse(JSON.stringify(vm.runInContext('Object.keys(FX_SOUND)', ctx)));
  return [...new Set([...snd, ...Object.keys(fx)])].filter(k => !NO_SYNC.includes(k)).sort();
}
// 演出の長さ（秒）。実際に showCallFx を呼んで、返ってきた値を使う（ブラウザなしで確かめられる）
function durations(ctx, keys) {
  const vm = require('vm'), out = {};
  for (const k of keys) { const [a, b] = k.split(':'); try { out[k] = Math.round(vm.runInContext(`showCallFx(${JSON.stringify(a)},'x','',{[${JSON.stringify(a)}]:${JSON.stringify(b)}})`, ctx)) / 1000; } catch (e) { out[k] = null; } }
  return out;
}
// 古くなっている演出を探す。種類：new＝測定データがない／changed＝絵のプログラムが変わった／duration＝長さが変わった／unknown＝ハッシュの記録がない
function findStale({ fx, hashes }, ctx) {
  const keys = managedKeys(ctx, fx), now = effectHashes(ctx, keys), dur = durations(ctx, keys), out = [];
  for (const k of keys) {
    if (!fx[k]) { out.push({ key: k, why: 'new' }); continue; }
    if (dur[k] != null && Math.abs(dur[k] - fx[k].D) > 0.001) { out.push({ key: k, why: 'duration', detail: `${fx[k].D}秒 → ${dur[k]}秒` }); continue; }
    if (!hashes || hashes[k] == null) { out.push({ key: k, why: 'unknown' }); continue; }
    if (hashes[k] !== now[k]) out.push({ key: k, why: 'changed' });
  }
  return { stale: out, keys, hashes: now, commonChanged: !!(hashes && hashes._common && hashes._common !== now._common) };
}
module.exports = { split, parse, serialize, entryLine, effectHashes, COMMON_NAMES, sha, NO_SYNC, managedKeys, durations, findStale };
