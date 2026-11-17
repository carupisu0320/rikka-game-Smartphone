'use strict';
// セーブデータの復元（svApplyImport）が「減らさず足し合わせる」こと
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm');
const { loadAll } = require('./_sandbox');
const fs = require('fs'), path = require('path');
const { ROOT } = require('./_sandbox');

const { ctx } = loadAll();
const ev = c => vm.runInContext(c, ctx);
const LS = ctx.localStorage;
const reset = () => LS.clear();
const imp = data => ev(`svApplyImport(${JSON.stringify({ app: 'rikka', data })})`);

test('持ち物は足し合わせ、いまの端末のものは減らない', () => {
  reset(); LS.setItem('rikka_gacha', JSON.stringify({ owned: ['a', 'b'], equipped: { title: 'a' } }));
  const rep = imp({ rikka_gacha: JSON.stringify({ owned: ['b', 'c', 'd'], equipped: { title: 'zzz' } }) });
  const g = JSON.parse(LS.getItem('rikka_gacha'));
  assert.deepStrictEqual(g.owned.sort(), ['a', 'b', 'c', 'd']);
  assert.strictEqual(g.equipped.title, 'a', '装備は、いまの端末を優先');
  assert.strictEqual(rep.added, 2);
});

test('端末が空のとき、持ち物が復元される', () => {
  reset();
  imp({ rikka_gacha: JSON.stringify({ owned: ['x', 'y'], equipped: {} }) });
  assert.deepStrictEqual(JSON.parse(LS.getItem('rikka_gacha')).owned, ['x', 'y']);
});

test('花びらは多いほうになる（減らない）', () => {
  reset(); LS.setItem('rikka_petals', '500');
  imp({ rikka_petals: '100' }); assert.strictEqual(LS.getItem('rikka_petals'), '500');
  imp({ rikka_petals: '900' }); assert.strictEqual(LS.getItem('rikka_petals'), '900');
});

test('実績の解除は足し合わせ、数は大きいほう', () => {
  reset(); LS.setItem('rikka_achievements', JSON.stringify({ unlocked: ['first_win'], totalWins: 3 }));
  imp({ rikka_achievements: JSON.stringify({ unlocked: ['win_5'], totalWins: 7 }) });
  const a = JSON.parse(LS.getItem('rikka_achievements'));
  assert.deepStrictEqual(a.unlocked.sort(), ['first_win', 'win_5']);
  assert.strictEqual(a.totalWins, 7);
});

test('六華のファイルでないものは、受け付けない', () => {
  reset();
  assert.throws(() => ev(`svApplyImport({app:'other',data:{}})`));
  assert.throws(() => ev(`svApplyImport(null)`));
});

test('対象外のキー・不正な景品IDは、取り込まれない', () => {
  reset();
  const rep = imp({ evil_key: '1', rikka_gacha: JSON.stringify({ owned: ['ok_1', '__proto__', 'a b', '<script>', 'x'.repeat(100)], equipped: {} }) });
  assert.ok(rep.skipped.includes('evil_key'));
  assert.strictEqual(LS.getItem('evil_key'), null);
  assert.deepStrictEqual(JSON.parse(LS.getItem('rikka_gacha')).owned, ['ok_1']);
});

test('フレンドの合言葉(tok)が短すぎるデータは、復元しない', () => {
  reset();
  imp({ rikka_friends: JSON.stringify({ code: 'ABCDEFGH', tok: 'short', list: [] }) });
  assert.strictEqual(LS.getItem('rikka_friends'), null);
});

test('サーバー(server.js)と端末(17)で、景品IDの規則が同じ', () => {
  const sv = fs.readFileSync(path.join(ROOT, 'server.js'), 'utf8').match(/const svId = x => .*?\.test\(x\)/);
  const cl = fs.readFileSync(path.join(ROOT, 'js/17-save-guard.js'), 'utf8').match(/const _svId=x=>.*?\.test\(x\)/);
  assert.ok(sv && cl, 'どちらかの定義が見つかりません');
  const re = s => s.match(/\/\^.*?\$\//)[0];
  assert.strictEqual(re(sv[0]), re(cl[0]));
});
