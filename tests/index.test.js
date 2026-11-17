'use strict';
// index.html の読み込みまわり：ファイルがあるか／順番／?v= がそろっているか
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), path = require('path');
const { ROOT } = require('./_sandbox');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// 読み込むファイルは、rkLoad([...]) に並べてある（?v= は、読み込むときに自動で付く）
const refs = [...html.matchAll(/rkLoad\(\[([^\]]*)\]\)/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]));
const scripts = refs.filter(r => r.startsWith('js/'));

test('index.html が読み込む js/css は、すべて存在する', () => {
  assert.ok(refs.length > 10, '読み込みが見つかりません');
  const missing = refs.map(r => r.split('?')[0]).filter(r => !fs.existsSync(path.join(ROOT, r)));
  assert.deepStrictEqual(missing, []);
});

test('js/ にあるファイルは、すべて index.html に書かれている（読み込み忘れ防止）', () => {
  const onDisk = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f);
  assert.deepStrictEqual(onDisk.filter(f => !scripts.includes(f)), []);
});

test('同じスクリプトを2回読み込んでいない', () => {
  assert.strictEqual(new Set(scripts).size, scripts.length);
});

test('バージョン(?v=)は、RIKKA_V の1か所だけで決まる（手書きの ?v= が残っていない）', () => {
  assert.strictEqual((html.match(/var RIKKA_V='[0-9a-z]+'/g) || []).length, 1, 'RIKKA_V の定義が1つではありません');
  assert.ok(!/(?:src|href)="[^"]*\?v=/.test(html), '手書きの ?v= が残っています');
  assert.ok(html.includes("'?v='+RIKKA_V"), 'rkLoad が RIKKA_V を使っていません');
});

test('rkLoad は、head で定義されてから使われる／?v= を付けて css・js を同期で読み込む', () => {
  assert.ok(html.indexOf('function rkLoad') < html.indexOf("rkLoad(['css/style.css'])"));
  assert.strictEqual(html.indexOf("rkLoad(['css/style.css'])"), html.indexOf('rkLoad(['), '最初の呼び出しは css/style.css');
  const calls = [...html.matchAll(/rkLoad\(\[/g)].map(m => m.index);
  assert.ok(calls.length >= 3);
  assert.ok(html.indexOf('socket.io') > calls[1] && html.indexOf('socket.io') < calls[2], 'socket.io は、boot の後・01 の前');
});

test('読み込み順：boot → 01〜14 → 16 → 15 → 17（16の測定データは15より先）', () => {
  const idx = n => scripts.findIndex(s => s.startsWith('js/' + n));
  for (const n of ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17']) assert.ok(idx(n) >= 0, n + ' がありません');
  assert.ok(idx('boot-1') < idx('01'), 'boot-1 は 01 より前');
  for (let i = 1; i < 14; i++) assert.ok(idx(String(i).padStart(2, '0')) < idx(String(i + 1).padStart(2, '0')), i + ' → ' + (i + 1));
  assert.ok(idx('14') < idx('16') && idx('16') < idx('15') && idx('15') < idx('17'), '14 → 16 → 15 → 17');
});

// 実際に index.html のスクリプトを順に実行して、書き出される <link>/<script> を確かめる
function simulate(version) {
  const vm = require('vm');
  const out = [];
  const ctx = vm.createContext({ document: { write: s => out.push(s) } });
  const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(b => /RIKKA_V|rkLoad/.test(b));
  blocks.forEach((b, i) => vm.runInContext(i === 0 && version ? b.replace(/var RIKKA_V='[^']+'/, `var RIKKA_V='${version}'`) : b, ctx));
  return out;
}

test('読み込み：順番どおりに、すべてに同じ ?v= が付いて書き出される', () => {
  const out = simulate();
  assert.strictEqual(out.length, refs.length);
  const v = html.match(/var RIKKA_V='([0-9a-z]+)'/)[1];
  out.forEach((tag, i) => {
    const f = refs[i];
    assert.ok(tag.includes(`${f}?v=${v}"`), `${i}番目: ${tag}`);
    assert.ok(f.endsWith('.css') ? tag.startsWith('<link rel="stylesheet"') : tag.startsWith('<script src='), tag);
  });
});

test('読み込み：RIKKA_V を変えると、すべての読み込みが一度に変わる', () => {
  const out = simulate('99999999z');
  assert.ok(out.length > 20 && out.every(t => t.includes('?v=99999999z"')));
});
