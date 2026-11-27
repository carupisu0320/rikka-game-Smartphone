'use strict';
// 実戦チュートリアル：台本の配牌が、本物のゲームの判定（役・ロン）で、狙いどおりになること／操作の通し方／ごほうび
const test = require('node:test');
const assert = require('node:assert');
const vm = require('vm'), fs = require('fs'), path = require('path'), cp = require('child_process');
const { ROOT, loadAll } = require('./_sandbox');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const { ctx, errors } = loadAll();
const run = c => vm.runInContext(c, ctx);
const ev = c => JSON.parse(JSON.stringify(run(`(${c})`)) ?? 'null');
const LS = ctx.localStorage, DOC = ctx.document; // 疑似ブラウザの画面（何を呼んでも落ちない）

test('読み込みでエラーが出ない／e2e の確認スクリプトの構文も正しい', () => {
  assert.deepStrictEqual(errors, []);
  assert.strictEqual(cp.spawnSync(process.execPath, ['--check', path.join(ROOT, 'tools/e2e-tutorial.js')]).status, 0);
});

// ── 台本の配牌（本物の役判定で確かめる） ──
const tiles = (arr, id0) => arr.map(([t, b], i) => ({ id: id0 + i, top: t, bot: b, flip: false, discarded: false }));
function win(handArr, extra, flip) { ctx.__h = [...tiles(handArr, 1), { ...tiles([extra], 99)[0], flip: !!flip }]; return ev('(function(){const r=checkWin(__h,[]);return r?{role:r.role,pts:r.pts,z:r.noBonus?0:countZorome(__h)}:null})()'); }
test('1局目：引いた牌は、そのままでは上がれず、上下反転すると「一色」（1点）になる', () => {
  const s = ev('TB_STAGES[0]'), pick = s.field[s.pickIdx];
  assert.strictEqual(win(s.hand, pick, false), null, '反転しなくても上がれてしまいます');
  assert.deepStrictEqual(win(s.hand, pick, true), { role: '一色', pts: 1, z: 0 });
});
test('2局目：引く牌は、反転しても使えない。相手が捨てる牌でロンになる（一色＋★2＝3点）', () => {
  const s = ev('TB_STAGES[1]'), pick = s.field[s.pickIdx];
  assert.strictEqual(win(s.hand, pick, false), null); assert.strictEqual(win(s.hand, pick, true), null);
  assert.deepStrictEqual(win(s.hand, s.botDiscard, false), { role: '一色', pts: 1, z: 2 });
  ctx.__h5 = tiles(s.hand, 1); ctx.__rt = { id: 99, top: s.botDiscard[0], bot: s.botDiscard[1], flip: false, discarded: true };
  assert.strictEqual(ev('canRon(__h5,__rt,[])'), true);
  const f = ev('(function(){const f=findRonWin(__h5,__rt,[]);return f&&{role:f.res.role,n:f.hand.length}})()');
  assert.deepStrictEqual(f, { role: '一色', n: 6 });
});
test('台本の形：牌のIDが重複しない／相手の手に、捨てる牌がある／場の位置が正しい', () => {
  ctx.document = { getElementById: () => ({ value: 'テスト' }) };
  try { for (const n of [0, 1]) {
    const G = ev(`tbMakeG(${n})`), s = ev(`TB_STAGES[${n}]`), all = [...G.players[0].hand, ...G.players[1].hand, ...G.field];
    assert.strictEqual(new Set(all.map(t => t.id)).size, all.length, '牌のIDが重複');
    assert.strictEqual(G.players[0].hand.length, 5); assert.strictEqual(G.players[1].hand.length, 5);
    assert.ok(G.field.length > s.pickIdx && G.field.length >= 8);
    assert.ok(G.tutorial && G.turn === 0 && G.tphase === 'pick' && G.useRiichi === false && G.optRoles.length === 0);
    if (n === 1) { assert.ok(G.players[1].hand.some(t => t.top === s.botDiscard[0] && t.bot === s.botDiscard[1]), '相手が捨てる牌が、手にありません'); assert.ok(G.field.length > s.botPickIdx); }
  } } finally { ctx.document = DOC; }
});

