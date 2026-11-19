'use strict';
// 期間限定ガチャ「イギリス」：景品の内訳（新しい8・既存8・最高レア2）、ID・画像・日付の整合性、お知らせ
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path');
const { ROOT, loadAll } = require('./_sandbox');

const { ctx, errors } = loadAll();
const ev = c => JSON.parse(JSON.stringify(vm.runInContext(`(${c})`, ctx)) ?? 'null');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const G = () => ev(`LIMITED_LIST.find(x=>x.id==='uk2026')`);
const news = ev(`GIFTBOX_ITEMS.filter(i=>i.id==='info_limited_gacha_uk2026')[0]`);

test('読み込みでエラーが出ない／開催の設定がある', () => { assert.deepStrictEqual(errors, []); assert.ok(G()); });

test('内訳：最高レア2（Game Over V・VI）＋ 新しい8 ＋ 既存8。半分ずつ', () => {
  const g = G();
  const nw = ev(`GACHA_ITEMS.filter(i=>i.limited==='uk2026'&&i.rarity!=='superrare').map(i=>i.id)`);
  assert.strictEqual(nw.length, 8, '新しい景品: ' + nw.join(','));
  assert.strictEqual(g.existing.length, 8);
  assert.deepStrictEqual(ev(`GACHA_ITEMS.filter(i=>i.limited==='uk2026'&&i.rarity==='superrare').map(i=>i.id)`).sort(), ['bg_gameovera5', 'bg_gameovera6']);
  assert.deepStrictEqual(g.top.slice().sort(), ['bg_gameovera5', 'bg_gameovera6']);
});

test('レア度ごとの景品数が、新しいもの・既存のもので、同じ（コモン2・アンコモン3・レア3）', () => {
  const g = G(), cnt = ids => ev(`(function(){const c={};${JSON.stringify(ids)}.forEach(id=>{const r=GACHA_ITEMS.find(i=>i.id===id).rarity;c[r]=(c[r]||0)+1});return c;})()`);
  const nw = ev(`GACHA_ITEMS.filter(i=>i.limited==='uk2026'&&i.rarity!=='superrare').map(i=>i.id)`);
  assert.deepStrictEqual(cnt(nw), { common: 2, uncommon: 3, rare: 3 });
  assert.deepStrictEqual(cnt(g.existing), { common: 2, uncommon: 3, rare: 3 });
});

test('既存の景品は、恒常ガチャの景品（限定・イベント・黄金・実績ではない）で、実在する', () => {
  const bad = ev(`${JSON.stringify(G().existing)}.filter(id=>{const i=GACHA_ITEMS.find(x=>x.id===id);return !i||i.limited||i.event||i.gold||i.achievement||i.loginStar;})`);
  assert.deepStrictEqual(bad, []);
});

test('このガチャを開いたとき、すべてのレア度に景品がある（引いて止まらない）', () => {
  for (const r of ['common', 'uncommon', 'rare', 'superrare'])
    assert.ok(ev(`GACHA_ITEMS.filter(it=>it.rarity==='${r}'&&(it.limited==='uk2026'||LIMITED_LIST.find(x=>x.id==='uk2026').existing.includes(it.id))).length`) > 0, r);
});

test('開催期間：リブート（〜11/30）の次の日から。ほかの開催と重ならない', () => {
  const g = G(), list = ev('LIMITED_LIST'), reboot = list.find(x => x.name.includes('リブート'));
  assert.ok(g.start > reboot.end && g.start === '2026-12-01', g.start);
  assert.ok(g.start <= g.end);
  for (const o of list) if (o !== list.find(x => x.id === 'uk2026') && o.id !== g.id) assert.ok(g.end < o.start || g.start > o.end, o.name + ' と重なっています');
});

test('IDが、サーバーの受け付ける形（背景・称号・アイコン）と、保存できる形になっている', () => {
  const ids = ev(`GACHA_ITEMS.filter(i=>i.limited==='uk2026').map(i=>[i.category,i.id,i.value])`);
  for (const [cat, id] of ids) {
    assert.ok(/^[A-Za-z0-9_:\-]{1,60}$/.test(id), id);
    if (cat === 'fieldbg') assert.ok(/^bg_[a-z0-9_]{1,40}$/.test(id), id);
    if (cat === 'title') assert.ok(/^title_[a-z0-9_]{1,40}$/.test(id), id);
    if (cat === 'gicon') assert.ok(/^[a-z0-9_]{1,30}$/.test(id), id);
  }
});

