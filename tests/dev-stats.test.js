'use strict';
// 開発者用：メニューの「開発者モード」で、Googleログインの人数を見る。サーバー側で開発者かどうかを確かめ、数だけ返す
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), path = require('path'), vm = require('vm');
const { ROOT, loadAll } = require('./_sandbox');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const server = read('server.js'), html = read('index.html');

test('サーバー：dev_stats は、開発者の確認(isDevAuth)を通らないと、数を返さない', () => {
  const h = server.slice(server.indexOf("socket.on('dev_stats'"), server.indexOf("socket.on('save_link'"));
  assert.ok(h.length > 100, 'dev_stats がありません');
  assert.ok(h.indexOf('isDevAuth(d.fc, d.ft)') > 0 && h.indexOf('isDevAuth') < h.indexOf('getSaveStats'), '確認の前に、数を取っています');
  assert.ok(/err: 'forbidden'/.test(h));
  assert.ok(!/ADMIN_KEY/.test(h), '管理用の鍵は、ゲームから使わない');
});
test('サーバー：連打を防ぐ間隔(MIN_GAP)がある。/stats と同じ集計を使う', () => {
  assert.ok(/MIN_GAP = \{[^}]*dev_stats: \d+/.test(server));
  assert.ok((server.match(/getSaveStats\(\)/g) || []).length >= 3, '/stats と dev_stats が、同じ関数を使っていません');
});
test('index.html：開発者モードの中に、ボタンと結果の欄がある。21 は 14・17 より後ろ', () => {
  const a = html.indexOf('id="sb-dev-section"'), b = html.indexOf('id="assist-section"');
  const sec = html.slice(a, b);
  assert.ok(sec.includes('onclick="devStatsOpen()"') && sec.includes('id="dev-stats-out"'), '開発者モードの中にありません');
  const i = n => html.indexOf(`'js/${n}`); assert.ok(i('21-dev-stats') > i('17-save-guard') && i('17-save-guard') > i('14-dev-match'));
});

// ── クライアントの動き（にせのサーバー・画面で確かめる） ──
const { ctx, errors } = loadAll();
const run = c => vm.runInContext(c, ctx);
function setup({ sock = true, auth = true } = {}) {
  const els = {}, calls = { on: [], emit: [] };
  ctx.document = { getElementById: id => els[id] || (els[id] = { textContent: '' }) };
  ctx.__sock = { on: (e, f) => calls.on.push([e, f]), emit: (e, d) => calls.emit.push([e, d]) };
  ctx.__fire = []; ctx.setTimeout = (f, ms) => { ctx.__fire.push([f, ms]); return 1; };
  run(`_svSock=()=>${sock ? '__sock' : 'null'};devAuth=()=>(${auth ? "{fc:'ABCDEFGH',ft:'x'.repeat(20)}" : '{}'});_devStatsTimer=null;`);
  return { els, calls, out: () => els['dev-stats-out'].textContent };
}
test('読み込みでエラーが出ない', () => assert.deepStrictEqual(errors, []));
test('ボタン：サーバーにつながっていないときと、フレンドコードがないときは、送らずに案内を出す', () => {
  let t = setup({ sock: false }); run('devStatsOpen()'); assert.ok(t.out().includes('つながっていません')); assert.strictEqual(t.calls.emit.length, 0);
  t = setup({ auth: false }); run('devStatsOpen()'); assert.ok(t.out().includes('フレンド')); assert.strictEqual(t.calls.emit.length, 0);
});
test('ボタン：フレンドコードと合言葉だけを送る。受け取りの登録は、1回だけ', () => {
  const t = setup(); run('devStatsOpen()'); run('devStatsOpen()');
  assert.deepStrictEqual(t.calls.emit.map(e => e[0]), ['dev_stats', 'dev_stats']);
  assert.deepStrictEqual(Object.keys(t.calls.emit[0][1]).sort(), ['fc', 'ft']);
  assert.strictEqual(t.calls.on.filter(e => e[0] === 'dev_stats_result').length, 1);
  assert.ok(t.out().includes('数えています'));
});
test('結果：人数・セーブデータ・端末・時刻・保存先が出る。ファイル保存の注意も出る', () => {
  const t = setup(); run('devStatsOpen()');
  run(`devStatsRender({ok:true,mode:'upstash',persistent:true,takenAt:'2026-11-20T01:02:03.000Z',googleAccounts:1234,accounts:2000,devices:2500})`);
  assert.ok(t.out().includes('Googleでログインした人：1,234人') && t.out().includes('2,000件') && t.out().includes('2,500台') && t.out().includes('upstash'), t.out());
  assert.ok(!t.out().includes('⚠'));
  run(`devStatsRender({ok:true,mode:'file',persistent:false,takenAt:'2026-11-20T01:02:03.000Z',googleAccounts:3,accounts:3,devices:3,note:'ファイル保存です'})`);
  assert.ok(t.out().includes('ファイル') && t.out().includes('⚠'));
});
test('結果：開発者として確認できないとき・エラーのとき・応答がないときの案内', () => {
  const t = setup(); run('devStatsOpen()');
  run(`devStatsRender({ok:false,err:'forbidden'})`); assert.ok(t.out().includes('開発者として確認できません') && t.out().includes('DEV_FRIEND_CODES'));
  run(`devStatsRender({ok:false,err:'error'})`); assert.ok(t.out().includes('取れませんでした'));
  run('devStatsOpen()'); const [fn, ms] = ctx.__fire[ctx.__fire.length - 1]; assert.ok(ms >= 5000); fn(); assert.ok(t.out().includes('応答がありません'));
});
test('結果：数でない値が来ても、画面を壊さない（数字だけを表示）', () => {
  const t = setup(); run(`devStatsRender({ok:true,mode:'file',googleAccounts:'<b>x</b>',accounts:-5,devices:null})`);
  assert.ok(t.out().includes('0人') && !t.out().includes('<b>'));
});
