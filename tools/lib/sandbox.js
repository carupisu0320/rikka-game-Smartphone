'use strict';
// ブラウザなしで js/*.js を index.html と同じ順に読み込む、ゆるい疑似ブラウザ。
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..', '..');

function scriptList() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  // index.html の rkLoad([...]) に並んだ順（?v= は、読み込むときに自動で付く）
  return [...html.matchAll(/rkLoad\(\[([^\]]*)\]\)/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1])).filter(f => f.startsWith('js/'));
}

// 何を呼ばれても落ちない「からっぽの何か」
function dummy() {
  const fn = function () {};
  const p = new Proxy(fn, {
    get(_, k) {
      if (k === Symbol.toPrimitive) return () => '';
      if (k === 'then') return undefined;
      if (k === 'length') return 0;
      if (k === 'style' || k === 'dataset' || k === 'classList') return dummy();
      return dummy();
    },
    set() { return true; },
    apply() { return dummy(); },
    construct() { return dummy(); },
    has() { return true; },
  });
  return p;
}

function makeContext() {
  const store = new Map();
  class Storage {
    getItem(k) { return store.has(k) ? store.get(k) : null; }
    setItem(k, v) { store.set(k, String(v)); }
    removeItem(k) { store.delete(k); }
    clear() { store.clear(); }
    key(i) { return [...store.keys()][i] ?? null; }
    get length() { return store.size; }
  }
  const localStorage = new Storage();
  const doc = dummy();
  const base = {
    console: { log() {}, warn() {}, error() {}, info() {}, debug() {} },
    Storage, localStorage, sessionStorage: new Storage(), URLSearchParams,
    document: doc, navigator: { userAgent: 'node', language: 'ja', vibrate() {} }, location: { href: 'http://localhost/', search: '', hash: '', reload() {} },
    setTimeout: () => 0, setInterval: () => 0, clearTimeout() {}, clearInterval() {},
    performance: { now: () => 0 },
    requestAnimationFrame: () => 0, cancelAnimationFrame() {},
    fetch: () => new Promise(() => {}), io: () => dummy(),
    Path2D: function () { return dummy(); }, OffscreenCanvas: function () { return dummy(); },
    Image: function () { return dummy(); }, Audio: function () { return dummy(); },
    MutationObserver: function () { return { observe() {}, disconnect() {} }; },
    IntersectionObserver: function () { return { observe() {}, disconnect() {} }; },
    AudioContext: function () { return dummy(); }, webkitAudioContext: function () { return dummy(); },
    matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }),
    addEventListener() {}, removeEventListener() {},
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 1,
    URL, Blob: function () {}, FileReader: function () { return dummy(); }, TextEncoder, TextDecoder,
  };
  const ctx = vm.createContext(base);
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  return ctx;
}

// 上から順に読み込む。読み込みで例外が出たファイルは errors に集める（テスト側で判断）。
function loadAll() {
  const ctx = makeContext();
  const errors = [];
  for (const rel of scriptList()) {
    const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    try { vm.runInContext(code, ctx, { filename: rel, timeout: 5000 }); }
    catch (e) { errors.push({ file: rel, message: String(e && e.message || e) }); }
  }
  return { ctx, errors };
}
module.exports = { ROOT, scriptList, loadAll, makeContext };
