// Service worker of the new app:
// 1. Raluca's reminder (push) – opens the app when tapped.
// 2. Offline: every file of the app is kept on the phone after it was loaded once. Online, the newest
//    version is always loaded first (so updates arrive at once); only without internet the stored copy is used.
//    So the app opens on a plane and the flip cards work. The recorded voices are not stored (iPhone Safari plays
//    them in pieces), so offline the phone's own voice speaks. Speaking checks still need the internet.
const CACHE = 'miri-neu-v1';
// The start screen and all lessons, stored right away (the game is stored when she opens it).
const CORE = [
  './', 'index.html', 'app.js', 'app.css', 'manifest.webmanifest', 'store.js', 'audio.js', 'rec.js', 'reminder.js',
  'game.js', 'fox.js', 'fox3d.js', 'cards.js', 'vendor/three.module.min.js',
  'content/index.js', 'content/travel.js', 'content/friends.js', 'content/doctor.js', 'content/holiday.js',
  'content/cafe.js', 'content/shopping.js', 'content/work.js', 'content/plans.js', 'content/home.js',
  'content/experiences.js', 'content/opinions.js', 'content/problems.js',
  '../js/check.js', '../js/ai.js', '../js/config.js', '../audio/manifest.json', '../icons/icon-192.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // one by one, so one missing file does not stop the rest
    await Promise.all(CORE.map((u) => c.add(new Request(u, { cache: 'no-cache' })).catch(() => {})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  // only our own files (not Supabase, not Gemini), only reading
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (req.headers.has('range') || url.pathname.endsWith('.mp3')) return; // voices: straight from the internet
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    try {
      const res = await fetch(req);
      if (res.ok && res.status === 200) c.put(req, res.clone()).catch(() => {});
      return res;
    } catch (err) {
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') { const page = await c.match('index.html'); if (page) return page; }
      throw err;
    }
  })());
});

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Raluca wartet auf dich 🦊', {
    body: d.body || 'Zeit für deine 10 Minuten Englisch!',
    icon: '../icons/icon-192.png',
    badge: '../icons/icon-192.png',
    data: { url: d.url || './' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) if ('focus' in c) return c.focus();
    return self.clients.openWindow(new URL('./', self.registration.scope).href);
  })());
});
