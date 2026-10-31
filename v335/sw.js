// FROZEN v3.3.5 rollback copy. Own scope (/v335/) and own cache prefix so it never touches the main app's cache.
const CACHE = 'nwh-v335-frozen-1';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('nwh-v335') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const isPage = r.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(r.url).pathname);
  if (isPage) { e.respondWith(fetch(r, { cache: 'no-store' }).then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put('./index.html', c)); return res; }).catch(() => caches.match('./index.html').then(x => x || caches.match('./')))); return; }
  e.respondWith(caches.match(r).then(x => x || fetch(r)));
});
