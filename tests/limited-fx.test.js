'use strict';
// 期間限定ガチャの特別な演出：テーマの登録漏れ・溜めの長さ・飾りの出し分け
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path');
const { ROOT, loadAll } = require('./_sandbox');

const { ctx, errors } = loadAll();
const run = c => vm.runInContext(c, ctx);
const ev = c => JSON.parse(JSON.stringify(run(`(${c})`)) ?? 'null');
const LS = ctx.localStorage;

test('読み込みでエラーが出ない', () => assert.deepStrictEqual(errors, []));

test('これまでの期間限定ガチャ（すべて）に、演出のテーマが登録されている', () => {
  const ids = ev(`[...new Set(LIMITED_LIST.map(x=>String(x.id)))]`), themes = ev('Object.keys(LIMITED_FX)');
  assert.ok(ids.length >= 3);
  assert.deepStrictEqual(ids.filter(id => !themes.includes(id)), [], 'テーマがありません → js/20-limited-fx.js の LIMITED_FX に足してください');
});

test('テーマの中身：色が #rrggbb、飾りが1つ以上、確定演出の絵がある', () => {
  for (const [id, th] of Object.entries(ev('LIMITED_FX'))) {
    for (const k of ['c1', 'c2', 'c3', 'cc']) assert.ok(/^#[0-9a-f]{6}$/i.test(th[k]), `${id}.${k}`);
    assert.ok(Array.isArray(th.glyphs) && th.glyphs.length >= 3, id + ' の飾り');
    assert.ok(th.star, id + ' の中央の絵');
  }
  assert.ok(ev('limitedFxTheme("not-registered")').glyphs.length > 0, '未登録のガチャでも、標準のテーマで動く');
});

// 溜めの長さを調べる：07 が予約するタイマーのうち、いちばん長いもの（バースト）を記録する
function charge(rarity, { banner = 'limited', calm = false } = {}) {
  LS.setItem('rikka_calm', calm ? '1' : '0');
  run(`_loginToday=()=>'2026-12-05';var __d=[];setTimeout=function(f,ms){__d.push(ms);return 0;};`);
  run(`_lastBanner='${banner}'`);
  const it = ev(`GACHA_ITEMS.find(i=>i.rarity==='${rarity}'&&(i.limited==='uk2026'||LIMITED_LIST.find(x=>x.id==='uk2026').existing.includes(i.id)))`);
  run(`startGachaFx(GACHA_ITEMS.find(i=>i.id==='${it.id}'),false)`);
  return Math.max(...ev('__d'));
}
test('期間限定ガチャの最高レアは、溜めが長い。それ以外・ほかのガチャ・光を抑える設定のときは、いつもどおり', () => {
  const base = ev('GFX_CFG.superrare.charge'), extra = ev('LIMITED_KAKU_EXTRA_MS'), rare = ev('GFX_CFG.rare.charge');
  assert.strictEqual(charge('superrare'), base + extra, '期間限定の最高レア');
  assert.strictEqual(charge('rare'), rare, 'レアは、そのまま');
  assert.strictEqual(charge('superrare', { banner: 'std' }), base, '恒常ガチャは、そのまま');
  assert.ok(charge('superrare', { calm: true }) < base, '光を抑える設定のときは、延ばさない（「動きを減らす」の流れで、短くなる）');
  assert.strictEqual(ev('GFX_CFG.superrare.charge'), base, '溜めの設定が、元に戻っていない');
});

// 飾りの出し方（にせの要素に、何が付いたかを記録する）
function decorate({ lite = false, kk = false } = {}) {
  LS.setItem('rikka_lite', lite ? '1' : '0'); LS.setItem('rikka_calm', '0');
  const log = { classes: [], props: {}, nodes: [] };
  ctx.__el = { classList: { add: c => log.classes.push(c), remove() {} }, style: { setProperty: (k, v) => { log.props[k] = v; }, removeProperty() {} },
    prepend: n => log.nodes.push(['prepend', n]), appendChild: n => log.nodes.push(['append', n]), insertBefore: (n) => log.nodes.push(['before', n]), firstChild: null };
  ctx.document = { createElement: () => ({ className: '', innerHTML: '' }), getElementById: () => null, head: { appendChild() {} } };
  run(`_loginToday=()=>'2026-12-05'`);
  run(`limitedFxDecorate(__el,{rarity:'superrare'},${kk})`);
  return log;
}
test('飾り：テーマの色が設定され、昇る飾りが14個（軽量モードは6個）、ガチャの名前が出る', () => {
  const th = ev('limitedFxTheme("uk2026")'), n = html => (html.match(/<span /g) || []).length;
  let l = decorate();
  assert.ok(l.classes.includes('ltd-fx')); assert.strictEqual(l.props['--lc'], th.c1); assert.strictEqual(l.props['--lc3'], th.c3);
  const deco = l.nodes.find(([, x]) => x.className === 'gfx-ltd')[1], name = l.nodes.find(([, x]) => x.className === 'gfx-ltdname')[1];
  assert.strictEqual(n(deco.innerHTML), 14); assert.ok(name.innerHTML.includes('イギリス'));
  assert.ok(deco.innerHTML.includes(th.glyphs[0]));
  assert.strictEqual(n(decorate({ lite: true }).nodes.find(([, x]) => x.className === 'gfx-ltd')[1].innerHTML), 6);
});
test('確定演出：最高レアのときだけ。「最高レア」と、景品の説明が出る', () => {
  assert.ok(!decorate({ kk: false }).nodes.some(([, x]) => x.className === 'gfx-ltdkk'));
  const k = decorate({ kk: true }).nodes.find(([, x]) => x.className === 'gfx-ltdkk')[1].innerHTML;
  assert.ok(k.includes('最高レア') && k.includes('Game Over V・VI'), k);
  assert.ok(!k.includes('最高レア：'), '「最高レア：」が重なって出ています');
});

test('index.html に js/20-limited-fx.js が読み込まれ、07・18 より後ろにある', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const i = n => html.indexOf(`'js/${n}`); assert.ok(i('20-limited-fx') > i('18-comfort') && i('18-comfort') > i('07-gacha-ui'));
});
