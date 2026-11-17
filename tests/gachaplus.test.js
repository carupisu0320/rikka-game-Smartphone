'use strict';
// ガチャの充実：提供割合・天井・履歴・かけら・交換・お知らせ
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path');
const { ROOT, loadAll } = require('./_sandbox');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const { ctx, errors } = loadAll();
const ev = c => JSON.parse(JSON.stringify(vm.runInContext(`(${c})`, ctx)) ?? 'null');
const run = c => vm.runInContext(c, ctx);
const LS = ctx.localStorage;
const reset = () => LS.clear();
// 乱数を固定して、抽選の流れを確かめる（r: 0〜1 の固定値、または順番に返す配列）
const rnd = r => run(`(function(){const q=${JSON.stringify([].concat(r))};let i=0;Math.random=()=>q[Math.min(i++,q.length-1)];})()`);

test('スクリプトが、エラーなく読み込める', () => assert.deepStrictEqual(errors, []));

test('提供割合：合計100%で、実際の抽選の重みと同じ。景品数はプールと一致', () => {
  for (const b of ['std', 'gold', 'limited']) {
    const R = ev(`gachaRates(${JSON.stringify(b)})`);
    assert.strictEqual(Math.round(R.reduce((s, r) => s + r.rate, 0) * 1e6) / 1e6, 100, b);
    for (const r of R) {
      assert.strictEqual(r.rate, ev(`GACHA_RARITY_INFO.${r.key}.weight`), b + ':' + r.key);
      assert.strictEqual(r.count, ev(`gachaPool('${r.key}','${b}').length`));
      assert.ok(r.count > 0, `${b}:${r.key} の景品が0個（引くと止まります）`);
      assert.ok(Math.abs(r.per * r.count - r.rate) < 1e-9);
    }
  }
});

test('天井：超レアが出ないまま続くと、50回目で超レア確定。出たら0に戻る', () => {
  reset(); rnd(0.0); // 乱数 0.0 → コモン（超レアは出ない）
  const n = run('GACHA_PITY.n');
  for (let i = 1; i < n; i++) {
    const r = ev(`gachaRollOne('std')`);
    assert.strictEqual(r.pity, false, i + '回目で天井が出た');
    assert.notStrictEqual(r.rarity, 'superrare');
  }
  assert.strictEqual(ev(`gachaPityCount('std')`), n - 1);
  assert.strictEqual(ev(`gachaPityLeft('std')`), 1);
  const last = ev(`gachaRollOne('std')`);
  assert.strictEqual(last.pity, true); assert.strictEqual(last.rarity, 'superrare');
  assert.strictEqual(ev(`gachaPityCount('std')`), 0);
});

test('天井は、ガチャごとに別々に数える', () => {
  reset(); rnd(0.0);
  for (let i = 0; i < 10; i++) run(`gachaRollOne('std')`);
  run(`gachaRollOne('gold')`);
  assert.strictEqual(ev(`gachaPityCount('std')`), 10);
  assert.strictEqual(ev(`gachaPityCount('gold')`), 1);
});

test('通常の超レアが出たときも、数えが0に戻る', () => {
  reset(); rnd(0.0);
  for (let i = 0; i < 5; i++) run(`gachaRollOne('std')`);
  rnd(0.99); // 乱数 0.99 → 超レア
  const r = ev(`gachaRollOne('std')`);
  assert.strictEqual(r.rarity, 'superrare'); assert.strictEqual(r.pity, false);
  assert.strictEqual(ev(`gachaPityCount('std')`), 0);
});

test('10連：10回目は、レア以上が確定（天井とも両立）', () => {
  reset(); rnd(0.0);
  const pt = '({})';
  const rs = ev(`(function(){const pt=${pt},a=[];for(let k=0;k<10;k++)a.push(gachaRollOne('std',{forceRare:k===9},pt).rarity);return a;})()`);
  assert.ok(['rare', 'superrare'].includes(rs[9]), '10回目: ' + rs[9]);
  assert.ok(rs.slice(0, 9).every(x => x === 'common'));
});

test('drawGachaMulti：花びらを使い、履歴が残り、天井の数えが保存される', () => {
  reset(); LS.setItem('rikka_petals', '1000'); rnd([0.0, 0.5]);
  run(`drawGachaMulti(10,'std')`);
  assert.strictEqual(ev(`gachaLogLoad().length`), 10);
  assert.ok(ev(`gachaPityCount('std')`) <= 10);
  assert.ok(parseInt(LS.getItem('rikka_petals'), 10) <= 900 + 10 * 5, '花びらが減っていない');
});

test('重複：かけらがもらえる（レア度ごと）。新しい景品はもらえない', () => {
  reset();
  const it = ev(`GACHA_ITEMS.find(i=>i.rarity==='rare')`), cm = ev(`GACHA_ITEMS.find(i=>i.rarity==='common')`);
  run(`gachaRecord([{item:GACHA_ITEMS.find(i=>i.id==='${it.id}'),isDup:true,banner:'std'},{item:GACHA_ITEMS.find(i=>i.id==='${cm.id}'),isDup:false,banner:'std'}])`);
  assert.strictEqual(ev('gachaShards()'), ev('DUP_SHARDS.rare'));
});

