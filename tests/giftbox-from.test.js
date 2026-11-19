'use strict';
// お届けBOXのお知らせを、開始日(from)から表示する仕組み／「イギリス」のお知らせは、開催初日から
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path');
const { ROOT, loadAll } = require('./_sandbox');

const { ctx, errors } = loadAll();
const ev = c => JSON.parse(JSON.stringify(vm.runInContext(`(${c})`, ctx)) ?? 'null');
const on = d => vm.runInContext(`_loginToday=()=>'${d}'`, ctx);
const ids = () => ev('giftboxItems().map(g=>g.id)');
const UK = 'info_limited_gacha_uk2026';

test('読み込みでエラーが出ない', () => assert.deepStrictEqual(errors, []));

test('「イギリス」のお知らせは、開催の初日（期間限定ガチャの開始日）から表示される', () => {
  const start = ev(`LIMITED_LIST.find(x=>x.id==='uk2026').start`);
  assert.strictEqual(ev(`GIFTBOX_ITEMS.find(g=>g.id==='${UK}').from`), start);
  on('2026-11-17'); assert.ok(!ids().includes(UK), '開催前の11/17に出ています');
  on('2026-11-30'); assert.ok(!ids().includes(UK), '開催前日の11/30に出ています');
  on(start);        assert.ok(ids().includes(UK), '初日に出ていません');
  on('2026-12-10'); assert.ok(ids().includes(UK));
});

test('from のないお知らせは、いつでも表示される。順番は、変わらない', () => {
  on('2026-11-17');
  const all = ev('GIFTBOX_ITEMS.filter(g=>!g.from).map(g=>g.id)'), shown = ids();
  assert.deepStrictEqual(shown, all);
  on('2027-01-01'); const later = ids();
  assert.deepStrictEqual(later.filter(i => i !== UK), all);
  assert.ok(ev('GIFTBOX_ITEMS.map(g=>g.id)').join() === ev('GIFTBOX_ITEMS.map(g=>g.id)').join());
});

test('開く前は「新着」にならず、開催初日に新着になる（点滅・既読の記録も、同じ基準）', () => {
  ctx.localStorage.clear(); on('2026-11-30');
  vm.runInContext('openGiftbox()', ctx);                       // 開く → 見えているお知らせが既読になる
  assert.ok(!JSON.parse(ctx.localStorage.getItem('rikka_giftbox_seen')).includes(UK), '見えていないお知らせが、既読になっています');
  assert.strictEqual(vm.runInContext('hasUnseenGift()', ctx), false);
  on('2026-12-01');
  assert.strictEqual(vm.runInContext('hasUnseenGift()', ctx), true, '初日に新着になりません');
  vm.runInContext('openGiftbox()', ctx);
  assert.ok(JSON.parse(ctx.localStorage.getItem('rikka_giftbox_seen')).includes(UK));
  assert.strictEqual(vm.runInContext('hasUnseenGift()', ctx), false);
});

test('お届けBOXを扱う関数は、GIFTBOX_ITEMS を直接使わない（日付の指定を飛ばさないため）', () => {
  const src = fs.readFileSync(path.join(ROOT, 'js/08-giftbox-tilebacks.js'), 'utf8');
  const body = src.slice(src.indexOf('function giftboxItems()') + 200);
  assert.ok(!/GIFTBOX_ITEMS/.test(body), '直接使っている箇所があります');
});
