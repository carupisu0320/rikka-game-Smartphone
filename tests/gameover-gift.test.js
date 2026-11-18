'use strict';
// Game Over Ⅲ・Ⅳ と称号「国富平針店のバイト」の全員配付は終了／リブートのガチャで出る／お知らせの内容が設定と合っている
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path');
const { ROOT, loadAll } = require('./_sandbox');

const { ctx } = loadAll(); // ここで、読み込み時の「配付」が実行される
const ev = c => JSON.parse(JSON.stringify(vm.runInContext(`(${c})`, ctx)) ?? 'null');
const owned = () => (JSON.parse(ctx.localStorage.getItem('rikka_gacha') || '{}').owned || []);
const gb = fs.readFileSync(path.join(ROOT, 'js/08-giftbox-tilebacks.js'), 'utf8');
const descOf = id => (gb.match(new RegExp(`id:'${id}'[^\\n]*desc:'([^\\n]*)'[^\\n]*\\}`)) || [])[1];

test('新しく始めた人に、Game Over Ⅲ・Ⅳ も称号「国富平針店のバイト」も配られない', () => {
  assert.ok(!owned().includes('bg_gameovera3'), 'Game Over Ⅲ が配られています');
  assert.ok(!owned().includes('bg_gameovera4'), 'Game Over Ⅳ が配られています');
  assert.ok(!owned().includes('title_gameovera'), '称号が配られています');
});

test('すでに受け取った人の Game Over Ⅲ・Ⅳ は、消えない（持ち物はそのまま）', () => {
  const have = ['bg_gameovera3', 'bg_gameovera4', 'title_gameovera', 'bg_koi'];
  ctx.localStorage.setItem('rikka_gacha', JSON.stringify({ owned: have, equipped: {} }));
  vm.runInContext('backfillAchievementRewards()', ctx);
  assert.deepStrictEqual(owned().sort(), have.sort());
});

test('Game Over Ⅲ・Ⅳ は超レア、称号「国富平針店のバイト」はレアとして、リブートのガチャに出る', () => {
  assert.deepStrictEqual(ev(`GACHA_ITEMS.filter(i=>i.id==='title_gameovera').map(i=>i.rarity+':'+i.limited)`), ['rare:1']);
  const sr = ev(`GACHA_ITEMS.filter(i=>i.limited===1&&i.rarity==='superrare').map(i=>i.id)`).sort();
  assert.deepStrictEqual(sr, ['bg_gameovera3', 'bg_gameovera4']);
  const L = ev('LIMITED_LIST.find(x=>x.name.includes("リブート"))');
  assert.deepStrictEqual(L.top.slice().sort(), ['bg_gameovera3', 'bg_gameovera4']);
});

test('お知らせ：Game Over Ⅲ・Ⅳの配付終了。天井の回数・期間が、設定と同じ', () => {
  const d = descOf('info_gameover_gift_end'); assert.ok(d, 'お知らせがありません');
  const n = ev('GACHA_PITY.n'), L = ev('LIMITED_LIST.find(x=>x.name.includes("リブート"))');
  assert.ok(d.includes('配付を終了しました') && d.includes('称号「国富平針店のバイト」'));
  assert.ok(d.includes(`${n}回引くと、${n}回目で超レアが確定`), '天井の回数');
  assert.ok(d.includes(`〜${L.end.slice(5).replace('-', '/').replace(/^0/, '').replace('/0', '/')}`), '期間の終わり');
});

test('お知らせ：リブートのお知らせに、「すでに全員にお配りしています」という古い文が残っていない', () => {
  const d = descOf('info_limited_gacha_halloween_reboot');
  assert.ok(d && !d.includes('すでに全員にお配り'), '古い注意書きが残っています');
  assert.ok(d.includes('配付は終了しました'));
});

test('06-gacha-items.js に、Game Over Ⅲ・Ⅳ と称号を全員に渡す処理が残っていない', () => {
  const src = fs.readFileSync(path.join(ROOT, 'js/06-gacha-items.js'), 'utf8');
  assert.ok(!/grantItem\([^)]*(bg_gameovera[34]|title_gameovera)/.test(src) && !/\[[^\]]*(bg_gameovera[34]|title_gameovera)[^\]]*\]\.map\(id=>grantItem/.test(src), '配付の処理が残っています');
});
