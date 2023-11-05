var CACHE_NAME = "mtg-life-counter";

var urlsToCache = [
  "/mtg-life-counter/",
  "/mtg-life-counter/static/js/2.1b30836e.chunk.js",
  "/mtg-life-counter/static/js/main.4f529a54.chunk.js",
  "/mtg-life-counter/static/css/main.4fba246b.chunk.css",
  "/mtg-life-counter/static/css/main.4fba246b.chunk.css?family=MTG",
  "/mtg-life-counter/static/js/runtime-main.45f50031.js",
  "/mtg-life-counter/favicon.ico",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
