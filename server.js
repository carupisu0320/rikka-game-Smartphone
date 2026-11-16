const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');

const app  = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Renderなどの中継サーバー越しに、本当のIPを見る
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer', 'X-Frame-Options': 'DENY' });
  next();
});
const srv  = http.createServer(app);
const io   = new Server(srv, {
  cors: { origin: '*', methods: ['GET','POST'] },
  maxHttpBufferSize: 1e5, // 1回に受け取る大きさの上限（約100KB）
});

const PORT = process.env.PORT || 3000;

// ── データ ──
const rooms = new Map();  // roomCode → room
const queue = [];         // クイックマッチ待機列

// ── 牌 42枚 ──
const MAX_ROOM_PLAYERS = 5; // プライベートルームの最大人数
function makeDeck() {
  const d = []; let id = 0;
  for (let t = 1; t <= 6; t++)
    for (let b = 1; b <= 6; b++) {
      d.push({ id: id++, top: t, bot: b, flip: false, discarded: false });
      if (t === b) d.push({ id: id++, top: t, bot: b, flip: false, discarded: false });
    }
  return shuffle(d);
}
function shuffle(a) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// ── 役判定 ──
const eTop = t => t.flip ? t.bot : t.top;
const eBot = t => t.flip ? t.top : t.bot;

function checkWin(hand, optRoles, forTsuide){
  // forTsuide: true のときだけ三色の直接完成を許可（ついでに完成でのみ成立する役のため）
  if(hand.length!==6)return null;
  const tops=hand.map(eTop),bots=hand.map(eBot),allBot=bots.every(v=>v===bots[0]);
  const use=r=>optRoles===null||optRoles.includes(r);
  if(use('無双')&&isMusou(hand))return{role:'無双',pts:3};
  if(allBot){const st=[...tops].sort((a,b)=>a-b);if(st.join(',') === '1,2,3,4,5,6')return{role:'六華',pts:6};}
  if(use('輝光')&&isKikou(hand))return{role:'輝光',pts:5,noBonus:true};
  if(isSanren(hand))return{role:'三連',pts:3};
  if(use('三色')&&forTsuide&&isSanshiki(hand))return{role:'三色',pts:3,noBonus:true};
  if(use('三対')&&isSantui(hand))return{role:'三対',pts:2}; // ← 5から修正（クライアント側・ルールブック表示と一致させる）
  if(allBot)return{role:'一色',pts:1};
  return null;
}
function checkTsuide(hand5, field, optRoles, riichi){
  if(hand5.length!==5)return null;
  const discards=field.filter(t=>t.discarded);
  let bestRes=null,bestPts=-1;
  discards.forEach(t=>{
    const found=findRonWinServer(hand5,t,optRoles,true); // ついでに完成でのみ三色を許可
    if(found&&found.res.pts>bestPts){
      bestPts=found.res.pts;
      const bonus=(found.res.noBonus?0:countZorome(found.hand))+(riichi?1:0);
      bestRes={role:found.res.role,pts:found.res.pts,bonus,total:found.res.pts+bonus};
    }
  });
  return bestRes;
}
function canRonServer(hand5, tile, optR){
  if(!tile) return false;
  const hand6 = [...hand5, tile];
  const lim = Math.min(1 << 6, 64);
  for(let m = 0; m < lim; m++){
    const h = hand6.map((t,i) => ({...t, flip:!!(m&(1<<i))}));
    const w = checkWin(h, optR);
    if(w) return true;
  }
  return false;
}
// canRonServerと違い、実際に上がれるフリップの組み合わせ(res・hand)を返す
// forTsuide: true のときだけ三色の完成を許可（ついでに完成専用の呼び出しで使う）
function findRonWinServer(hand5, tile, optR, forTsuide){
  if(!tile) return null;
  const hand6 = [...hand5, tile];
  const lim = Math.min(1 << 6, 64);
  for(let m = 0; m < lim; m++){
    const h = hand6.map((t,i) => ({...t, flip:!!(m&(1<<i))}));
    const w = checkWin(h, optR, forTsuide);
    if(w) return {res:w, hand:h};
  }
  return null;
}
function isSanren(hand) {
  for (let m = 0; m < 64; m++) {
    if (popcount(m) !== 3) continue;
    const g1 = [], g2 = [];
    for (let i = 0; i < 6; i++) (m & (1 << i) ? g1 : g2).push(hand[i]);
    if (isSet3(g1) && isSet3(g2)) return true;
  }
  return false;
}
function isSet3(g) {
  if (g.length !== 3) return false;
  const b = g.map(eBot);
  if (!b.every(v => v === b[0])) return false;
  const t = g.map(eTop).sort((a, b) => a - b);
  return t[1] === t[0] + 1 && t[2] === t[1] + 1;
}
function popcount(n) { let c = 0; while (n) { c += n & 1; n >>= 1; } return c; }
function countZorome(hand) { return hand.filter(t => t.top === t.bot).length; }
function isMusou(hand){
  if(!hand.every(t=>t.top===t.bot))return false;
  return new Set(hand.map(t=>t.top)).size===6;
}
function isKikou(hand){return hand.every(t=>t.top===t.bot);}
function isSanshiki(hand){
  const v=new Set();
  hand.forEach(t=>{v.add(eTop(t));v.add(eBot(t));});
  return v.size===3;
}
function isSantui(hand){
  const f={};
  hand.forEach(t=>{const k=`${eTop(t)},${eBot(t)}`;f[k]=(f[k]||0)+1;});
  return Object.values(f).every(v=>v%2===0);
}
// ── ロンの得点授受・同時ロン判定 ──
// ロンで得た点数は、ストックからではなく捨てた本人の得点チップから奪う。
// 相手の点数が足りない場合は奪えるだけ奪う（相手が0点なら何ももらえない）。
function applyRonScoreTransfer(winner, discarder, amount) {
  const taken = Math.max(0, Math.min(amount, discarder.score));
  winner.score += taken;
  discarder.score -= taken;
  return taken;
}
// 複数人が同時にロン可能でも、捨てた人（discardedByIdx）から時計回りで最も近い1人だけが有効。
function pickRonWinnerIdx(players, discardedByIdx, tile, optR) {
  const n = players.length;
  let bestIdx = -1, bestDist = Infinity;
  players.forEach((p, i) => {
    if (i === discardedByIdx) return;
    if (!canRonServer(p.hand, tile, optR)) return;
    const dist = (i - discardedByIdx + n) % n;
    if (dist < bestDist) { bestDist = dist; bestIdx = i; }
  });
  return bestIdx;
}
// 手番プレイヤー(pi)がtileを捨てたあとの共通処理：ロン可能チェック→次の手番へ。
// 手動の捨て・リーチ中の自動捨て、どちらからも呼ばれる。
// 全員リーチ中で、誰も場のどの牌でも上がれない（＝お互いの欲しい牌が相手の手牌にある）なら詰み。
// リーチ後は手牌が固定され、引いた牌をそのまま捨てるだけなので、場の牌の集合も変わらず永久に決着しない。
function isRiichiDeadlock(room) {
  if (!room.useRiichi || room.players.length < 2) return false;
  if (!room.players.every(p => p.riichi)) return false;
  const optR = room.roles !== undefined ? room.roles : null;
  return room.players.every(p => room.field.every(t => !canRonServer(p.hand, t, optR)));
}
function resolveDiscard(room, code, pi, tile) {
  tile.discarded = true;
  room.field.push(tile);
  if (isRiichiDeadlock(room)) {
    if (room.ronTimer) { clearTimeout(room.ronTimer); room.ronTimer = null; }
    room.ronPending = null;
    room.phase = 'roundEnd';
    io.to(code).emit('round_draw', { reason: 'riichi_deadlock', scores: room.players.map(p => ({ name: p.name, score: p.score })) });
    specNote(room, 'リーチ同士で決着がつかず、流局です');
    return;
  }
  const discardedTile = room.field.filter(t => t.discarded).slice(-1)[0];
  const optR = room.roles !== undefined ? room.roles : null;
  const winnerIdx = room.useRon ? pickRonWinnerIdx(room.players, pi, discardedTile, optR) : -1;
  // ターンは即座に次の人へ進める（ロン判定待ちで全員の画面が固まらないようにするため）。
  // ロンが成立しうる場合はronPendingを立てておき、5秒経つか次の人が牌を取るまでロン受付を続ける
  // （実際に閉じる処理は pick ハンドラ側と、下のタイムアウトの両方で行う）。
  room.turn = (pi + 1) % room.players.length;
  room.tphase = 'pick';
  if (winnerIdx !== -1) {
    room.ronPending = { tile: discardedTile, discardedByIdx: pi, winnerIdx };
    io.to(room.players[winnerIdx].id).emit('ron_available', { tile: discardedTile, discardedByIdx: pi, timeout: 5000 });
    room.ronTimer = setTimeout(() => {
      if (!room.ronPending) return; // 既に宣言 or 次の人のpickで閉じられている
      room.ronPending = null;
      room.ronTimer = null;
      io.to(code).emit('ron_timeout');
    }, 5000);
  }
  sendState(room);
}
// 手牌がその時点で上がれる状態かどうか（全フリップ組み合わせを試す）
function canWinNow(hand, optR) {
  const lim = Math.min(1 << hand.length, 64);
  for (let m = 0; m < lim; m++) {
    const h = hand.map((t, i) => ({ ...t, flip: !!(m & (1 << i)) }));
    if (checkWin(h, optR)) return true;
  }
  return false;
}
// 5枚の手牌がテンパイ（あと1枚で上がれる状態）かどうか。クライアント側isTenpaiと同じロジック。
// リーチ宣言時にサーバー側でも本当にテンパイしているか検証するために使う。
function isTenpaiServer(hand5, optR) {
  if (hand5.length !== 5) return false;
  for (let top = 1; top <= 6; top++)
    for (let bot = 1; bot <= 6; bot++) {
      const t = { id: 8888, top, bot, flip: false, discarded: false };
      if (canRonServer(hand5, t, optR)) return true;
    }
  return false;
}

