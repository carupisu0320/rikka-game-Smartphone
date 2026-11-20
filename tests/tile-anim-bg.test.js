'use strict';
// 動く牌の裏柄は、場の背景があっても（自分の番でも相手の番でも）模様が消えない／動かせないときは、これまでどおり
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), path = require('path'), vm = require('vm');
const { ROOT, loadAll } = require('./_sandbox');
const src = fs.readFileSync(path.join(ROOT, 'js/08-giftbox-tilebacks.js'), 'utf8');
const { ctx, errors } = loadAll();
const ev = c => JSON.parse(JSON.stringify(vm.runInContext(`(${c})`, ctx)) ?? 'null');

test('読み込みでエラーが出ない', () => assert.deepStrictEqual(errors, []));

test('場の背景を付けたときの「牌の塗り替え」は、動かない裏柄（tile-animなし）だけに効く', () => {
  const rules = [...src.matchAll(/#field-wrap \.fback\{background:rgba\(20,14,8,[.\d]+\)!important\}/g)].map(m => src.slice(src.lastIndexOf('\n', m.index) + 1, m.index + m[0].length));
  assert.ok(rules.length >= 2, '背景（画像・場面）の2か所に、塗り替えがあるはずです');
  for (const r of rules) assert.ok(r.startsWith('body:not(.tile-anim) '), '動く裏柄にも効いてしまいます: ' + r);
  assert.strictEqual((src.match(/body\.tile-anim #field-wrap \.fback\{opacity:\.8\}/g) || []).length, 2, '動く裏柄を透かす指定が、2か所にありません');
});

test('動く裏柄を始めると body に tile-anim が付き、止めると外れる', () => {
  const start = src.indexOf('function refreshTileBackAnim'), stop = src.indexOf('function stopTileBackAnim');
  assert.ok(start > 0 && stop > 0);
  assert.ok(/classList\.add\('tile-anim'\)/.test(src.slice(start)), 'tile-anim を付ける処理がありません');
  const stopBody = src.slice(stop, src.indexOf('\n}', stop));
  assert.ok(/classList\.remove\('tile-anim'\)/.test(stopBody), 'tile-anim を外す処理が、止める関数にありません');
});

test('新しい牌の裏柄（タータン・ユニオン）は、動きの定義がある。ほかの動く裏柄も、これまでどおり', () => {
  for (const k of ['tartan', 'unionjack']) assert.ok(ev(`!!(TILE_BACK_ANIMS['${k}']||TILE_BACK_GLOBAL['${k}'])`), k);
  assert.ok(ev(`Object.keys(TILE_BACK_ANIMS).length+Object.keys(TILE_BACK_GLOBAL).length`) >= 10);
});

test('牌の動きを描く関数が、例外を出さない（時刻を変えて何度も呼ぶ）', () => {
  const r = vm.runInContext(`(function(){const c=document.createElement('canvas').getContext('2d');let n=0;
    for(let t=0;t<30;t+=.37){TILE_BACK_GLOBAL.tartan(c,{w:290,h:230},34,t,{},1);TILE_BACK_GLOBAL.unionjack(c,{w:290,h:230},34,t,{},1);TILE_BACK_ANIMS.tartan(c,24,36,t,.3);n++;}return n;})()`, ctx);
  assert.ok(r > 50);
});
