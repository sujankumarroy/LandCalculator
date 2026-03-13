const APP_VERSION = '2.2.85';
const CACHE_NAME = `landcalculator-${APP_VERSION}`;
const STATIC_ASSETS = [
    "/",
    "/index",
    "/history",
    "/offline",
    "/style.css",
    "/history.css",
    "/script.js",
    "/history.js"
];

self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("CACHE_NAME").then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => {
            return self.clients.matchAll({ type: 'window' }).then(clients =>
                clients.forEach(client => client.navigate(client.url))
            );
        })
    );

    self.clients.claim(); // take control immediately
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(cachedResponse => {
            const networkResponse = fetch(e.request)
                .then(res => {
                    if ( res && res.status === 200 && e.request.url.startsWith(self.location.origin)) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(e.request, res.clone());
                        });
                    }
                    return res;
                })
                .catch(() => {
                    if (e.request.mode === 'navigate') {
                        return caches.match('/offline');
                    }
                });
            return cachedResponse || networkResponse;
        })
    );
});
