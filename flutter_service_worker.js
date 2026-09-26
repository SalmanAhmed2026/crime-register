// Retires the offline copy an earlier build kept. A browser that still has
// the old service worker checks this file for updates; this version clears
// every cache, removes itself, and reloads the open pages, which then load the
// live app straight from the server.
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    await self.registration.unregister();
    const pages = await self.clients.matchAll({ type: 'window' });
    pages.forEach(function (page) { page.navigate(page.url); });
  })());
});
