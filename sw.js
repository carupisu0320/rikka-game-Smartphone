// 六華：季節・行事に合わせてアプリのアイコンを切り替えるService Worker
// manifest.json の取得に割り込んで、今日の日付に合うアイコンに書き換えて返す。
// ※ イベントの期間は index.html の LOBBY_EVENTS と同じ値にしてください（from/to は [月, 日]）
const EVENTS = [
  { id: 'halloween', from: [10, 1],  to: [10, 31] },
  { id: 'christmas', from: [12, 15], to: [12, 25] },
  { id: 'newyear',   from: [12, 29], to: [1, 7] },
  { id: 'valentine', from: [2, 7],   to: [2, 14] },
  { id: 'sakura',    from: [3, 20],  to: [4, 10] },
  { id: 'tanabata',  from: [7, 1],   to: [7, 7] },
  { id: 'fireworks', from: [7, 20],  to: [8, 31] },
  { id: 'tsukimi',   from: [9, 10],  to: [9, 30] },
];

function currentEventId() {
  const d = new Date(), v = (d.getMonth() + 1) * 100 + d.getDate();
  const ev = EVENTS.find(e => {
    const a = e.from[0] * 100 + e.from[1], b = e.to[0] * 100 + e.to[1];
    return a <= b ? (v >= a && v <= b) : (v >= a || v <= b);
  });
  return ev ? ev.id : '';
}

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('/manifest.json')) e.respondWith(seasonalManifest(e.request));
});

async function seasonalManifest(req) {
  const res = await fetch(req);
  try {
    const manifest = await res.clone().json();
    const id = currentEventId();
    if (id) {
      manifest.icons = [
        { src: `icons/${id}-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
        { src: `icons/${id}-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ];
    }
    return new Response(JSON.stringify(manifest), { headers: { 'Content-Type': 'application/manifest+json' } });
  } catch (err) {
    return res; // 失敗したときは元のmanifestをそのまま返す
  }
}
