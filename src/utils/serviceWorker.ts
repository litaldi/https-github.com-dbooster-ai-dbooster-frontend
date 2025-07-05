
interface CacheStrategy {
  cacheName: string;
  patterns: RegExp[];
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
  maxAge?: number;
}

export class ServiceWorkerManager {
  private static instance: ServiceWorkerManager;
  private registration: ServiceWorkerRegistration | null = null;

  private readonly cacheStrategies: CacheStrategy[] = [
    {
      cacheName: 'static-assets-v1',
      patterns: [/\.(?:js|css|woff2?|png|jpg|jpeg|webp|svg)$/],
      strategy: 'cache-first',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    },
    {
      cacheName: 'api-cache-v1',
      patterns: [/\/api\//],
      strategy: 'network-first',
      maxAge: 5 * 60 // 5 minutes
    },
    {
      cacheName: 'page-cache-v1',
      patterns: [/\.html$/],
      strategy: 'stale-while-revalidate',
      maxAge: 24 * 60 * 60 // 24 hours
    }
  ];

  static getInstance(): ServiceWorkerManager {
    if (!ServiceWorkerManager.instance) {
      ServiceWorkerManager.instance = new ServiceWorkerManager();
    }
    return ServiceWorkerManager.instance;
  }

  async register(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully');
      
      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              console.log('New service worker available');
              this.notifyUpdate();
            }
          });
        }
      });

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  async unregister(): Promise<boolean> {
    if (this.registration) {
      const result = await this.registration.unregister();
      this.registration = null;
      return result;
    }
    return false;
  }

  private notifyUpdate() {
    // Dispatch custom event for app to handle
    window.dispatchEvent(new CustomEvent('sw-update-available'));
  }

  async updateServiceWorker(): Promise<void> {
    if (this.registration?.waiting) {
      // Tell the waiting service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  generateServiceWorkerContent(): string {
    return `
const CACHE_VERSION = 'v1';
const CACHE_STRATEGIES = ${JSON.stringify(this.cacheStrategies, null, 2)};

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
  const strategy = CACHE_STRATEGIES.find(s => 
    s.patterns.some(pattern => pattern.test(url.pathname))
  );
  
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
  
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
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
  });
  
  return cached || fetchPromise;
}

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
    `;
  }
}

export const serviceWorkerManager = ServiceWorkerManager.getInstance();
