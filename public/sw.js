
const CACHE_NAME = 'dbooster-v2';
const STATIC_CACHE = 'dbooster-static-v2';
const DYNAMIC_CACHE = 'dbooster-dynamic-v2';

// Resources to cache on install
const staticAssets = [
  '/',
  '/src/index.css',
  '/manifest.json',
  // Add other critical static assets
];

// Resources to cache dynamically
const cacheStrategies = {
  // Cache First - for static assets
  cacheFirst: [
    /\.(?:js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|avif|gif|ico)$/,
  ],
  // Network First - for API calls
  networkFirst: [
    /\/api\//,
    /supabase/,
  ],
  // Stale While Revalidate - for pages
  staleWhileRevalidate: [
    /\.(?:html?)$/,
  ]
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(staticAssets);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Determine caching strategy
  let strategy = 'staleWhileRevalidate'; // default

  for (const [strategyName, patterns] of Object.entries(cacheStrategies)) {
    if (patterns.some(pattern => pattern.test(url.pathname))) {
      strategy = strategyName;
      break;
    }
  }

  event.respondWith(handleRequest(request, strategy));
});

async function handleRequest(request, strategy) {
  const cache = await caches.open(strategy === 'cacheFirst' ? STATIC_CACHE : DYNAMIC_CACHE);

  switch (strategy) {
    case 'cacheFirst':
      return cacheFirst(request, cache);
    
    case 'networkFirst':
      return networkFirst(request, cache);
    
    case 'staleWhileRevalidate':
    default:
      return staleWhileRevalidate(request, cache);
  }
}

async function cacheFirst(request, cache) {
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('Network failed, no cache available');
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
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cache) {
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Network failed, return cache if available
    return cached;
  });

  // Return cached version immediately if available, otherwise wait for network
  return cached || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log('Background sync triggered');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
          icon: '/icon-192x192.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-192x192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('DBooster Notification', options)
    );
  }
});