// ── ステップ（台本）の正しさ ──
test('ステップ：話す内容がある／待つ操作が正しい／光らせる場所が必要なものには、ある', () => {
  const steps = ev('(function(){return tbSteps().map(s=>({say:typeof s.say,wait:s.wait||"next",t:typeof s.target,fi:s.fi,idx:s.idx,free:!!s.free,last:!!s.last}))})()');
  assert.ok(steps.length >= 30);
  const OK = /^(next|pick|select|flip|discard|win|ron|bot|sidebar|custom|custom-close|tab:[a-z]+)$/;
  steps.forEach((s, i) => { assert.ok(['string', 'function'].includes(s.say), 'ステップ' + i + ' の話す内容'); assert.ok(OK.test(s.wait), `ステップ${i}: ${s.wait}`);
    if (!['next', 'bot'].includes(s.wait)) assert.notStrictEqual(s.t, 'undefined', `ステップ${i}（${s.wait}）に、光らせる場所がありません`); });
  assert.strictEqual(steps.filter(s => s.last).length, 1); assert.ok(steps[steps.length - 1].last);
  const w = steps.map(s => s.wait);
  for (const need of ['pick', 'select', 'flip', 'discard', 'win', 'bot', 'ron', 'sidebar', 'custom', 'tab:bg', 'tab:fx', 'tab:icon', 'custom-close']) assert.ok(w.includes(need), need + ' がありません');
  assert.deepStrictEqual(steps.filter(s => s.wait === 'pick').map(s => s.fi), ev('TB_STAGES.map(s=>s.pickIdx)'), '引かせる牌の位置が、台本と違います');
  assert.ok(steps.filter(s => s.wait === 'select').every(s => s.idx === 5), '選ぶのは、引いた6枚目（5番）');
  const order = ['pick', 'select', 'flip', 'win', 'pick', 'select', 'discard', 'bot', 'ron', 'sidebar', 'custom', 'tab:bg', 'tab:fx', 'tab:icon', 'custom-close'];
  let k = 0; for (const x of w) if (x === order[k]) k++; assert.strictEqual(k, order.length, '操作の順番が、想定と違います');
});
test('ステップ：光らせる場所（セレクタ）が、画面の部品として、実際にある', () => {
  const src = read('index.html') + ['js/03-game-assist.js', 'js/09-customize-learning.js', 'js/05-scenes.js', 'js/10-sound-anim-tutorial.js'].map(read).join('\n');
  const body = read('js/22-tutorial-battle.js'), sel = new Set();
  for (const m of body.matchAll(/target:'([^']+)'/g)) sel.add(m[1]);
  assert.ok(sel.size >= 12);
  for (const s of sel) for (const tok of s.match(/[#.][A-Za-z][\w-]*/g)) assert.ok(src.includes(tok.slice(1)), `${s} の ${tok} が見つかりません`);
});
test('文章：太字(**)と改行・特殊文字の扱い', () => {
  const html = ev(`(function(){const c=tbParse('あ**い<b>**う\\nえ');return tbHtml(c,c.length)})()`);
  assert.strictEqual(html, 'あ<b>い&lt;b&gt;</b>う<br>え');
});
test('結果の文章：役・点・★ボーナス・合計が出る（上がり／ロン）', () => {
  const say = ev(`(function(){const st=tbSteps();const f=st.find(s=>typeof s.say==='function'&&s.say.toString().includes('TB.result'));
    TB.result={kind:'ron',role:'一色',pts:1,bonus:2,total:3};const a=f.say();TB.result={kind:'win',role:'一色',pts:1,bonus:0,total:1};return [a,f.say()];})()`);
  assert.ok(say[0].includes('ロン！') && say[0].includes('一色') && say[0].includes('★ボーナス2点') && say[0].includes('3点') && say[0].includes('奪'));
  assert.ok(say[1].includes('上がり！') && !say[1].includes('★ボーナス') && say[1].includes('★は'));
});

// ── 操作の通し方（既存の関数を、台本どおりにだけ通す） ──
function wrapped() {
  run(`var __log=[];pickField=function(i){__log.push('pick'+i)};clickHand=function(i){__log.push('hand'+i)};doFlipSelected=function(){__log.push('flip')};doDiscard=function(){__log.push('discard')};
    doWin=function(){__log.push('REALWIN')};declareRon=function(){__log.push('REALRON')};scheduleBot=function(){__log.push('bot')};runBot=function(){__log.push('runbot')};
    openSidebar=function(){__log.push('side')};openCustomize=function(){__log.push('cust')};switchCustomizeTab=function(t){__log.push('tab'+t)};closeCustomize=function(){__log.push('close')};
    processWin=function(){__log.push('REALPROCESS')};saveHistory=function(){__log.push('REALHISTORY')};checkAchievements=function(){__log.push('REALACH');return []};
    TB.wrapped=false;tbWrap();`);
}
const log = () => ev('__log.splice(0)');
function at(step) { run(`TB.active=true;TB.steps=[${step},{say:'x'},{say:'y'}];TB.i=0;TB.step=TB.steps[0];G={tutorial:true,selIdx:5,phase:'playing',players:[{name:'x',hand:[]},{name:'y',hand:[]}],field:[]};`); log(); }
test('操作：台本が待っている操作だけが通り、次へ進む。ほかの操作は、無視される', () => {
  wrapped();
  at(`{say:'a',wait:'pick',fi:4}`); run('pickField(3)'); assert.deepStrictEqual(log(), [], '違う牌を引けてしまいます'); assert.strictEqual(ev('TB.i'), 0);
  run('doDiscard()'); assert.deepStrictEqual(log(), [], '待っていない操作が通りました');
  run('pickField(4)'); assert.deepStrictEqual(log(), ['pick4']); assert.strictEqual(ev('TB.i'), 1, '進みません');
  at(`{say:'a',wait:'select',idx:5}`); run('clickHand(2)'); assert.deepStrictEqual(log(), []); run('clickHand(5)'); assert.deepStrictEqual(log(), ['hand5']); assert.strictEqual(ev('TB.i'), 1);
  at(`{say:'a',wait:'discard'}`); run('doDiscard()'); assert.deepStrictEqual(log(), ['discard']); assert.strictEqual(ev('TB.i'), 1);
});
test('操作：反転は、牌が選ばれていないと進まない', () => {
  wrapped(); at(`{say:'a',wait:'flip'}`); run('G.selIdx=-1;doFlipSelected()'); assert.deepStrictEqual(log(), []); assert.strictEqual(ev('TB.i'), 0);
  run('G.selIdx=5;doFlipSelected()'); assert.deepStrictEqual(log(), ['flip']); assert.strictEqual(ev('TB.i'), 1);
});
test('操作：上がる・ロンは、本物の処理（戦績に数える）を呼ばない', () => {
  wrapped(); at(`{say:'a',wait:'win'}`); run('doWin()'); at(`{say:'a',wait:'ron'}`); run('declareRon()'); at(`{say:'a',wait:'pick',fi:1}`); run('doWin();declareRon()');
  const l = log(); assert.ok(!l.some(x => x.startsWith('REAL')), '本物の処理が呼ばれました: ' + l);
});
test('操作：チュートリアル中の相手は、勝手に動かない。ふつうの対局では、これまでどおり', () => {
  wrapped(); run('G={tutorial:true}'); log(); run('scheduleBot();runBot()'); assert.deepStrictEqual(log(), []);
  run('G={}'); run('scheduleBot();runBot()'); assert.deepStrictEqual(log(), ['bot', 'runbot']);
  run('TB.active=false;G={tutorial:true,selIdx:0,phase:"playing"};pickField(0);clickHand(0);doDiscard()'); assert.deepStrictEqual(log(), ['pick0', 'hand0', 'discard'], '終わったあとは、通常どおり');
});
test('操作：メニュー・カスタマイズの操作は、待っているときだけ進める。操作そのものは、いつも通る', () => {
  wrapped(); at(`{say:'a',wait:'sidebar'}`); run('openSidebar()'); assert.deepStrictEqual(log(), ['side']); assert.strictEqual(ev('TB.i'), 1);
  at(`{say:'a',wait:'tab:bg'}`); run(`switchCustomizeTab('fx')`); assert.strictEqual(ev('TB.i'), 0, '違うタブで進みました'); run(`switchCustomizeTab('bg')`); assert.strictEqual(ev('TB.i'), 1);
  assert.deepStrictEqual(log(), ['tabfx', 'tabbg']);
});

// ── ごほうび・入口 ──
test('ごほうび：初回だけ花びらがもらえる。2回目はない。0 にすれば、なし', () => {
  run(`var __pet=0;addPetals=function(n){__pet+=n};updatePetalDisplays=function(){};`); LS.removeItem('rikka_tut_battle_done');
  run('tbGrantReward()'); assert.strictEqual(ev('__pet'), ev('TB_REWARD_PETALS')); assert.strictEqual(ev('TB.reward'), ev('TB_REWARD_PETALS')); assert.strictEqual(LS.getItem('rikka_tut_battle_done'), '1');
  run('tbGrantReward()'); assert.strictEqual(ev('__pet'), ev('TB_REWARD_PETALS'), '2回目にも、もらえます'); assert.strictEqual(ev('TB.reward'), 0);
  assert.ok(ev('TB_REWARD_PETALS') >= 0 && ev('TB_REWARD_PETALS') <= 100, 'ごほうびが多すぎます');
});
test('入口：ロビーとチュートリアル画面にボタンがある。読み込みは 03・09・10 より後ろ', () => {
  const html = read('index.html');
  assert.ok((html.match(/onclick="startTutorialBattle\(\)"/g) || []).length >= 2);
  const lobby = html.slice(html.indexOf('id="lobby"'), html.indexOf('id="tutorial"')), tut = html.slice(html.indexOf('id="tutorial"'), html.indexOf('id="gacha"'));
  assert.ok(lobby.includes('startTutorialBattle') && tut.includes('startTutorialBattle'));
  const i = n => html.indexOf(`'js/${n}`); assert.ok(i('22-tutorial-battle') > i('21-dev-stats') && i('22-tutorial-battle') > i('10-sound-anim'));
});
test('開始：対局中（G がある）は始めない', () => {
  run('TB.active=false;toast=function(){};G={players:[]}');
  run('startTutorialBattle()'); assert.strictEqual(ev('TB.active'), false);
});
