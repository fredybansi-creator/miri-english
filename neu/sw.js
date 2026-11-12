// Service worker of the new app: only shows Raluca's reminder (push) and opens the app when tapped.
// No offline cache (the app always loads fresh from the internet).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

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
