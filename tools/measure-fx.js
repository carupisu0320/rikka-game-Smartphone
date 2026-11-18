#!/usr/bin/env node
'use strict';
// =====================================================================
//  演出の測定データ（js/16-fx-sync.js）の自動更新
//   演出の絵（キャンバス）を、時間を止めた状態で1コマずつ描いて、明るさ・動きを測り、
//   「盛り上がる瞬間（音ハメ用）」と「明るさの変化」を作ります。
//
//   node tools/measure-fx.js             絵を変えた演出・新しい演出だけを測り直す（ふだんは、これ）
//   node tools/measure-fx.js --check     測り直しが必要な演出を一覧にするだけ（ブラウザ不要。CIでも使える）
//   node tools/measure-fx.js --baseline  いまの測定データを「最新」とみなして、絵のハッシュだけを記録する（最初に1回）
//   node tools/measure-fx.js --only riichi:thunder,win:book   指定した演出だけを測り直す
//   node tools/measure-fx.js --all       すべての演出を測り直す（過去の測定値は上書きされます）
//   node tools/measure-fx.js --gif       開発者マッチのGIF（img/dev-match.gif）の測定データも更新する
//   そのほか：--dry（書き込まない）／--out ファイル（別のファイルに書く）／--gif-file パス
//   必要なもの：npm i -D playwright ＆ npx playwright install chromium（--check と --baseline は不要）
// =====================================================================
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.join(__dirname, '..');
const A = require('./lib/analyze'), F = require('./lib/fxsync-file'), { loadAll } = require('./lib/sandbox');
const { INSTALL } = require('./lib/page-clock');

const args = process.argv.slice(2);
const has = f => args.includes(f), val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const FILE = path.join(ROOT, 'js/16-fx-sync.js'), OUT = val('--out') ? path.resolve(val('--out')) : FILE;
const VIEWPORT = { width: 360, height: 640 }, SEED = 12345; // 測る画面の大きさと、乱数の種（毎回同じ絵になるように固定）
const WHY = { new: '新しい演出（測定データなし）', changed: '絵のプログラムが変わった', duration: '演出の長さが変わった', unknown: 'ハッシュの記録がない' };

function loadState() {
  const text = fs.readFileSync(FILE, 'utf8'), data = F.parse(text), { ctx, errors } = loadAll();
  if (errors.length) { console.error('読み込みでエラーが出たファイルがあります：', errors); process.exit(2); }
  return { data, ctx, ...F.findStale(data, ctx) };
}
function write(data) { const t = F.serialize(data); if (has('--dry')) { console.log('（--dry：書き込みません）'); return; } fs.writeFileSync(OUT, t); console.log('書き込みました：' + path.relative(process.cwd(), OUT)); }