// ── ルームユーティリティ ──
// 場の背景に使う画像URLの簡易サニタイズ。http(s)のみ許可し、
// url(...)やHTML属性から抜け出せる引用符・バックスラッシュ・括弧を含むものは拒否する。
// ガチャで入手した場の背景プリセット（'preset:<id>'の形で送られてくる。許可リストにあるものだけ通す）
const FIELD_BG_PRESETS = new Set([
  'bg_sunset', 'bg_ocean', 'bg_aurora', 'bg_gameover1', 'bg_gameover2',
  'bg_forest', 'bg_dunes', 'bg_snowfield', 'bg_fireflies', 'bg_mountain', 'bg_waves', 'bg_sakuranight', 'bg_nebula', 'bg_galaxy',
  'bg_koi', 'bg_cityrain', 'bg_fuji', 'bg_fireworks',
  'bg_lanterns', 'bg_redmoon', 'bg_pumpkinfield', 'bg_haunted', // 期間限定ガチャ・ハロウィンイベントの背景
  'bg_xmasnight', 'bg_newyearsun', 'bg_heartnight', 'bg_sakurastorm', 'bg_milkyway', 'bg_festival', 'bg_moonviewing', 'bg_gameovera3', 'bg_gameovera4', 'bg_momijiyama', 'bg_ginkgo', 'bg_utsuroi', 'bg_disc', 'bg_gravflip', 'bg_erase', 'bg_lightblade', 'bg_tankbomb', 'bg_redray', 'bg_chrono', 'bg_rewind', 'bg_cosmos', // 季節イベントの背景
]);
function sanitizeFieldBg(url) {
  if (typeof url !== 'string') return '';
  url = url.trim();
  if (url.startsWith('preset:')) { const pid = url.slice(7); return (FIELD_BG_PRESETS.has(pid) || /^bg_[a-z0-9_]{1,40}$/.test(pid)) ? url : ''; } // 新しい背景は、IDが bg_英小文字数字_ の形なら自動で通す
  if (url.length === 0 || url.length > 500) return '';
  if (!/^https:\/\//i.test(url)) return '';
  if (/["'\\()<>]/.test(url)) return '';
  if (!imageHostAllowed(url)) return '';
  return url;
}
// 他の人の画面に読み込ませる画像のURLは、このサイトのものだけ許可する。
// （知らないサイトの画像を読み込ませると、見た人のIPアドレスがそのサイトに伝わってしまうため）
// 追加したいときは、環境変数 EXTRA_IMG_HOSTS に、ドメインをカンマ区切りで書く（例: example.com,cdn.example.net）
const IMG_HOSTS = ['googleusercontent.com', 'github.io', 'githubusercontent.com', 'imgur.com', 'discordapp.com', 'discordapp.net', 'ibb.co']
  .concat((process.env.EXTRA_IMG_HOSTS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean));
function imageHostAllowed(u) {
  try { const h = new URL(u).hostname.toLowerCase(); return IMG_HOSTS.some(d => h === d || h.endsWith('.' + d)); }
  catch (e) { return false; }
}
// アイコン画像URLの簡易サニタイズ（httpsのみ。HTML属性やCSSから抜け出せる文字は拒否）
function sanitizeAvatar(url) {
  if (typeof url !== 'string') return '';
  url = url.trim();
  if (/^gicon:[a-z0-9_]{1,30}$/.test(url)) return url; // ガチャのアイコン
  if (url.length === 0 || url.length > 1000) return '';
  if (!/^https:\/\//i.test(url)) return '';
  if (/["'\\()<>\s]/.test(url)) return '';
  if (!imageHostAllowed(url)) return '';
  return url;
}
// プレイヤー名：文字列だけ・制御文字と<>を除く・20文字まで
function sanitizeName(n) {
  if (typeof n !== 'string') return 'プレイヤー';
  n = n.replace(/[\u0000-\u001F\u007F<>]/g, '').trim().slice(0, 20);
  return n || 'プレイヤー';
}
// 称号（ガチャの景品ID）。許可リストにあるIDだけ通す
const TITLE_IDS = new Set(['title_first', 'title_zoro', 'title_apprentice', 'title_fate', 'title_sight', 'title_mountain', 'title_rikka', 'title_legend', 'title_king', 'title_momijigari', 'title_haregi', 'title_kinshu']);
// 実績の報酬の称号は 'title_a_<実績ID>' の形
// 演出（リーチ・ロン・上がり）の選択。許可した名前だけを通す
const FX_STYLE_IDS = {
  riichi: new Set(['default', 'flame', 'sakura', 'ice', 'thunder', 'aura', 'thread', 'bubble', 'erase', 'disc', 'gravflip', 'forest', 'scoop', 'zipper', 'frostsuit', 'kickshot', 'dive']),
  ron:    new Set(['default', 'crimson', 'void', 'gold', 'ocean', 'rush', 'claw', 'heavyrain', 'redray', 'lightblade', 'tankbomb', 'jade', 'virus', 'magnet', 'rapier', 'strafe']),
  win:    new Set(['default', 'fireworks', 'confetti', 'star', 'royal', 'timestop', 'mend', 'sprout', 'chronolock', 'rewind', 'cosmos', 'rainbow', 'weather', 'book', 'cure', 'dino', 'stillrain']),
};
function sanitizeFx(fx) {
  const o = {};
  for (const k of Object.keys(FX_STYLE_IDS)) {
    const v = fx && typeof fx[k] === 'string' ? fx[k] : '';
    o[k] = (FX_STYLE_IDS[k].has(v) || (/^[a-z][a-z0-9]{0,23}$/.test(v) && !['constructor', 'prototype', 'valueof', 'tostring'].includes(v))) ? v : 'default'; // 新しい演出は、IDが英小文字と数字の形なら自動で通す
  }
  return o;
}
function sanitizeTitle(id) { return (typeof id === 'string' && (TITLE_IDS.has(id) || /^title_a_[a-z0-9_]{1,30}$/.test(id) || /^title_login_[0-9]{1,3}$/.test(id) || /^title_ev_[a-z0-9_]{1,30}$/.test(id) || id === 'title_gameovera' || /^title_[a-z0-9_]{1,40}$/.test(id))) ? id : ''; } // 新しい称号は、IDが title_英小文字数字_ の形なら自動で通す
function genCode() {
  let c;
  do { c = Math.random().toString(36).slice(2, 6).toUpperCase(); } while (rooms.has(c));
  return c;
}
function dealRound(room) {
  const deck = makeDeck(); let idx = 0;
  room.players.forEach(p => { p.hand = deck.slice(idx, idx + 5); idx += 5; p.riichi = false; });
  room.field = deck.slice(idx);
  room.turn = Math.floor(Math.random() * room.players.length); // ← ランダムに変更
  room.tphase = 'pick';
  room.phase = 'playing';
  if (room.forcedDiscardTimer) { clearTimeout(room.forcedDiscardTimer); room.forcedDiscardTimer = null; }
  room.forcedDiscardTileId = null;
}
// 観戦：見られるのは、場にある牌の数・捨て牌・点数・手番と、両方のプレイヤーの手牌（場に伏せられた牌は見えない）
function specPublic(room) {
  return {
    code: room.code, phase: room.phase, turn: room.turn, tphase: room.tphase, goal: room.goal || 10,
    scores: room.players.map(p => ({ name: p.name, score: p.score, riichi: p.riichi || false, hand: p.hand.length, tiles: p.hand.map(t => ({ id: t.id, top: t.top, bot: t.bot, flip: !!t.flip })) })),
    fieldCount: room.field.filter(t => !t.discarded).length,
    discards: room.field.filter(t => t.discarded).map(t => ({ id: t.id, top: t.top, bot: t.bot, flip: !!t.flip })),
  };
}
function sendSpec(room, sock) { const d = specPublic(room); if (sock) sock.emit('spec_state', d); else io.to('spec:' + room.code).emit('spec_state', d); }
// CPU戦の観戦：対戦している本人の端末が、公開してよい情報だけを送り、サーバーが観戦者に中継する
function botSpecCount(code) { const t = presence.get(code); if (!t) return; const n = (io.sockets.adapter.rooms.get('spec:bot:' + code) || { size: 0 }).size; io.to(t.sid).emit('spec_count', { n }); }
function endBotSpec(code, name) { const r = 'spec:bot:' + code; io.to(r).emit('spec_end', { text: name + ' がCPU戦を終えました' }); io.in(r).socketsLeave(r); }
function specNote(room, text) { io.to('spec:' + room.code).emit('spec_note', { text, scores: room.players.map(p => ({ name: p.name, score: p.score })) }); }
function sendState(room) {
  sendSpec(room);
  room.players.forEach((player, myIdx) => {
    io.to(player.id).emit('state', {
      myIdx,
      myHand:    player.hand,
      field:     room.field,
      turn:      room.turn,
      tphase:    room.tphase,
      phase:     room.phase,
      scores:    room.players.map(p => ({ name: p.name, score: p.score, fieldBg: p.fieldBg || '', avatar: p.avatar || '', title: p.title || '', fx: p.fx || null, riichi: p.riichi || false })),
      oppCounts: room.players.map((p, i) => i === myIdx ? -1 : p.hand.length),
      code:      room.code,
      optRoles:  room.roles !== undefined ? room.roles : null,
      useRiichi: room.useRiichi || false,
      useRon:    room.useRon    || false,
    });
  });
}
function findRoom(sid) {
  for (const r of rooms.values())
    if (r.players.some(p => p.id === sid)) return r;
  return null;
}

// ── Socket.IO ──
// ── フレンド ──
// 友だち関係は、各自の端末が持つ「フレンド一覧」から決まる。お互いの一覧に相手のコードがあるときだけ、フレンドとして表示される。
// サーバーは、いまオンラインの人の情報（名前・状態）をメモリ上に持つだけ。再起動しても、端末が一覧を送り直すので元に戻る。
const crypto = require('crypto');
const FRIEND_CODE_RE = /^[A-HJ-NP-Z2-9]{8}$/;
const presence = new Map();     // フレンドコード → { sid, name, avatar, title, friends:Set, status, room }
const sidToCode = new Map();    // socket.id → フレンドコード
const friendTokens = new Map(); // フレンドコード → 合言葉のハッシュ（他人がなりすまして登録するのを防ぐ）
// 開発者のフレンドコード（8文字）。ここに入れた人とマッチした相手に、開発者マッチの演出が流れる。
// コードは、ここに書くか、環境変数 DEV_FRIEND_CODES（カンマ区切り）に入れる。合言葉(tok)の持ち主でなければ開発者として扱われない
const DEV_FRIEND_CODES = new Set(['CUTFZG2R' /* ← 開発者のフレンドコード（端末が増えたら、カンマでつないで足す） */].concat((process.env.DEV_FRIEND_CODES || '').split(',')).map(c => c.trim().toUpperCase()).filter(Boolean));
function isDevAuth(fc, ft) {
  if (typeof fc !== 'string' || typeof ft !== 'string' || !DEV_FRIEND_CODES.has(fc) || !FRIEND_CODE_RE.test(fc) || ft.length < 16 || ft.length > 64) return false;
  const h = friendTokens.get(fc);
  return !!h && h === crypto.createHash('sha256').update(ft).digest('hex');
}

// ══ セーブデータの自動保存（サーバー側） ══════════════════════════════════
// プレイヤーの持ち物・花びら・実績・設定を、サーバーに自動で保存する。
//  ・ガチャを引いた／対戦した／カスタマイズを変えたときに、端末から自動で送られてくる（プレイヤーは何もしなくてよい）
//  ・端末のデータが消えても、同じ端末（フレンドコード＋合言葉が同じ）に戻れば、自動で復元される
//  ・Googleログインしていれば、別の端末でも、同じデータを引き継げる
//  ・景品の持ち物は「増えるだけ」。端末が古くても、サーバーの持ち物を減らすことはない
// 保存先（環境変数で選ぶ。どれも無ければ、ファイル）
//   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN … Upstash Redis（無料枠あり。再起動しても消えない）
//   FIREBASE_DB_URL (+ FIREBASE_AUTH)               … Firebase Realtime Database（REST）
//   SAVE_DIR                                        … ファイル保存の場所（初期値は ./data。Renderの無料プランは、再起動や再デプロイで消えるので注意）
const fs = require('fs'), pathMod = require('path'), httpsMod = require('https'), httpMod = require('http');
const SAVE_EXACT = ['rikka_gacha','rikka_petals','rikka_achievements','rikka_login','rikka_missions','rikka_history','rikka_giftbox_claimed','rikka_giftbox_seen','rikka_friends','rikka_avatar','rikka_back_theme','rikka_field_bg','rikka_fx','rikka_bg_anim','rikka_tile_anim','rikka_tile_scale','rikka_sound_enabled','rikka_sound_volume','rikka_icon_ack'];
const SAVE_PREFIX = ['rikka_name_', 'rikka_event_'];
const SAVE_UNION = new Set(['rikka_achievements','rikka_giftbox_claimed','rikka_giftbox_seen','rikka_icon_ack']); // 足し合わせて、減らさないもの
const SAVE_MAX_VALUE = 300 * 1024, SAVE_MAX_ACCT = 700 * 1024;
const saveKeyOk = k => typeof k === 'string' && (SAVE_EXACT.includes(k) || SAVE_PREFIX.some(p => k.startsWith(p) && k.length <= 80 && /^[A-Za-z0-9_\-]+$/.test(k)));
const svJ = s => { try { return JSON.parse(s); } catch (e) { return undefined; } };
const svId = x => typeof x === 'string' && /^[A-Za-z0-9_:\-]{1,60}$/.test(x) && x !== '__proto__' && x !== 'constructor' && x !== 'prototype';
function svMerge(a, b) { // 配列は足す／数は大きいほう／真偽は or
  if (a === undefined) return b; if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) { const s = new Set(a.map(x => JSON.stringify(x))), r = a.slice(); b.forEach(x => { const k = JSON.stringify(x); if (!s.has(k)) { s.add(k); r.push(x); } }); return r.slice(0, 3000); }
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) { const r = Object.assign({}, a); Object.keys(b).forEach(k => { if (k === '__proto__' || k === 'constructor' || k === 'prototype') return; r[k] = svMerge(a[k], b[k]); }); return r; }
  if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b);
  if (typeof a === 'boolean' && typeof b === 'boolean') return a || b;
  return a;
}
function svEquipped(e) { const o = {}; if (e && typeof e === 'object') for (const [k, v] of Object.entries(e)) if (/^[a-z_]{1,24}$/.test(k) && (v == null || (typeof v === 'string' && v.length <= 80))) o[k] = v; return o; }
// 1人ぶんのデータに、端末から届いた内容をまとめる
function saveMerge(rec, items, ever) {
  const now = Date.now();
  if (items && typeof items === 'object') for (const [k, it] of Object.entries(items)) {
    if (!saveKeyOk(k) || !it || typeof it.v !== 'string' || it.v.length > SAVE_MAX_VALUE) continue;
    let t = Number(it.t); if (!isFinite(t) || t < 0) t = 0; t = Math.min(t, now + 5 * 60000);
    const cur = rec.items[k], ct = cur ? (cur.t || 0) : 0;
    if (k === 'rikka_gacha') { // 持ち物：足し合わせ。装備は、新しいほう
      const inc = svJ(it.v) || {}, c = cur ? (svJ(cur.v) || {}) : {};
      const owned = [...new Set([].concat(Array.isArray(c.owned) ? c.owned : [], Array.isArray(inc.owned) ? inc.owned : []).filter(svId))].slice(0, 3000);
      rec.items[k] = { v: JSON.stringify({ owned, equipped: svEquipped(!cur || t >= ct ? inc.equipped : c.equipped) }), t: Math.max(t, ct) };
    } else if (k === 'rikka_petals') { // 花びら：新しいほう（使うと減るので、多いほうにはしない）
      if (!cur || t >= ct) rec.items[k] = { v: String(Math.min(1e7, Math.max(0, parseInt(it.v, 10) || 0))), t };
    } else if (k === 'rikka_history') { // 対戦の履歴：足し合わせ
      const a = cur ? svJ(cur.v) : [], b = svJ(it.v);
      if (Array.isArray(b)) rec.items[k] = { v: JSON.stringify(svMerge(Array.isArray(a) ? a : [], b).slice(0, 100)), t: Math.max(t, ct) };
    } else if (k === 'rikka_friends') { // フレンドは、一覧だけ（合言葉はサーバーに置かない）
      const L = o => (Array.isArray(o && o.list) ? o.list : []).filter(f => f && FRIEND_CODE_RE.test(f.code || '')).map(f => ({ code: f.code, name: String(f.name || '').slice(0, 40) }));
      const seen = new Set(), list = L(cur ? svJ(cur.v) : null).concat(L(svJ(it.v))).filter(f => !seen.has(f.code) && seen.add(f.code)).slice(0, 200);
      rec.items[k] = { v: JSON.stringify({ list }), t: Math.max(t, ct) };
    } else if (SAVE_UNION.has(k) || k.startsWith('rikka_event_')) { // 実績・受け取り済み・イベント：足し合わせ
      const b = svJ(it.v), a = cur ? svJ(cur.v) : undefined;
      if (b !== undefined) rec.items[k] = { v: JSON.stringify(a === undefined ? b : svMerge(a, b)), t: Math.max(t, ct) };
    } else if (!cur || t >= ct) rec.items[k] = { v: it.v, t }; // 設定など：新しいほう
  }
  if (Array.isArray(ever)) rec.ever = [...new Set([].concat(rec.ever || [], ever.filter(svId)))].slice(0, 3000);
  let size = 0; for (const v of Object.values(rec.items)) size += (v.v || '').length;
  if (size > SAVE_MAX_ACCT) throw new Error('too big');
  rec.updated = now;
}
const Saves = (() => {
  const UP_URL = process.env.UPSTASH_REDIS_REST_URL || '', UP_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || '';
  const FB = (process.env.FIREBASE_DB_URL || '').replace(/\/+$/, ''), FB_AUTH = process.env.FIREBASE_AUTH ? '?auth=' + encodeURIComponent(process.env.FIREBASE_AUTH) : '';
  const mode = UP_URL && UP_TOKEN ? 'upstash' : FB ? 'firebase' : 'file';
  const DIR = process.env.SAVE_DIR || pathMod.join(__dirname, 'data'), FILE = pathMod.join(DIR, 'saves.json');
  const mem = new Map(), MEMCAP = 4000, locks = new Map();
  let fileDb = null, fileTimer = null;
  const loadFile = () => { if (!fileDb) { try { fileDb = JSON.parse(fs.readFileSync(FILE, 'utf8')) || {}; } catch (e) { fileDb = {}; } } };
  const flushFile = () => { fileTimer = null; try { fs.mkdirSync(DIR, { recursive: true }); const tmp = FILE + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(fileDb)); fs.renameSync(tmp, FILE); } catch (e) { console.log('保存ファイルを書けませんでした', e.message); } };
  const req = (u, method, headers, body) => new Promise((res, rej) => {
    const url = new URL(u), lib = url.protocol === 'http:' ? httpMod : httpsMod;
    const r = lib.request(url, { method, headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}), timeout: 8000 }, resp => { let b = ''; resp.on('data', c => b += c); resp.on('end', () => { let data = null; try { data = JSON.parse(b); } catch (e) {} res({ status: resp.statusCode, data }); }); });
    r.on('error', rej); r.on('timeout', () => r.destroy(new Error('timeout'))); if (body) r.write(body); r.end();
  });
  async function rawGet(key) {
    if (mode === 'file') { loadFile(); return fileDb[key] || null; }
    if (mode === 'upstash') { const r = await req(UP_URL, 'POST', { Authorization: 'Bearer ' + UP_TOKEN }, JSON.stringify(['GET', 'rikka:' + key])); if (r.status !== 200) throw new Error('upstash ' + r.status); const v = r.data && r.data.result; return v ? (svJ(v) || null) : null; }
    const r = await req(`${FB}/rikka/${encodeURIComponent(key)}.json${FB_AUTH}`, 'GET'); if (r.status !== 200) throw new Error('firebase ' + r.status); return r.data && r.data.j ? (svJ(r.data.j) || null) : null;
  }
  async function rawSet(key, obj) {
    if (mode === 'file') { loadFile(); fileDb[key] = obj; if (!fileTimer) fileTimer = setTimeout(flushFile, 1500); return; }
    if (mode === 'upstash') { const r = await req(UP_URL, 'POST', { Authorization: 'Bearer ' + UP_TOKEN }, JSON.stringify(['SET', 'rikka:' + key, JSON.stringify(obj)])); if (r.status !== 200) throw new Error('upstash ' + r.status); return; }
    const r = await req(`${FB}/rikka/${encodeURIComponent(key)}.json${FB_AUTH}`, 'PUT', {}, JSON.stringify({ j: JSON.stringify(obj) })); if (r.status !== 200) throw new Error('firebase ' + r.status);
  }
  async function get(key) { if (mem.has(key)) return JSON.parse(JSON.stringify(mem.get(key))); const v = await rawGet(key); if (v) { mem.set(key, v); if (mem.size > MEMCAP) mem.delete(mem.keys().next().value); } return v ? JSON.parse(JSON.stringify(v)) : null; }
  async function set(key, obj) { try { await rawSet(key, obj); } catch (e) { await new Promise(r => setTimeout(r, 400)); await rawSet(key, obj); } mem.set(key, JSON.parse(JSON.stringify(obj))); }
  async function withLock(name, fn) { const prev = locks.get(name) || Promise.resolve(); let rel; const mine = new Promise(r => rel = r); const chain = prev.then(() => mine); locks.set(name, chain); await prev; try { return await fn(); } finally { rel(); if (locks.get(name) === chain) locks.delete(name); } }
  const sha = t => crypto.createHash('sha256').update(t).digest('hex');
  const authOk = (code, tok) => typeof code === 'string' && FRIEND_CODE_RE.test(code) && typeof tok === 'string' && tok.length >= 16 && tok.length <= 64;
  // 本人確認（フレンドコード＋合言葉）。create=true なら、初めてのコードのとき、新しく作る
  async function ensure(code, tok, create) {
    if (!authOk(code, tok)) return null;
    return withLock('code:' + code, async () => {
      const h = sha(tok), c = await get('code:' + code), known = (c && c.h) || friendTokens.get(code) || null;
      if (known && known !== h) return null;
      if (c && c.a) { const a = await get('acct:' + c.a); if (a) return a; }
      if (!create) return null;
      const id = crypto.randomBytes(12).toString('hex'), rec = { id, created: Date.now(), updated: Date.now(), devs: { [code]: h }, google: null, items: {}, ever: [] };
      await set('acct:' + id, rec); await set('code:' + code, { a: id, h }); friendTokens.set(code, h); return rec;
    });
  }
  const put = rec => withLock('acct:' + rec.id, () => set('acct:' + rec.id, rec));
  const view = rec => ({ items: rec.items, ever: rec.ever || [], google: !!rec.google });
  // 受け取った内容を、まとめて保存
  async function merge(code, tok, items, ever) { const rec = await ensure(code, tok, true); if (!rec) return null; return withLock('acct:' + rec.id, async () => { const cur = (await get('acct:' + rec.id)) || rec; saveMerge(cur, items, ever); await set('acct:' + cur.id, cur); return cur; }); }
  // Googleの本人確認
  const GCLIENT = process.env.GOOGLE_CLIENT_ID || '484492727545-9ithk5m2mglmu3erf76b3uuprmqnv30e.apps.googleusercontent.com', TOKENINFO = process.env.GOOGLE_TOKENINFO_URL || 'https://oauth2.googleapis.com/tokeninfo';
  async function verifyGoogle(cred) {
    if (typeof cred !== 'string' || cred.length > 4000 || cred.split('.').length !== 3) return null;
    const r = await req(`${TOKENINFO}?id_token=${encodeURIComponent(cred)}`, 'GET'); const d = r.data;
    if (r.status !== 200 || !d || d.aud !== GCLIENT || !/^(https:\/\/)?accounts\.google\.com$/.test(d.iss || '') || !(Number(d.exp) * 1000 > Date.now()) || typeof d.sub !== 'string' || !/^[0-9]{5,40}$/.test(d.sub)) return null;
    return { sub: d.sub };
  }
  // この端末のデータを、Googleアカウントに結びつける（すでにあれば、そちらにまとめる）
  async function link(code, tok, cred) {
    const g = await verifyGoogle(cred); if (!g) return { ok: false, err: 'google' };
    const mine = await ensure(code, tok, true); if (!mine) return { ok: false, err: 'auth' };
    const gi = await get('g:' + g.sub);
    if (gi && gi.a && gi.a !== mine.id) {
      const primary = await get('acct:' + gi.a);
      if (primary) {
        const m = await withLock('acct:' + primary.id, async () => {
          const cur = (await get('acct:' + primary.id)) || primary, other = (await get('acct:' + mine.id)) || mine;
          saveMerge(cur, other.items, other.ever); cur.devs = Object.assign({}, cur.devs, other.devs); cur.google = g.sub;
          other.merged = cur.id; await set('acct:' + cur.id, cur); await set('acct:' + other.id, other);
          for (const [c2, h2] of Object.entries(other.devs || {})) await set('code:' + c2, { a: cur.id, h: h2 });
          return cur;
        });
        return Object.assign({ ok: true, linked: true }, view(m));
      }
    }
    const m = await withLock('acct:' + mine.id, async () => { const cur = (await get('acct:' + mine.id)) || mine; cur.google = g.sub; await set('acct:' + cur.id, cur); await set('g:' + g.sub, { a: cur.id }); return cur; });
    return Object.assign({ ok: true, linked: false }, view(m));
  }
  return { mode, ensure, merge, put, view, link, authOk, codeHash: async c => { const r = await get('code:' + c); return r && r.h || null; }, flush: () => { if (mode === 'file' && fileTimer) { clearTimeout(fileTimer); flushFile(); } } };
})();
console.log(`💾 セーブデータの保存先：${Saves.mode === 'file' ? 'ファイル（' + (process.env.SAVE_DIR || './data') + '）' + (process.env.RENDER ? ' ※Renderの無料プランでは、再起動や再デプロイで消えます。UPSTASH か FIREBASE の設定をおすすめします' : '') : Saves.mode}`);
process.on('SIGTERM', () => { Saves.flush(); process.exit(0); });
process.on('SIGINT', () => { Saves.flush(); process.exit(0); });
function cleanFriends(arr, self) {
  const set = new Set();
  if (Array.isArray(arr)) for (const c of arr) { if (set.size >= 100) break; if (typeof c === 'string' && FRIEND_CODE_RE.test(c) && c !== self) set.add(c); }
  return set;
}
function friendViewFor(code) {
  const me = presence.get(code);
  if (!me) return null;
  const friends = [...me.friends].map(fc => {
    const f = presence.get(fc);
    if (f && f.friends.has(code)) return { code: fc, state: 'friend', name: f.name, avatar: f.avatar, title: f.title, status: f.status, room: f.status === 'room' ? f.room : '' };
    return { code: fc, state: f ? 'pending' : 'unknown' }; // 相手の情報は、お互いがフレンドになるまで見せない
  });
  const requests = [];
  presence.forEach((x, xc) => { if (xc !== code && x.friends.has(code) && !me.friends.has(xc)) requests.push({ code: xc, name: x.name, avatar: x.avatar }); });
  return { friends, requests };
}
function pushFriendView(code) {
  const me = presence.get(code), v = me && friendViewFor(code);
  if (v) io.to(me.sid).emit('friend_view', v);
}
function pushFriendViewsAround(code) { // 本人と、本人をフレンドに入れている人に最新の状態を送る
  pushFriendView(code);
  presence.forEach((x, xc) => { if (xc !== code && x.friends.has(code)) pushFriendView(xc); });
}
const ipSockets = new Map(); // IP → 接続数
const MIN_GAP = { save_put: 300, save_get: 1500, save_link: 2500, friend_register: 1000, friend_sync: 500, friend_status: 500, friend_invite: 2000, friend_message: 1500, spectate: 1500, bot_spec: 250, bot_spec_note: 400, quickmatch: 1500, create_room: 1500, join_room: 800, chat: 700, set_avatar: 500, set_title: 300, set_fx: 300, set_field_bg: 500 };
io.on('connection', socket => {
  const ip = String(socket.handshake.headers['x-forwarded-for'] || socket.handshake.address || '').split(',')[0].trim();
  const n = (ipSockets.get(ip) || 0) + 1;
  if (n > 60) { socket.disconnect(true); return; } // 同じIPから60接続を超えたら切る（学校などの共用回線も考えて、ゆるめ）
  ipSockets.set(ip, n);
  socket.on('disconnect', () => { const m = (ipSockets.get(ip) || 1) - 1; if (m <= 0) ipSockets.delete(ip); else ipSockets.set(ip, m); });
  socket.on('disconnect', () => {
    const c = sidToCode.get(socket.id);
    if (!c) return;
    if (socket.data.spec && socket.data.spec.startsWith('bot:')) { const tc = socket.data.spec.slice(4); setImmediate(() => botSpecCount(tc)); }
    sidToCode.delete(socket.id);
    const p = presence.get(c);
    if (p && p.sid === socket.id) { endBotSpec(c, p.name); presence.delete(c); pushFriendViewsAround(c); }
  });
  // すべての受信に共通の守り：データが無い・形がおかしい送信でサーバーが落ちないようにし、連打を止める
  const _on = socket.on.bind(socket), lastAt = {};
  socket.on = (ev, fn) => _on(ev, (...args) => {
    try {
      if (ev === 'disconnect' || ev === 'disconnecting') return fn(...args);
      const gap = MIN_GAP[ev];
      if (gap) { const t = Date.now(); if (t - (lastAt[ev] || 0) < gap) return; lastAt[ev] = t; }
      const d = args[0];
      fn((d && typeof d === 'object' && !Array.isArray(d)) ? d : {}, ...args.slice(1));
    } catch (e) { console.log('handler error', ev, e && e.message); }
  });

  // セーブデータの自動保存：端末が送ってくる内容を保存し、必要なときに返す
  socket.on('save_put', async d => {
    try { const cur = await Saves.merge(d.code, d.tok, d.items, d.ever); socket.emit('save_ack', cur ? { ok: true, seq: d.seq | 0, t: Date.now() } : { ok: false, err: 'auth', seq: d.seq | 0 }); }
    catch (e) { console.log('save_put error', e && e.message); socket.emit('save_ack', { ok: false, err: 'error', seq: d.seq | 0 }); }
  });
  socket.on('save_get', async d => {
    try { const rec = await Saves.ensure(d.code, d.tok, false); socket.emit('save_data', rec ? Object.assign({ ok: true, exists: true }, Saves.view(rec)) : { ok: Saves.authOk(d.code, d.tok), exists: false, items: {}, ever: [] }); }
    catch (e) { console.log('save_get error', e && e.message); socket.emit('save_data', { ok: false, err: 'error' }); }
  });
  socket.on('save_link', async d => {
    try { socket.emit('save_linked', await Saves.link(d.code, d.tok, d.credential)); }
    catch (e) { console.log('save_link error', e && e.message); socket.emit('save_linked', { ok: false, err: 'error' }); }
  });

  // クイックマッチ
  socket.on('quickmatch', ({ name, fieldBg, avatar, title, fx, fc, ft }) => {
    name = sanitizeName(name);
    if (queue.find(q => q.id === socket.id)) return;
    queue.push({ id: socket.id, name, fieldBg: sanitizeFieldBg(fieldBg), avatar: sanitizeAvatar(avatar), title: sanitizeTitle(title), fx: sanitizeFx(fx), dev: isDevAuth(fc, ft) });
    socket.emit('queued', { pos: queue.length });

if (queue.length >= 2) {
  const [p1, p2] = [queue.shift(), queue.shift()];
  const code = genCode();
  const room = {
    code, host: p1.id,
    roles: [], // クイックマッチ: 基本役のみ
    players: [
      { id: p1.id, name: p1.name, hand: [], score: 0, fieldBg: p1.fieldBg || '', avatar: p1.avatar || '', title: p1.title || '', fx: p1.fx, dev: !!p1.dev },
      { id: p2.id, name: p2.name, hand: [], score: 0, fieldBg: p2.fieldBg || '', avatar: p2.avatar || '', title: p2.title || '', fx: p2.fx, dev: !!p2.dev },
    ],
    field: [], turn: 0, tphase: 'pick', phase: 'playing',
  };
  rooms.set(code, room);
  io.sockets.sockets.get(p1.id)?.join(code);  // ← p1を追加（これが抜けていた）
  socket.join(code);                           // ← p2（現在のsocket）
  dealRound(room);
  // 対戦前の紹介画面用に、全員の名前・アイコン・称号を送る（you は受け取った本人の位置）
  const intro = room.players.map(p => ({ name: p.name, avatar: p.avatar || '', title: p.title || '', dev: !!p.dev }));
  room.players.forEach((p, i) => io.to(p.id).emit('matched', { code, names: room.players.map(q => q.name), players: intro, you: i }));
  sendState(room);
}
  });

  socket.on('cancel_queue', () => {
    const i = queue.findIndex(q => q.id === socket.id);
    if (i !== -1) queue.splice(i, 1);
    socket.emit('queue_cancelled', { removed: i !== -1 }); // removed:false は、すでにマッチした後
  });

  // 待機中のルームの全員に、参加者の名前・アイコン・称号を送る（you は受け取った本人の位置）
  function emitRoomUpdate(room, joinedName, leftName) {
    const names = room.players.map(p => p.name);
    const infos = room.players.map(p => ({ name: p.name, avatar: p.avatar || '', title: p.title || '' }));
    room.players.forEach((p, i) => io.to(p.id).emit('room_update', { players: names, infos, code: room.code, host: 0, you: i, max: MAX_ROOM_PLAYERS, joined: joinedName || '', left: leftName || '' }));
  }
  // 待機中のルームから抜ける。ホストが抜けたらルームを閉じる
  function leaveWaitingRoom(room, socketId) {
    const pi = room.players.findIndex(p => p.id === socketId);
    if (pi === -1) return;
    if (pi === 0) { io.to(room.code).emit('room_closed', { name: room.players[0].name }); rooms.delete(room.code); }
    else { const name = room.players[pi].name; room.players.splice(pi, 1); emitRoomUpdate(room, '', name); }
  }

  // ルーム作成
socket.on('create_room', ({ name, roles, goal, useRiichi, useRon, fieldBg, avatar, title, fx, fc, ft }) => {
    if (rooms.size >= 2000) { socket.emit('err', 'いま部屋がいっぱいです。あとでもう一度お試しください'); return; }
    name = sanitizeName(name);
    roles = Array.isArray(roles) ? roles.filter(r => typeof r === 'string').slice(0, 40).map(r => r.slice(0, 20)) : [];
    const code = genCode();
    rooms.set(code, {
      code, host: socket.id,
      roles,
      goal: [5,10,15,20,30].includes(goal) ? goal : 10,
      useRiichi: useRiichi === true,
      useRon: useRon === true,
      players: [{ id: socket.id, name, hand: [], score: 0, riichi: false, fieldBg: sanitizeFieldBg(fieldBg), avatar: sanitizeAvatar(avatar), title: sanitizeTitle(title), fx: sanitizeFx(fx), dev: isDevAuth(fc, ft) }],
      field: [], turn: 0, tphase: 'pick', phase: 'waiting',
    });
    socket.join(code);
    socket.emit('room_created', { code });
    emitRoomUpdate(rooms.get(code), '', '');
  });

  // ルーム参加
  socket.on('join_room', ({ name, code, fieldBg, avatar, title, fx, fc, ft }) => {
    name = sanitizeName(name);
    const c = String(code || '').toUpperCase().trim().slice(0, 12);
    const room = rooms.get(c);
    if (!room)                    { socket.emit('err', '部屋が見つかりません'); return; }
    if (room.phase !== 'waiting') { socket.emit('err', 'ゲームはすでに始まっています'); return; }
    if (room.players.length >= MAX_ROOM_PLAYERS) { socket.emit('err', `部屋が満員です（最大${MAX_ROOM_PLAYERS}人）`); return; }
    if (room.players.some(p => p.id === socket.id)) { socket.emit('err', 'すでに参加しています'); return; }
    if (room.players.some(p => p.name === name)) { socket.emit('err', 'この名前はすでに使われています'); return; }
    room.players.push({ id: socket.id, name, hand: [], score: 0, riichi: false, fieldBg: sanitizeFieldBg(fieldBg), avatar: sanitizeAvatar(avatar), title: sanitizeTitle(title), fx: sanitizeFx(fx), dev: isDevAuth(fc, ft) });
    socket.join(c);
    emitRoomUpdate(room, name, '');
  });

  // 待機中のルームから抜ける
  socket.on('leave_room', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'waiting') return;
    leaveWaitingRoom(room, socket.id);
    socket.leave(code);
  });

  // 称号を変更（対局中でも変更可能）
  socket.on('set_title', ({ code, id }) => {
    const room = rooms.get(code);
    if (!room) return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    room.players[pi].title = sanitizeTitle(id);
    if (room.phase !== 'waiting') sendState(room);
  });

  // 演出を変更（対局中でも変更可能）
  socket.on('set_fx', ({ code, fx }) => {
    const room = rooms.get(code);
    if (!room) return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    room.players[pi].fx = sanitizeFx(fx);
    if (room.phase !== 'waiting') sendState(room);
  });

  // フレンド機能
  socket.on('friend_register', async ({ code, tok, name, avatar, title, friends }) => {
    if (typeof code !== 'string' || !FRIEND_CODE_RE.test(code)) return;
    if (typeof tok !== 'string' || tok.length < 16 || tok.length > 64) return;
    const hash = crypto.createHash('sha256').update(tok).digest('hex');
    if (!friendTokens.has(code)) { try { const h = await Saves.codeHash(code); if (h) friendTokens.set(code, h); } catch (e) {} } // 保存してあるコードの合言葉（再起動のあとも、なりすましを防ぐ）
    if (friendTokens.has(code) && friendTokens.get(code) !== hash) { socket.emit('friend_error', 'このフレンドコードは使えません'); return; }
    if (!friendTokens.has(code)) { friendTokens.set(code, hash); if (friendTokens.size > 20000) friendTokens.delete(friendTokens.keys().next().value); }
    presence.set(code, { sid: socket.id, name: sanitizeName(name), avatar: sanitizeAvatar(avatar), title: sanitizeTitle(title), friends: cleanFriends(friends, code), status: 'lobby', room: '' });
    sidToCode.set(socket.id, code);
    pushFriendViewsAround(code);
  });
  socket.on('friend_sync', ({ friends, name, avatar, title }) => {
    const code = sidToCode.get(socket.id), p = code && presence.get(code);
    if (!p) return;
    p.friends = cleanFriends(friends, code);
    if (name !== undefined) p.name = sanitizeName(name);
    if (avatar !== undefined) p.avatar = sanitizeAvatar(avatar);
    if (title !== undefined) p.title = sanitizeTitle(title);
    pushFriendViewsAround(code);
  });
  socket.on('friend_status', ({ st, room }) => {
    const code = sidToCode.get(socket.id), p = code && presence.get(code);
    if (!p || !['lobby', 'room', 'playing', 'bot'].includes(st)) return;
    const prevSt = p.status;
    if (prevSt === 'bot' && st !== 'bot') endBotSpec(code, p.name);
    p.status = st;
    p.room = ((st === 'room' || st === 'playing') && typeof room === 'string' && /^[A-Z0-9]{3,12}$/.test(room)) ? room : '';
    pushFriendViewsAround(code);
  });
  socket.on('friend_invite', ({ to, room }) => {
    const from = sidToCode.get(socket.id), me = from && presence.get(from);
    if (!me || typeof to !== 'string' || !FRIEND_CODE_RE.test(to)) return;
    const t = presence.get(to);
    if (!t || !t.friends.has(from) || !me.friends.has(to)) return; // お互いがフレンドで、相手がオンラインのときだけ
    if (typeof room !== 'string' || !/^[A-Z0-9]{3,12}$/.test(room)) return;
    io.to(t.sid).emit('friend_invite', { from: { code: from, name: me.name }, room });
  });

  // フレンドへのメッセージ（お互いがフレンドで、相手がオンラインのときだけ届ける。保存はしない）
  socket.on('friend_message', ({ to, msg }) => {
    const from = sidToCode.get(socket.id), me = from && presence.get(from);
    if (!me || typeof to !== 'string' || !FRIEND_CODE_RE.test(to) || typeof msg !== 'string') return;
    const safe = msg.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 60);
    if (!safe) return;
    const t = presence.get(to);
    if (!t || !t.friends.has(from) || !me.friends.has(to)) { socket.emit('friend_message_ng', { to }); return; }
    io.to(t.sid).emit('friend_message', { from: { code: from, name: me.name }, msg: safe });
    socket.emit('friend_message_ok', { to });
  });

  socket.on('bot_spec', ({ state }) => {
    const me = sidToCode.get(socket.id), mp = me && presence.get(me);
    if (!mp || mp.status !== 'bot' || !state || typeof state !== 'object') return;
    const n = (v, d, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(+v) ? Math.trunc(+v) : d));
    const clean = {
      code: 'bot', phase: state.phase === 'playing' ? 'playing' : 'roundEnd', turn: n(state.turn, 0, 0, 8),
      tphase: state.tphase === 'pick' ? 'pick' : 'discard', goal: n(state.goal, 10, 1, 99),
      scores: (Array.isArray(state.scores) ? state.scores : []).slice(0, 6).map(p => ({ name: String((p && p.name) || '').slice(0, 20), score: n(p && p.score, 0, -99, 999), riichi: !!(p && p.riichi), hand: n(p && p.hand, 0, 0, 20), tiles: (Array.isArray(p && p.tiles) ? p.tiles : []).slice(0, 20).map(t => ({ id: n(t && t.id, 0, 0, 999), top: n(t && t.top, 1, 1, 6), bot: n(t && t.bot, 1, 1, 6), flip: !!(t && t.flip) })) })),
      fieldCount: n(state.fieldCount, 0, 0, 200),
      discards: (Array.isArray(state.discards) ? state.discards : []).slice(0, 120).map(t => ({ id: n(t && t.id, 0, 0, 999), top: n(t && t.top, 1, 1, 6), bot: n(t && t.bot, 1, 1, 6), flip: !!(t && t.flip) })),
    };
    mp.botState = clean;
    io.to('spec:bot:' + me).emit('spec_state', clean);
  });
  socket.on('bot_spec_note', ({ text }) => {
    const me = sidToCode.get(socket.id), mp = me && presence.get(me);
    if (!mp || mp.status !== 'bot' || typeof text !== 'string') return;
    io.to('spec:bot:' + me).emit('spec_note', { text: text.replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 80) });
  });
  // 観戦（お互いがフレンドで、相手が対戦中のときだけ。見るだけで、操作はできない）
  socket.on('spectate', ({ to }) => {
    const me = sidToCode.get(socket.id), mp = me && presence.get(me);
    if (!mp || typeof to !== 'string' || !FRIEND_CODE_RE.test(to)) return;
    const t = presence.get(to);
    if (!t || !t.friends.has(me) || !mp.friends.has(to)) { socket.emit('spec_ng', '観戦できません'); return; }
    if (t.status === 'bot') { // CPU戦の観戦
      const rn = 'spec:bot:' + to, cnt = (io.sockets.adapter.rooms.get(rn) || { size: 0 }).size;
      if (cnt >= 8) { socket.emit('spec_ng', '観戦の人数がいっぱいです'); return; }
      if (socket.data.spec) socket.leave('spec:' + socket.data.spec);
      socket.join(rn); socket.data.spec = 'bot:' + to;
      if (t.botState) socket.emit('spec_state', t.botState);
      botSpecCount(to);
      return;
    }
    const room = t.status === 'playing' ? rooms.get(t.room) : null;
    if (!room || room.phase === 'waiting' || !room.players.some(p => p.name === t.name)) { socket.emit('spec_ng', 'いま対戦していません'); return; }
    const n = (io.sockets.adapter.rooms.get('spec:' + room.code) || { size: 0 }).size;
    if (n >= 8) { socket.emit('spec_ng', '観戦の人数がいっぱいです'); return; }
    if (socket.data.spec) socket.leave('spec:' + socket.data.spec);
    socket.join('spec:' + room.code); socket.data.spec = room.code;
    sendSpec(room, socket);
  });
  socket.on('stop_spectate', () => { const s = socket.data.spec; if (s) { socket.leave('spec:' + s); socket.data.spec = ''; if (s.startsWith('bot:')) botSpecCount(s.slice(4)); } });

  // アイコン画像を変更（対局中でも変更可能）
  socket.on('set_avatar', ({ code, url }) => {
    const room = rooms.get(code);
    if (!room) return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    room.players[pi].avatar = sanitizeAvatar(url);
    if (room.phase !== 'waiting') sendState(room);
  });

  // 場の背景画像を変更（対局中でも変更可能）
  socket.on('set_field_bg', ({ code, url }) => {
    const room = rooms.get(code);
    if (!room) return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    room.players[pi].fieldBg = sanitizeFieldBg(url);
    // まだ待機中（ゲーム未開始）の場合はstateを送らない。送ると、まだ配られていない
    // ゲーム画面にクライアントが強制的に切り替わってしまうため。開始時に自然に反映される。
    if (room.phase !== 'waiting') sendState(room);
  });

  // ゲーム開始
  socket.on('start_game', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.host !== socket.id || room.players.length < 2) return;
    dealRound(room);
    const intro = room.players.map(p => ({ name: p.name, avatar: p.avatar || '', title: p.title || '', dev: !!p.dev }));
    room.players.forEach((p, i) => io.to(p.id).emit('game_start', { names: room.players.map(q => q.name), players: intro, you: i }));
    sendState(room);
  });

  // 場から引く
