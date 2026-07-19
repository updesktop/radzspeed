const CACHE_NAME = 'negros-tires-v1';
const ASSETS_TO_CACHE = ['/'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
    self.skipWaiting();
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )));
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            return cached || fetch(e.request).then(res => {
                const resClone = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, resClone));
                return res;
            });
        })
    );
});