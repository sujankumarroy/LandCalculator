const APP_VERSION = '2.3.1';
const CACHE_NAME = `landcalculator-v${APP_VERSION}`;
const STATIC_ASSETS = [
    "/",
    "/index",
    "/history",
    "/css/nav.css",
    "/css/style.css",
    "/css/history.css",
    "/js/idb-handler.js",
    "/js/script.js",
    "/js/history.js"
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            return cachedResponse || fetch(e.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200 && e.request.url.startsWith(self.location.origin)) {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(e.request, networkResponse.clone());
                        return networkResponse;
                    });
                }
                return networkResponse;
            });
        })
    );
});