socket.on('pick', ({ code, fieldIdx }) => {
  const room = rooms.get(code);
  if (!room) { socket.emit('err', `[pick] ルームなし code=${code}`); return; }
  if (room.phase !== 'playing') { socket.emit('err', `[pick] phase=${room.phase}`); return; }
  const pi = room.players.findIndex(p => p.id === socket.id);
  if (pi === -1) { socket.emit('err', `[pick] プレイヤー不明 sid=${socket.id}`); return; }
  if (pi !== room.turn) { socket.emit('err', `[pick] ターン違い pi=${pi} turn=${room.turn}`); return; }
  if (room.tphase !== 'pick') { socket.emit('err', `[pick] tphase=${room.tphase}`); return; }
  if (fieldIdx < 0 || fieldIdx >= room.field.length) { socket.emit('err', `[pick] インデックス範囲外 fi=${fieldIdx} len=${room.field.length}`); return; }
  // 次の人が牌を取った時点で、前の捨て牌に対するロン受付を締め切る
  if (room.ronPending) {
    room.ronPending = null;
    clearTimeout(room.ronTimer);
    room.ronTimer = null;
    io.to(code).emit('ron_timeout');
  }
  const picked = room.field.splice(fieldIdx, 1)[0];
  const player = room.players[pi];
  player.hand.push(picked);
  room.tphase = 'discard';
  room.forcedDiscardTileId = null;
  if (room.forcedDiscardTimer) { clearTimeout(room.forcedDiscardTimer); room.forcedDiscardTimer = null; }

  // リーチ中：上がれる牌でない限り、引いた牌をそのまま自動で捨てる
  if (player.riichi) {
    const optR = room.roles !== undefined ? room.roles : null;
    if (!canWinNow(player.hand, optR)) {
      room.forcedDiscardTileId = picked.id;
      sendState(room);
      room.forcedDiscardTimer = setTimeout(() => {
        if (!room || room.phase !== 'playing' || room.tphase !== 'discard') return;
        const idx = player.hand.indexOf(picked);
        if (idx === -1) return; // 手動で先に捨てられていた場合
        room.forcedDiscardTileId = null;
        const tile = player.hand.splice(idx, 1)[0];
        resolveDiscard(room, code, pi, tile);
      }, 600);
      return;
    }
  }
  sendState(room);
});

  // 捨てる
  socket.on('discard', ({ code, tileId }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi !== room.turn || room.tphase !== 'discard') return;
    const player = room.players[pi];
    const ti = player.hand.findIndex(t => t.id === tileId);
    if (ti === -1 || player.hand.length <= 5) return;
    // リーチ中は、自動で捨てるはずの牌以外を選ぶことはできない
    if (player.riichi && room.forcedDiscardTileId != null && tileId !== room.forcedDiscardTileId) {
      socket.emit('err', 'リーチ中は引いた牌をそのまま捨てる必要があります');
      return;
    }
    if (room.forcedDiscardTimer) { clearTimeout(room.forcedDiscardTimer); room.forcedDiscardTimer = null; }
    room.forcedDiscardTileId = null;
    const tile = player.hand.splice(ti, 1)[0];
    resolveDiscard(room, code, pi, tile);
  });

  // 反転
  socket.on('flip', ({ code, tileId }) => {
    const room = rooms.get(code);
    if (!room) return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    const t = room.players[pi].hand.find(t => t.id === tileId);
    if (t) { t.flip = !t.flip; sendState(room); }
  });
