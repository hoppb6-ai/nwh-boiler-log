const CACHE = 'nwh-log-v26';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });
// App page: network first (so new versions arrive immediately), cache when offline. Other assets: cache first.
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const isPage = r.mode === 'navigate' || /\/(index\.html)?$/.test(new URL(r.url).pathname);
  if (isPage) { e.respondWith(fetch(r, { cache: 'no-store' }).then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put('./index.html', c)); return res; }).catch(() => caches.match('./index.html').then(x => x || caches.match('./')))); return; }
  e.respondWith(caches.match(r).then(x => x || fetch(r)));
});
