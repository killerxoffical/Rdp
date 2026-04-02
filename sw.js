const CACHE_NAME = "ictex-pwa-v1";
const URLS_TO_CACHE = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)).catch(()=>null));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>null);
      return response;
    }).catch(() => caches.match("./index.html")))
  );
});