// 開発者ツール: 六華強制セット
  socket.on('dev_rikka', ({ code, hand }) => {
    if (process.env.ENABLE_DEV !== '1') return; // 手牌を好きに書き換えられる開発用。本番では無効
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    room.players[pi].hand = hand && hand.length === 6
      ? hand.map((t,i) => ({id:9000+i, top:t.top, bot:t.bot, flip:false, discarded:false}))
      : Array.from({length:6}, (_, i) => ({id:9000+i, top:i+1, bot:3, flip:false, discarded:false}));
    room.turn = pi;
    room.tphase = 'discard';
    sendState(room);
  });
  socket.on('rematch_request', ({ code }) => {
    const room = rooms.get(code);
    if (!room) return;
    if (!room.rematchVotes) room.rematchVotes = new Set();
    room.rematchVotes.add(socket.id);
    const total = room.players.length;
    const waiting = room.rematchVotes.size;
    io.to(code).emit('rematch_waiting', { waiting, total });
    if (waiting >= total) {
      room.rematchVotes = new Set();
      room.players.forEach(p => { p.hand = []; p.score = 0; p.riichi = false; });
      const deck = makeDeck();
      let idx = 0;
      room.players.forEach(p => { p.hand = deck.slice(idx, idx + 5); idx += 5; });
      room.field = deck.slice(idx);
      room.turn = 0;
      room.tphase = 'pick';
      room.phase = 'playing';
      io.to(code).emit('rematch_start');
      sendState(room);
    }
  });
  // リーチ宣言
  socket.on('riichi', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing' || !room.useRiichi) return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    const player = room.players[pi];
    // 自分の手番・捨てる前（6枚)・未リーチであることをサーバー側でも確認する
    if (player.riichi || pi !== room.turn || room.tphase !== 'discard' || player.hand.length !== 6) return;
    const optR = room.roles !== undefined ? room.roles : null;
    let tenpai = false;
    player.hand.forEach((_, i) => {
      if (isTenpaiServer(player.hand.filter((_, j) => j !== i), optR)) tenpai = true;
    });
    if (!tenpai) { socket.emit('err', 'テンパイしていません'); return; }
    player.riichi = true;
    io.to(code).emit('player_riichi', { name: player.name, idx: pi });
    sendState(room);
  });

  // ロン宣言
  socket.on('ron_declare', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing' || !room.ronPending) return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi === -1) return;
    const { tile, discardedByIdx, winnerIdx } = room.ronPending;
    if (pi !== winnerIdx) { socket.emit('err', 'ロンできません'); return; } // 同時ロン時は最も近い1人だけが有効
    const found = findRonWinServer(room.players[pi].hand, tile, room.roles !== undefined ? room.roles : null);
    if (!found) { socket.emit('err', 'ロンできません'); return; }
    const { res, hand: hand6 } = found;
    room.ronPending = null;
    clearTimeout(room.ronTimer);
    const bonus = (res.noBonus ? 0 : countZorome(hand6)) + (room.players[pi].riichi ? 1 : 0);
    const discarder = room.players[discardedByIdx];
    room.players[pi].hand = hand6;
    const taken = applyRonScoreTransfer(room.players[pi], discarder, res.pts + bonus);
    // 実際に奪えた額に emit する pts/bonus を合わせる（ボーナス分から先に削る）
    const cappedBonus = Math.max(0, bonus - ((res.pts + bonus) - taken));
    const cappedPts = taken - cappedBonus;
    room.phase = 'roundEnd';
    const tsuideList = [];
    room.players.forEach((p, i) => {
      if (i === pi || i === discardedByIdx) return;
      const tr = checkTsuide(p.hand, room.field, room.roles !== undefined ? room.roles : null, p.riichi);
      if (tr) { p.score += tr.total; tsuideList.push({ name: p.name, role: tr.role, pts: tr.pts, bonus: tr.bonus, total: tr.total }); }
    });
    const isGameOver = room.players.some(p => p.score >= (room.goal || 10));
    io.to(code).emit('round_win', {
      winnerIdx: pi, winnerName: room.players[pi].name,
      hand: hand6, role: res.role, pts: cappedPts, bonus: cappedBonus,
      scores: room.players.map(p => ({ name: p.name, score: p.score })),
      isGameOver, tsuideList, ron: true, ronFrom: discarder.name, riichi: room.players[pi].riichi
    });
    specNote(room, `${room.players[pi].name} が ${discarder.name} からロン！（${res.role}）${isGameOver ? ' 対戦終了' : ''}`);
  });
  socket.on('chat', ({ code, msg }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;
    if (typeof msg !== 'string' || msg.trim().length === 0) return;
    const safeMsg = msg.trim().slice(0, 100);
    io.to(code).emit('chat', { name: player.name, msg: safeMsg });
  });
  // 上がり
  socket.on('win', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'playing') return;
    const pi = room.players.findIndex(p => p.id === socket.id);
    if (pi !== room.turn || room.tphase !== 'discard') return;
    const player = room.players[pi];
    if (player.hand.length !== 6) return;
