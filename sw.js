const CACHE_NAME = 'jobteens-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
  // Add your main CSS, JS, or logo paths here
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch Assets from Cache or Network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