test('履歴は、最大300件まで', () => {
  reset();
  const it = ev(`GACHA_ITEMS[0]`);
  run(`gachaRecord(Array.from({length:350},()=>({item:GACHA_ITEMS[0],isDup:false,banner:'std'})))`);
  assert.strictEqual(ev('gachaLogLoad().length'), 300);
  assert.ok(it);
});

test('交換：かけらが足りれば、恒常ガチャの景品が手に入り、かけらが減る', () => {
  reset(); run(`confirm=()=>true`);
  const it = ev(`gachaPool('common','std')[0]`), cost = ev('SHARD_COST.common');
  assert.strictEqual(run(`gachaExchange('${it.id}')`), false, 'かけらなしで交換できてしまった');
  LS.setItem('rikka_gacha_shards', String(cost + 3));
  assert.strictEqual(run(`gachaExchange('${it.id}')`), true);
  assert.strictEqual(ev('gachaShards()'), 3);
  assert.ok(JSON.parse(LS.getItem('rikka_gacha')).owned.includes(it.id));
  assert.strictEqual(run(`gachaExchange('${it.id}')`), false, '持っているのに、また交換できた');
});

test('交換：期間限定・黄金の精神・イベントの景品は、対象外', () => {
  reset(); run(`confirm=()=>true`); LS.setItem('rikka_gacha_shards', '99999');
  for (const id of ev(`GACHA_ITEMS.filter(i=>i.limited||i.gold||i.event||i.achievement||i.loginStar).slice(0,40).map(i=>i.id)`))
    assert.strictEqual(run(`gachaExchange('${id}')`), false, id);
  assert.strictEqual(ev('gachaShards()'), 99999);
});

test('かけら交換の費用は、レア度が高いほど高い', () => {
  const c = ev('SHARD_COST'), d = ev('DUP_SHARDS');
  assert.ok(c.common < c.uncommon && c.uncommon < c.rare && c.rare < c.superrare);
  assert.ok(d.common < d.uncommon && d.uncommon < d.rare && d.rare < d.superrare);
});

test('保存：3つのキーが、端末のバックアップとサーバーの保存対象にある', () => {
  for (const [file, re] of [['js/17-save-guard.js', /const SV_EXACT=\[([^\]]*)\]/], ['server.js', /const SAVE_EXACT = \[([^\]]*)\]/]]) {
    const list = read(file).match(re)[1];
    for (const k of ['rikka_gacha_pity', 'rikka_gacha_shards', 'rikka_gacha_log']) assert.ok(list.includes(`'${k}'`), file + ' に ' + k);
  }
});

test('index.html：情報ボタン・天井の表示欄・スクリプトがある', () => {
  const html = read('index.html');
  assert.ok(html.includes('onclick="openGachaInfo()"') && /js\/19-gacha-plus\.js/.test(html));
  for (const b of ['std', 'gold', 'limited']) assert.ok(html.includes(`class="gacha-pity" data-banner="${b}"`), b);
});

test('お知らせ：リブートの日付が、期間限定ガチャの設定と同じ', () => {
  const g = ev('LIMITED_LIST.find(x=>x.name.includes("リブート"))');
  const md = d => d.slice(5).replace('-', '/').replace(/^0/, '').replace('/0', '/');
  const gb = read('js/08-giftbox-tilebacks.js');
  const m = gb.match(/id:'info_limited_gacha_halloween_reboot'[^\n]*desc:'([^\n]*)'\}/);
  assert.ok(m, 'お知らせがありません');
  assert.ok(m[1].includes(`${md(g.start)} 〜 ${md(g.end)}`), `期間が違います（設定は ${g.start}〜${g.end}）`);
});

test('お知らせ：ガチャ充実の数字が、設定と同じ', () => {
  const gb = read('js/08-giftbox-tilebacks.js');
  const m = gb.match(/id:'info_gacha_plus'[^\n]*desc:'([^\n]*)'\}/)[1];
  const P = ev('GACHA_PITY'), D = ev('DUP_SHARDS'), C = ev('SHARD_COST'), R = ev('GACHA_RARITY_INFO');
  assert.ok(m.includes(`${P.n}回引くと、${P.n}回目`), '天井の回数');
  assert.ok(m.includes(`超レア${R.superrare.weight}%・レア${R.rare.weight}%・アンコモン${R.uncommon.weight}%・コモン${R.common.weight}%`), '割合');
  assert.ok(m.includes(`コモン${D.common}・アンコモン${D.uncommon}・レア${D.rare}・超レア${D.superrare}）。`), 'かけらの数');
  assert.ok(m.includes(`コモン${C.common}・アンコモン${C.uncommon}・レア${C.rare}・超レア${C.superrare}）`), '交換の費用');
  const ids = ev('GIFTBOX_ITEMS.map(g=>g.id)');
  assert.strictEqual(new Set(ids).size, ids.length, 'お届けBOXのIDが重複');
});
