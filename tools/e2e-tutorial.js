#!/usr/bin/env node
'use strict';
// 実戦チュートリアルを、本物の画面で、光った場所を実際にクリックして、最後まで進める確認（ブラウザが要ります：npm i -D playwright）
//   node tools/e2e-tutorial.js            ふだんの確認
//   node tools/e2e-tutorial.js --shots    途中の画面を /tmp/tbshots/ に保存する
//   node tools/e2e-tutorial.js --width=360   画面の幅を変えて確認する（幅の狭い端末では、6枚目の牌が手牌の枠からはみ出す）
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..'), SHOTS = process.argv.includes('--shots'), WIDTH = +((process.argv.find(a => a.startsWith('--width=')) || '--width=390').split('=')[1]);
let pw; try { pw = require('playwright'); } catch (e) { console.error('playwright が見つかりません：npm i -D playwright && npx playwright install chromium'); process.exit(3); }
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.gif': 'image/gif' };
const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html'; const f = path.join(ROOT, u);
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(b); } }); });
const fail = m => { console.error('✗ ' + m); process.exitCode = 1; };
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const browser = await pw.chromium.launch(), page = await browser.newPage({ viewport: { width: WIDTH, height: 844 } }), errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.route(u => !/^(127\.0\.0\.1|localhost)$/.test(u.hostname), r => r.abort());
  await page.addInitScript(() => { window.io = () => ({ on() {}, emit() {}, connected: false, off() {}, connect() {}, disconnect() {} }); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/index.html`, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await page.waitForTimeout(2200);
  // 初回起動の「ログインボーナス」などの画面を、閉じる
  for (let k = 0; k < 4 && await page.evaluate(() => document.getElementById('modal').classList.contains('open')); k++) { await page.evaluate(() => document.getElementById('modal').classList.remove('open')); await page.waitForTimeout(150); }
  const petals0 = await page.evaluate(() => loadPetals());
  const log = []; let shot = 0;
  await page.click('#lobby .tut-battle-btn'); await page.waitForTimeout(300);
  for (let guard = 0; guard < 400; guard++) {
    const s = await page.evaluate(() => ({ active: TB.active, i: TB.i, n: TB.steps.length, wait: TB.step && (TB.step.wait || 'next'), free: !!(TB.step && TB.step.free), typed: TB.typed, say: TB.step && (typeof TB.step.say === 'function' ? TB.step.say() : TB.step.say) }));
    if (!s.active) break;
    if (!log.length || log[log.length - 1].i !== s.i) { log.push({ i: s.i, wait: s.wait, say: String(s.say).replace(/\n/g, ' ').slice(0, 40) }); if (SHOTS) { await page.waitForTimeout(600); await page.screenshot({ path: `/tmp/tbshots/${String(s.i).padStart(2, '0')}-${s.wait}.png` }); } }
    if (!s.typed) { await page.click('#tb-text').catch(() => {}); continue; }
    if (s.wait === 'next' || s.free) { await page.click('#tb-next'); await page.waitForTimeout(60); continue; }
    if (s.wait === 'bot') { await page.waitForTimeout(300); continue; }
    const pt = await page.evaluate(() => { const r = tbRect(TB.step.target); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; });
    if (!pt) { await page.waitForTimeout(80); continue; }
    // 光っていない場所を押しても、進まない（暗い部分は、タップを止める）
    if (['pick', 'select', 'discard'].includes(s.wait) && !log[log.length - 1].probed) {
      log[log.length - 1].probed = true;
      const far = { x: pt.x < 195 ? 340 : 50, y: pt.y < 420 ? 760 : 120 }; await page.mouse.click(far.x, far.y); await page.waitForTimeout(150);
      const s2 = await page.evaluate(() => TB.i); if (s2 !== s.i) fail(`光っていない場所を押したら、進んでしまった（ステップ${s.i}）`);
    }
    await page.mouse.click(pt.x, pt.y); await page.waitForTimeout(120);
  }
  const end = await page.evaluate(() => ({ active: TB.active, screen: [...document.querySelectorAll('.screen.active')].map(e => e.id), G: G === null, layer: !!document.getElementById('tb-layer'), done: localStorage.getItem(TB_DONE_KEY), petals: loadPetals(), custom: document.getElementById('custom-modal').classList.contains('open'), side: document.getElementById('sidebar').style.display, stats: localStorage.getItem('rikka_achievements') }));
  console.log(`ステップ ${log.length}個を通過`);
  if (end.active) fail('最後まで進めませんでした：' + JSON.stringify(log[log.length - 1]));
  if (!end.screen.includes('lobby')) fail('ロビーに戻っていません：' + end.screen);
  if (!end.G || end.layer) fail('後片づけができていません');
  if (end.done !== '1') fail('クリアが記録されていません');
  if (end.petals - petals0 !== 20) fail('ごほうびの花びらが、20枚ではありません：' + (end.petals - petals0));
  if (end.custom || end.side === 'block') fail('カスタマイズ・メニューが開いたままです');
  if (end.stats && /"totalGames":[1-9]/.test(end.stats)) fail('チュートリアルが、戦績に数えられています');
  if (errs.length) fail('画面のエラー：' + errs.slice(0, 3).join(' / '));
  // もう一度やると、ごほうびは、出ない
  await page.click('#lobby .tut-battle-btn'); await page.waitForTimeout(200); await page.evaluate(() => { TB.steps[TB.steps.length - 1].enter(); }); const again = await page.evaluate(() => TB.reward);
  if (again !== 0) fail('2回目にも、ごほうびが出ます');
  await page.evaluate(() => tbExit(false));
  if (!process.exitCode) console.log('✅ 実戦チュートリアル：最後まで進み、ロビーに戻り、ごほうびは1回だけ、戦績には数えない');
  console.log(log.map(l => `${String(l.i).padStart(2)} [${l.wait}] ${l.say}`).join('\n'));
  await browser.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
