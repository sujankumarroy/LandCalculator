self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("app-cache-1.1").then(cache => {
            return cache.addAll([
                "/",
                "/index.html",
                "/style.css",
                "/app.js"
            ]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return fetch(e.request);
        })
    );
});