function staticServer() {
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.gif': 'image/gif', '.mp3': 'audio/mpeg' };
  const srv = http.createServer((q, r) => { let u = decodeURIComponent(q.url.split('?')[0]); if (u === '/') u = '/index.html'; const f = path.join(ROOT, u); if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
    fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': mime[path.extname(f)] || 'application/octet-stream' }); r.end(b); } }); });
  return new Promise(res => srv.listen(0, '127.0.0.1', () => res(srv)));
}
async function openPage() {
  let pw; try { pw = require('playwright'); } catch (e) { console.error('playwright が見つかりません。次のコマンドで入れてください：\n  npm i -D playwright && npx playwright install chromium'); process.exit(3); }
  const srv = await staticServer(), browser = await pw.chromium.launch(), page = await browser.newPage({ viewport: VIEWPORT });
  await page.route(u => !/^(127\.0\.0\.1|localhost)$/.test(u.hostname), r => r.abort()); // 外のサイト（Google・socket.io）には出ない
  await page.addInitScript(() => { window.io = () => ({ on() {}, emit() {}, connected: false, off() {}, connect() {}, disconnect() {} }); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/index.html`, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await page.evaluate(INSTALL); await page.evaluate(() => window.__stage());
  return { page, close: async () => { await browser.close(); srv.close(); } };
}

// 1つの演出を、60コマ/秒で描いて、キャンバスの明るさ・動きを測る
async function measureEffect(page, key) {
  const [kind, id] = key.split(':');
  return page.evaluate(([kind, id, seed]) => {
    const { ms, base } = window.__start(kind, id, seed), D = Math.round(ms) / 1000, N = Math.floor(D * 60 + 1e-9) + 1;
    const cv = document.querySelector('#call-fx canvas'); if (!cv) return { D, none: true };
    const c = cv.getContext('2d'), w = cv.width, h = cv.height; let prev = null; const B = [], M = [];
    for (let i = 0; i < N; i++) {
      window.__step(base + i / 60 * 1000, base);
      const d = c.getImageData(0, 0, w, h).data, L = new Float32Array((w >> 1) * (h >> 1) + 8); let k = 0, sb = 0;
      for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) { const q = (y * w + x) * 4, a = d[q + 3] / 255, l = (0.2126 * d[q] + 0.7152 * d[q + 1] + 0.0722 * d[q + 2]) * a; L[k++] = l; sb += l; } // 黒の上に重ねたときの明るさ
      let sm = 0; if (prev) for (let j = 0; j < k; j++) sm += Math.abs(L[j] - prev[j]);
      prev = L; B.push(sb / k); M.push(sm / k);
    }
    return { D, N, B, M };
  }, [kind, id, SEED]);
}

// GIF：ブラウザの ImageDecoder でコマを取り出し、1秒に30回、明るさ・動きを測る
async function measureGif(page, file) {
  const b64 = fs.readFileSync(file).toString('base64');
  return page.evaluate(async ({ b64, fps }) => {
    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0)), dec = new ImageDecoder({ data: bin, type: 'image/gif' });
    await dec.tracks.ready; const n = dec.tracks.selectedTrack.frameCount, fr = []; let t = 0;
    for (let i = 0; i < n; i++) {
      const { image } = await dec.decode({ frameIndex: i }), w = Math.max(8, image.displayWidth >> 2), h = Math.max(8, image.displayHeight >> 2), cv = new OffscreenCanvas(w, h), c = cv.getContext('2d', { willReadFrequently: true });
      c.drawImage(image, 0, 0, w, h); const d = c.getImageData(0, 0, w, h).data, L = new Float32Array(w * h);
      for (let j = 0; j < w * h; j++) { const a = d[j * 4 + 3] / 255; L[j] = (0.2126 * d[j * 4] + 0.7152 * d[j * 4 + 1] + 0.0722 * d[j * 4 + 2]) * a; }
      const dur = (image.duration || 100000) / 1e6; fr.push({ at: t, L }); t += dur; image.close();
    }
    const total = t, N = Math.floor(total * fps + 1e-9) + 1, B = [], M = []; let prev = null;
    for (let k = 0; k < N; k++) {
      const tt = k / fps; let fi = 0; for (let i = 0; i < fr.length; i++) if (fr[i].at <= tt + 1e-9) fi = i;
      const L = fr[fi].L; let sb = 0; for (let j = 0; j < L.length; j++) sb += L[j]; B.push(sb / L.length);
      let sm = 0; if (prev) for (let j = 0; j < L.length; j++) sm += Math.abs(L[j] - prev[j]); M.push(sm / L.length); prev = L;
    }
    return { total, B, M };
  }, { b64, fps: A.ENV_FPS });
}
const arr = a => '[' + a.join(',') + ']';

(async () => {
  let st = loadState();
  const stale = st.stale;
  if (has('--check')) {
    if (!stale.length) { console.log('✅ 測定データは、すべて最新です（' + st.keys.length + '個）'); return; }
    console.log(`測り直しが必要な演出：${stale.length}個` + (st.commonChanged ? '（共通の描画部品が変わったため、すべて対象です）' : ''));
    if (stale.length > 6 && stale.every(s => s.why === stale[0].why)) console.log(`  すべて：${WHY[stale[0].why]}`);
    else stale.forEach(s => console.log(`  ${s.key.padEnd(18)} ${WHY[s.why]}${s.detail ? '　' + s.detail : ''}`));
    console.log('→ node tools/measure-fx.js で測り直せます' + (stale.some(s => s.why === 'unknown') ? '（ハッシュの記録がないものは、先に --baseline）' : '')); process.exit(1);
  }
  if (has('--baseline')) { // いまのデータを最新とみなして、ハッシュだけ記録（測定データはそのまま）
    const missing = stale.filter(s => s.why === 'new' || s.why === 'duration');
    const hashes = Object.assign({}, st.data.hashes); st.keys.filter(k => st.data.fx[k] && !missing.some(m => m.key === k)).forEach(k => { hashes[k] = st.hashes[k]; }); hashes._common = st.hashes._common;
    write({ ...st.data, hashes }); console.log(`ハッシュを記録しました（${Object.keys(hashes).length - 1}個）。測定データは変えていません`);
    if (missing.length) console.log('※ 次の演出は、測定データがない／長さが違うので、記録していません（ふつうに実行すると測ります）：' + missing.map(m => m.key).join(', ')); return;
  }
  let targets;
  if (has('--all')) targets = st.keys; else if (val('--only')) targets = val('--only').split(',').map(s => s.trim()).filter(Boolean); else targets = stale.filter(s => s.why !== 'unknown').map(s => s.key);
  const unknown = stale.filter(s => s.why === 'unknown').map(s => s.key);
  if (!has('--all') && !val('--only') && unknown.length) console.log(`※ ハッシュの記録がない演出が${unknown.length}個あります。最初に1回、node tools/measure-fx.js --baseline を実行してください（いまの測定データを最新とみなして記録します）`);
  const bad = targets.filter(k => !st.keys.includes(k)); if (bad.length) { console.error('知らない演出です：' + bad.join(', ')); process.exit(2); }
  if (!targets.length && !has('--gif')) { console.log('✅ 測り直す演出は、ありません'); return; }

  if (has('--all') && !has('--dry')) console.log('⚠ --all は、すべての演出の測定値を上書きします。いまの値と測り直した値は、約6割しか一致しません（手で調整した値も消えます）。Gitで差分を見られる状態で、使ってください\n   絵を変えた演出だけを測り直すなら、--all なしで実行します');
  const { page, close } = await openPage(), data = { ...st.data, fx: { ...st.data.fx }, hashes: { ...st.data.hashes } };
  try {
    if (targets.length) console.log(`測ります：${targets.length}個（画面 ${VIEWPORT.width}x${VIEWPORT.height}・60コマ/秒）`);
    for (const k of targets) {
      const t0 = Date.now(), r = await measureEffect(page, k);
      if (r.none) { console.log(`  ${k.padEnd(18)} 絵（キャンバス）がないので、飛ばしました`); continue; }
      const e = A.entryFrom(r), old = data.fx[k], cmp = old ? A.compareOn(old.on, e.on) : null;
      data.fx[k] = e; data.hashes[k] = st.hashes[k];
      console.log(`  ${k.padEnd(18)} D=${e.D}　盛り上がる瞬間 ${e.on.length}個` + (cmp ? `（前回 ${cmp.old}個のうち ${cmp.hit}個が一致・ずれ平均 ${cmp.meanErr.toFixed(3)}秒）` : '（新規）') + `　${((Date.now() - t0) / 1000).toFixed(1)}秒`);
    }
    if (targets.length) data.hashes._common = st.hashes._common;
    if (has('--gif')) {
      const gif = val('--gif-file') ? path.resolve(val('--gif-file')) : path.join(ROOT, 'img/dev-match.gif');
      if (!fs.existsSync(gif)) { console.error('GIFが見つかりません：' + gif); process.exit(2); }
      const g = await measureGif(page, gif), bright = A.to99(g.B), motion = A.to99(g.M);
      data.tail = data.tail.replace(/const DEV_GIF_SYNC=\{[\s\S]*?\};/, `const DEV_GIF_SYNC={bright:${arr(bright)},motion:${arr(motion)}};`);
      const ms = /const DEV_MATCH_MS=(\d+)/.exec(fs.readFileSync(path.join(ROOT, 'js/14-dev-match.js'), 'utf8'));
      console.log(`GIF：長さ ${g.total.toFixed(2)}秒・${bright.length}コマぶんの測定` + (ms && Math.abs(+ms[1] - g.total * 1000) > 60 ? `\n⚠ js/14-dev-match.js の DEV_MATCH_MS=${ms[1]} と、GIFの長さが違います。DEV_MATCH_MS=${Math.round(g.total * 1000)} にしてください` : ''));
    }
  } finally { await close(); }
  write(data);
  console.log('このあと、テスト（node --test "tests/*.test.js"）を実行してください。音の聞こえ方が変わる演出は、実際に流して確かめてください');
})().catch(e => { console.error(e); process.exit(1); });