const res = checkWin(player.hand, room.roles !== undefined ? room.roles : null);if (!res) { socket.emit('err', '役が揃っていません'); return; }
const bonus = (res.noBonus ? 0 : countZorome(player.hand)) + (player.riichi ? 1 : 0);
player.score += res.pts + bonus;
    room.phase = 'roundEnd';
    // ついでに完成チェック
    const tsuideList=[];
    room.players.forEach((p,i)=>{
      if(i===pi)return;
      const tr=checkTsuide(p.hand,room.field,room.roles!==undefined?room.roles:null,p.riichi);
      if(tr){
        p.score+=tr.total;
        tsuideList.push({name:p.name,role:tr.role,pts:tr.pts,bonus:tr.bonus,total:tr.total});
      }
    });
    io.to(code).emit('round_win', {
      winnerIdx:  pi,
      winnerName: player.name,
      hand:       player.hand,
      role:       res.role,
      pts:        res.pts,
      bonus,
      scores:     room.players.map(p => ({ name: p.name, score: p.score })),
      isGameOver: room.players.some(p => p.score >= (room.goal || 10)),
      tsuideList,
      riichi:     player.riichi,
    });
    specNote(room, `${player.name} が上がり！（${res.role}）${room.players.some(p => p.score >= (room.goal || 10)) ? ' 対戦終了' : ''}`);
  });

  // 次のラウンド
  socket.on('next_round', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'roundEnd') return;
    dealRound(room);
    sendState(room);
  });

  // 切断
  socket.on('disconnect', () => {
    const qi = queue.findIndex(q => q.id === socket.id);
    if (qi !== -1) queue.splice(qi, 1);
    const room = findRoom(socket.id);
    if (room) {
      const pi = room.players.findIndex(p => p.id === socket.id);
      if (pi !== -1) {
        if (room.phase === 'waiting') leaveWaitingRoom(room, socket.id); // 待機中なら、ほかの人はそのまま待てる
        else { io.to(room.code).emit('player_left', { name: room.players[pi].name }); io.to('spec:' + room.code).emit('spec_end', { text: room.players[pi].name + ' が退出しました' }); rooms.delete(room.code); }
      }
    }
  });
});

