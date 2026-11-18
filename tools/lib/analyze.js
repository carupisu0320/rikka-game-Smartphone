'use strict';
// 演出の絵（キャンバス）の「明るさ」と「動き」の時系列から、測定データ（FX_SYNC の1件ぶん）を作る。ブラウザなしで動く、純粋な計算だけ
// 入力：D（秒）、B（コマごとの明るさ）、M（コマごとの動き）、どちらも 60コマ/秒
const SAMPLE_FPS = 60, ENV_FPS = 30;
const PARAMS = { w: 0.7, smooth: 3, lag: 2, thr: 0.25, gap: 0.16, refine: 3 }; // 既存データ（131個の「盛り上がる瞬間」）との照合で選んだ値（一致率 約64%・時刻のずれ 平均0.02秒）

const maxOf = a => { let m = 0; for (const x of a) if (x > m) m = x; return m || 1; };
const norm = a => { const m = maxOf(a); return a.map(x => x / m); };
const r2 = x => Math.round(x * 100) / 100;

// 明るさと動きを、それぞれ最大が1になるように直して、混ぜる（明るさ 7 ： 動き 3）
function signal(B, M, w = PARAMS.w) { const b = norm(B), m = norm(M); return b.map((x, i) => w * x + (1 - w) * m[i]); }

// env：1秒に30個、0〜99（絵の明るさ・動きの大きさ。その演出の最大を99にそろえる）。個数は floor(D*30)+1
function makeEnv(S, D) {
  const n = Math.floor(D * ENV_FPS + 1e-9) + 1, mx = maxOf(S), out = [];
  for (let j = 0; j < n; j++) out.push(Math.round(99 * S[Math.min(Math.round(j * SAMPLE_FPS / ENV_FPS), S.length - 1)] / mx));
  return out;
}

// on：絵が盛り上がる瞬間 [秒, 強さ(0〜1)]。信号の「立ち上がり（増え方）」の山を探す。いちばん強いものが 1.0
function detectOnsets(S, D, p = PARAMS) {
  const n = S.length, sm = S.map((_, i) => { let s = 0, c = 0; for (let k = -p.smooth; k <= p.smooth; k++) { const j = i + k; if (j >= 0 && j < n) { s += S[j]; c++; } } return s / c; });
  const d = sm.map((x, i) => i >= p.lag ? Math.max(0, x - sm[i - p.lag]) : 0), mx = maxOf(d), ev = [];
  for (let i = 1; i < n - 1; i++) {
    if (d[i] > 0 && d[i] >= d[i - 1] && d[i] >= d[i + 1] && d[i] >= p.thr * mx) {
      // 山の位置は、なめらかにした信号だと、少し早く出る。そこで、近くで「実際にいちばん急に明るくなった（動いた）コマ」に合わせる
      let bi = i, bv = -1;
      for (let k = Math.max(1, i - p.refine); k <= Math.min(n - 1, i + p.refine); k++) { const v = S[k] - S[k - 1]; if (v > bv) { bv = v; bi = k; } }
      ev.push([bi / SAMPLE_FPS, d[i] / mx]);
    }
  }
  ev.sort((x, y) => y[1] - x[1]);
  const keep = []; for (const e of ev) if (keep.every(k => Math.abs(k[0] - e[0]) >= p.gap)) keep.push(e);
  let on = keep.sort((x, y) => x[0] - y[0]).filter(e => e[0] >= 0 && e[0] <= D).map(([t, s]) => [r2(t), r2(s)]);
  if (!on.length) { let bi = 0; S.forEach((x, i) => { if (x > S[bi]) bi = i; }); on = [[r2(bi / SAMPLE_FPS), 1]]; } // 何も見つからないときは、いちばん明るい瞬間
  if (!on.some(e => e[1] >= 1)) { let bi = 0; on.forEach((e, i) => { if (e[1] > on[bi][1]) bi = i; }); on[bi][1] = 1; }
  return on;
}

function entryFrom({ D, B, M }) { const S = signal(B, M); return { D, on: detectOnsets(S, D), env: makeEnv(S, D) }; }

// 前回の「盛り上がる瞬間」と、どれだけ一致したか（時刻のずれ tol 秒以内）
function compareOn(oldOn, newOn, tol = 0.07) {
  const used = new Set(); let hit = 0, err = 0;
  for (const [t] of oldOn) { let bi = -1, bd = tol; newOn.forEach(([u], i) => { const d = Math.abs(u - t); if (!used.has(i) && d <= bd) { bd = d; bi = i; } }); if (bi >= 0) { used.add(bi); hit++; err += bd; } }
  return { old: oldOn.length, now: newOn.length, hit, meanErr: hit ? err / hit : 0 };
}

// GIF：コマごとの明るさ・動きを、それぞれ最大を99にそろえる
const to99 = a => { const m = maxOf(a); return a.map(x => Math.round(99 * x / m)); };

module.exports = { SAMPLE_FPS, ENV_FPS, PARAMS, signal, makeEnv, detectOnsets, entryFrom, compareOn, to99 };
