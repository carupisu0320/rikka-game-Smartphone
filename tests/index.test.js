'use strict';
// index.html の読み込みまわり：ファイルがあるか／順番／?v= がそろっているか
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), path = require('path');
const { ROOT } = require('./_sandbox');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const refs = [...html.matchAll(/<(?:script|link)[^>]*\s(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m => m[1]);
const scripts = refs.filter(r => r.startsWith('js/')).map(r => r.split('?')[0]);

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

test('?v= が、すべて同じ値（キャッシュ対策の更新漏れ防止）', () => {
  const vs = new Set(refs.map(r => (r.match(/\?v=([^&"]+)/) || [])[1] || '(なし)'));
  assert.strictEqual(vs.size, 1, '値がばらばらです: ' + [...vs].join(', '));
});

test('読み込み順：boot → 01〜14 → 16 → 15 → 17（16の測定データは15より先）', () => {
  const idx = n => scripts.findIndex(s => s.startsWith('js/' + n));
  for (const n of ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17']) assert.ok(idx(n) >= 0, n + ' がありません');
  assert.ok(idx('boot-1') < idx('01'), 'boot-1 は 01 より前');
  for (let i = 1; i < 14; i++) assert.ok(idx(String(i).padStart(2, '0')) < idx(String(i + 1).padStart(2, '0')), i + ' → ' + (i + 1));
  assert.ok(idx('14') < idx('16') && idx('16') < idx('15') && idx('15') < idx('17'), '14 → 16 → 15 → 17');
});
