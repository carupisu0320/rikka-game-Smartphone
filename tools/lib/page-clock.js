'use strict';
// ページの時間を止めて、こちらから1コマずつ進めるための仕掛け（演出を、同じ条件で何度でも描くため）
// ・performance.now / requestAnimationFrame / setTimeout をにせものにする（__step で進める）
// ・CSSアニメーションは、止めて、時刻をこちらで決める
// ・乱数は、決まった種から出す（花びらや火花の位置が、毎回同じになる）
module.exports.INSTALL = () => {
  const ft = window.__ft = { now: performance.now(), raf: [], timers: [], id: 0 };
  performance.now = () => ft.now;
  window.requestAnimationFrame = cb => { ft.raf.push(cb); return ft.raf.length; };
  window.cancelAnimationFrame = () => {};
  window.setTimeout = (f, ms, ...a) => { const id = ++ft.id; ft.timers.push({ id, at: ft.now + (+ms || 0), f, a }); return id; };
  window.clearTimeout = id => { ft.timers = ft.timers.filter(t => t.id !== id); };
  window.setInterval = (f, ms, ...a) => { const id = ++ft.id; ft.timers.push({ id, at: ft.now + (+ms || 0), f, a, every: Math.max(1, +ms || 1) }); return id; };
  window.clearInterval = window.clearTimeout;
  window.__seed = s => { let a = s >>> 0; Math.random = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  // 時刻 t(ミリ秒) まで進める：期限の来たタイマー → 描画の呼び出し → CSSアニメーションの時刻合わせ
  window.__step = (t, base) => {
    ft.now = t;
    for (;;) { const due = ft.timers.filter(x => x.at <= t).sort((p, q) => p.at - q.at)[0]; if (!due) break; if (due.every) due.at += due.every; else ft.timers = ft.timers.filter(x => x !== due); try { due.f(...due.a); } catch (e) {} }
    const cbs = ft.raf.splice(0); cbs.forEach(cb => { try { cb(t); } catch (e) {} });
    const root = document.getElementById('call-fx');
    if (root) document.getAnimations().forEach(a => { const el = a.effect && a.effect.target; if (el && root.contains(el)) { a.pause(); a.currentTime = t - base; } });
  };
  window.__stage = () => { // 背景を、動かない無地にして、ほかの画面を隠す
    document.body.style.background = '#1a1410';
    [...document.body.children].forEach(e => { if (e.id !== 'call-fx') e.style.visibility = 'hidden'; });
  };
  window.__start = (kind, id, seed) => {
    ft.raf.length = 0; ft.timers.length = 0; window.__seed(seed);
    try { soundEnabled = false; } catch (e) {}
    const old = document.getElementById('call-fx'); if (old) old.remove();
    const base = ft.now, ms = showCallFx(kind, 'テスト', '', { [kind]: id });
    document.body.offsetWidth;
    document.getAnimations().forEach(a => { const el = a.effect && a.effect.target; if (el && document.getElementById('call-fx') && document.getElementById('call-fx').contains(el)) { a.pause(); a.currentTime = 0; } });
    return { ms, base };
  };
};
