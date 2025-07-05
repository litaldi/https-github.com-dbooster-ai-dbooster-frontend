
const CACHE_VERSION = 'v1';
const CACHE_STRATEGIES = [
  {
    "cacheName": "static-assets-v1",
    "patterns": ["/\\.(?:js|css|woff2?|png|jpg|jpeg|webp|svg)$/"],
    "strategy": "cache-first",
    "maxAge": 604800
  },
  {
    "cacheName": "api-cache-v1", 
    "patterns": ["/\\/api\\//"],
    "strategy": "network-first",
    "maxAge": 300
  },
  {
    "cacheName": "page-cache-v1",
    "patterns": ["/\\.html$/"],
    "strategy": "stale-while-revalidate",
    "maxAge": 86400
  }
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  event.waitUntil(
    Promise.all(
      CACHE_STRATEGIES.map(strategy => 
        caches.open(strategy.cacheName)
      )
    ).then(() => {
      console.log('Caches created');
      self.skipWaiting();
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!CACHE_STRATEGIES.some(strategy => strategy.cacheName === cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Find matching cache strategy
  const strategy = CACHE_STRATEGIES.find(s => {
    return s.patterns.some(pattern => {
      const regex = new RegExp(pattern.slice(1, -1));
      return regex.test(url.pathname);
    });
  });
  
  if (strategy) {
    event.respondWith(handleRequest(event.request, strategy));
  }
});

async function handleRequest(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  
  switch (strategy.strategy) {
    case 'cache-first':
      return cacheFirst(request, cache);
    case 'network-first':
      return networkFirst(request, cache);
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request, cache);
    default:
      return fetch(request);
  }
}

async function cacheFirst(request, cache) {
  const cached = await cache.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('Cache first fetch failed:', error);
    throw error;
  }
}

async function networkFirst(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request, cache) {
  const cached = await cache.match(request);
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