test('Game Over V・VI の画像：Ⅲ・Ⅳと同じ置き場所で、サーバーが許可した場所', () => {
  const urls = ev(`['bg_gameovera5','bg_gameovera6'].map(id=>GACHA_ITEMS.find(i=>i.id===id).value)`), base = ev('_GO_BASE');
  assert.deepStrictEqual(urls, [base + 'gameovera5.png', base + 'gameovera6.png']);
  const host = new URL(base).hostname, srv = read('server.js');
  assert.ok(srv.includes(host.split('.').slice(-2).join('.')), host + ' がサーバーの許可リストにありません');
  assert.ok(fs.existsSync(path.join(ROOT, 'js/13-new-items.js')));
});

test('景品の中身：牌の裏柄のCSS・紙吹雪の色・アイコンと背景のSVGが、できている', () => {
  const css = ev(`[...document.head.children].length`); assert.ok(css != null);
  const src = read('js/13-new-items.js');
  assert.ok(src.includes('body.back-tartan .fback') && src.includes('body.back-unionjack .fback'));
  assert.strictEqual(ev(`GACHA_ITEMS.find(i=>i.id==='confetti_union').value.length`), 5);
  for (const id of ['gi_teacup', 'gi_doubledecker']) { const svg = vm.runInContext(`GICON_SVG['${id}']()`, ctx); assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>') && svg.length > 800, id); }
  for (const n of ['londonfog', 'bigben']) { const s = vm.runInContext(`LOBBY_SCENES['${n}']()`, ctx); assert.ok(s.includes('<defs>') && s.length > 3000, n); assert.ok(typeof vm.runInContext(`sceneUri('${n}')`, ctx) === 'string'); }
});

test('お知らせ：期間・天井の回数・景品の名前が、設定と同じ', () => {
  assert.ok(news, 'お知らせがありません'); const g = G(), d = news.desc, md = x => x.slice(5).replace('-', '/').replace(/^0/, '').replace('/0', '/');
  assert.ok(d.includes(`${md(g.start)} 〜 ${md(g.end)}`), '期間');
  assert.ok(d.includes(`${ev('GACHA_PITY.n')}回引くと`), '天井');
  const titles = ev(`GACHA_ITEMS.filter(i=>i.limited==='uk2026'||LIMITED_LIST.find(x=>x.id==='uk2026').existing.includes(i.id)).map(i=>i.title)`);
  const missing = titles.filter(t => !d.includes(t.replace('Game Over ', 'Game Over ').replace(/^Game Over V$/, 'Game Over V')));
  assert.deepStrictEqual(missing.filter(t => !/^Game Over V/.test(t)), [], 'お知らせにない景品');
  assert.ok(d.includes('Game Over V・VI'));
});

test('実際に引く：12/5には、このガチャの18個だけが出る。超レアは Game Over V・VI だけで、全種類が出る', () => {
  vm.runInContext(`_loginToday=()=>'2026-12-05';(function(){let a=12345;Math.random=()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};})()`, ctx);
  assert.strictEqual(vm.runInContext('isLimitedActive()', ctx), true);
  assert.strictEqual(vm.runInContext('LIMITED_GACHA.id', ctx), 'uk2026');
  const allowed = new Set(ev(`GACHA_ITEMS.filter(i=>i.limited==='uk2026').map(i=>i.id)`).concat(G().existing));
  assert.strictEqual(allowed.size, 18);
  const seen = {}, sr = new Set();
  for (let i = 0; i < 6000; i++) { const r = vm.runInContext(`(function(){const r=gachaRollOne('limited');return [r.item.id,r.rarity];})()`, ctx); seen[r[0]] = (seen[r[0]] || 0) + 1; if (r[1] === 'superrare') sr.add(r[0]); }
  assert.deepStrictEqual(Object.keys(seen).filter(id => !allowed.has(id)), [], '対象外の景品が出ました');
  assert.deepStrictEqual([...allowed].filter(id => !seen[id]), [], '一度も出ない景品があります');
  assert.deepStrictEqual([...sr].sort(), ['bg_gameovera5', 'bg_gameovera6']);
  const srShare = (seen.bg_gameovera5 + seen.bg_gameovera6) / 6000;
  assert.ok(srShare > 0.025 && srShare < 0.045, '超レアの割合 ' + srShare);
});

test('開催前・開催後は、期間限定ガチャが閉じている', () => {
  vm.runInContext(`_loginToday=()=>'2026-12-15'`, ctx); assert.strictEqual(vm.runInContext('isLimitedActive()', ctx), false);
  vm.runInContext(`_loginToday=()=>'2026-11-30'`, ctx); assert.strictEqual(vm.runInContext('LIMITED_GACHA.name', ctx), 'ハロウィン リブート');
});
