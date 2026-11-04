/* Offline support. Serve the site over https (or localhost) for this to run.
   Pages and assets are cached on first visit and refreshed in the background.
   The map page can also ask for a full download with the "Download offline map" button. */
const VERSION = 'sp-v4';
const CORE = [
  'index.html', 'ride.html', 'rooms.html', 'hotel.html', 'food.html', 'annadanam.html', 'store.html', 'product.html', 'cart.html', 'map.html', 'profile.html',
  'css/styles.css', 'css/pages.css', 'assets/img/temple-bg.jpg', 'assets/img/temple-gopuram.jpg', 'assets/img/temple-corridor-left.jpg', 'assets/img/temple-corridor-right.jpg', 'assets/img/temple-pilgrims.jpg', 'assets/img/temple-sky.jpg', 'assets/img/temple-tree.jpg', 'assets/img/temple-tower-detail.jpg', 'assets/img/tile-warm.jpg',
  'js/common.js', 'js/art.js',  'js/data.js', 'js/data2.js', 'js/stay.js', 'js/shop.js',
  'js/home.js', 'js/ride.js', 'js/rooms.js', 'js/hotel.js', 'js/food.js', 'js/annadanam.js', 'js/store.js', 'js/product.js', 'js/cart.js', 'js/map.js', 'js/profile.js', 'js/events.js', 'js/calendar.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => {}));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'CACHE_MAP') {
    e.waitUntil(
      caches.open(VERSION)
        .then((c) => c.addAll(CORE))
        .then(() => e.source && e.source.postMessage({ type: 'MAP_CACHED' }))
        .catch(() => e.source && e.source.postMessage({ type: 'MAP_FAILED' }))
    );
  }
});
