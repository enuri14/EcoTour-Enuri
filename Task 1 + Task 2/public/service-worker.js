const CACHE_NAME = "eco-cache-v4";
const RUNTIME_CACHE = "eco-runtime-v4";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/src/data/tours.json"
];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![CACHE_NAME, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // IMAGES → Cache-first
  if (/\.(png|jpe?g|webp|gif|svg)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((netRes) => {
          const copy = netRes.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          return netRes;
        });
      })
    );
    return;
  }

  // API/DATA → Network-first, always return a Response
  if (url.pathname.startsWith("/api") || url.pathname.endsWith("/data/tours.json")) {
    event.respondWith(
      fetch(request)
        .then((netRes) => {
          if (netRes && netRes.ok) {
            const copy = netRes.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
            return netRes;
          }
          // If response is not ok, try cache, else error
          return caches.match(request).then(cached => cached || Response.error());
        })
        .catch(() =>
          caches.match(request).then(cached => cached || Response.error())
        )
    );
    return;
  }

  // Navigations → Network, fallback to cached index or offline.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() =>
          caches.match("/index.html").then((cached) => {
            if (cached) return cached;
            return caches.match("/offline.html").then((offline) => offline || Response.error());
          })
        )
    );
    return;
  }

  // Other assets → Try cache, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});