// ── 制作者へのメッセージ（不具合の報告・ご要望）──
// 届いたメッセージは、①サーバーのログ ②REPORT_WEBHOOK_URL（DiscordやSlackのWebhook）③GET /reports?key=ADMIN_KEY で確認できる。
// ※無料プランのサーバーは再起動で記憶が消えるので、Webhookを設定しておくのがおすすめ。
const REPORT_WEBHOOK_URL = process.env.REPORT_WEBHOOK_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const reports = [];            // 直近のメッセージ（メモリ上）
const reportLast = new Map();  // IP → 最後に送った時刻（連投を防ぐ）
const reportTimes = [];        // 全体の送信時刻（1時間に60件まで。Discordを埋め尽くされないため）
app.use(express.json({ limit: '20kb', inflate: false })); // 圧縮された送信は受けない（body-parser の既知の弱点を避ける。ライブラリの更新も合わせて行うこと）
app.use('/report', (req, res, next) => {
  res.set({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
// 端末情報（ブラウザの長い名札など）を、読みやすい短い形にする。Discordでは、クリックすると見える「スポイラー」に入れる。
const SCREEN_LABEL = { lobby: 'ロビー', game: '対局画面', gacha: 'ガチャ' };
function describeCtx(ctx) {
  const parts = String(ctx || '').split(' | ');
  const ua = parts[0] || '';
  const os = /CrOS/.test(ua) ? 'ChromeOS' : /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad|iPod/.test(ua) ? 'iOS' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '不明のOS';
  const m = (re) => { const r = ua.match(re); return r ? r[1] : ''; };
  const br = /Edg\//.test(ua) ? 'Edge ' + m(/Edg\/(\d+)/) : /OPR\//.test(ua) ? 'Opera ' + m(/OPR\/(\d+)/) : /Firefox\//.test(ua) ? 'Firefox ' + m(/Firefox\/(\d+)/) : /Chrome\//.test(ua) ? 'Chrome ' + m(/Chrome\/(\d+)/) : /Safari\//.test(ua) ? 'Safari ' + m(/Version\/(\d+)/) : '不明のブラウザ';
  const get = (k) => { const p = parts.find(x => x.startsWith(k + ':')); return p ? p.slice(k.length + 1) : ''; };
  const scr = get('screen'), on = get('online'), size = parts[parts.length - 1] || '';
  const short = [os + '・' + br.trim(), scr ? (SCREEN_LABEL[scr] || scr) : '', on === '1' ? 'オンライン対戦中' : (on === '0' ? 'CPU戦・オフライン' : ''), /^\d+x\d+$/.test(size) ? size.replace('x', '×') : ''].filter(Boolean).join('｜');
  return short + '\n' + String(ctx || '').replace(/\|/g, '｜');
}
const KIND_LABEL = { bug: '🐞 不具合', idea: '💡 ご要望', other: '💬 その他' };
app.post('/report', async (req, res) => {
  const ip = req.ip || '';
  const now = Date.now();
  while (reportTimes.length && now - reportTimes[0] > 3600000) reportTimes.shift();
  if (reportTimes.length >= 60) return res.status(429).json({ ok: false, error: 'いま混み合っています。しばらくしてからお試しください' });
  if (now - (reportLast.get(ip) || 0) < 20000) return res.status(429).json({ ok: false, error: '少し待ってから、もう一度送ってください' });
  const b = req.body || {};
  const clean = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, n);
  const message = clean(b.message, 1000).trim();
  if (message.length < 3) return res.status(400).json({ ok: false, error: 'メッセージを入力してください' });
  const kind = KIND_LABEL[b.kind] ? b.kind : 'other';
  const r = { at: new Date().toISOString(), kind, message, name: clean(b.name, 30), contact: clean(b.contact, 100), ctx: clean(b.ctx, 300) };
  reportLast.set(ip, now); reportTimes.push(now);
  if (reportLast.size > 500) reportLast.delete(reportLast.keys().next().value);
  reports.push(r); if (reports.length > 200) reports.shift();
  console.log('📨 report', JSON.stringify(r));
  if (REPORT_WEBHOOK_URL && typeof fetch === 'function') {
    const text = `${KIND_LABEL[kind]}｜${r.name || '名無し'}${r.contact ? `｜連絡先: ${r.contact}` : ''}\n${message}\n🔎 端末情報（クリックで表示）：||${describeCtx(r.ctx).replace(/\|\|/g, '')}||`.replace(/@/g, '@\u200b').slice(0, 1900);
    try { await fetch(REPORT_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(/discord(app)?\.com\//.test(REPORT_WEBHOOK_URL) ? { content: text, allowed_mentions: { parse: [] } } : { text }) }); }
    catch (e) { console.log('webhook failed', e.message); }
  }
  res.json({ ok: true });
});
app.get('/reports', (req, res) => {
  const k = String(req.query.key || '');
  const ok = ADMIN_KEY && k.length === ADMIN_KEY.length && require('crypto').timingSafeEqual(Buffer.from(k), Buffer.from(ADMIN_KEY));
  if (!ok) return res.status(403).send('forbidden');
  res.json(reports.slice().reverse());
});

srv.listen(PORT, () => console.log(`🀄 六華サーバー http://localhost:${PORT}`));
