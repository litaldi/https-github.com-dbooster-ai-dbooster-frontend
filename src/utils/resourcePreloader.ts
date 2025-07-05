
interface PreloadResource {
  href: string;
  as: 'script' | 'style' | 'font' | 'image' | 'fetch' | 'document';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
  priority?: 'high' | 'low';
}

export class ResourcePreloader {
  private static preloadedResources: Set<string> = new Set();
  private static preloadPromises: Map<string, Promise<void>> = new Map();

  static preloadResource(resource: PreloadResource): Promise<void> {
    const { href, as, type, crossorigin, media, priority } = resource;
    
    // Check if already preloaded
    if (this.preloadedResources.has(href)) {
      return Promise.resolve();
    }

    // Check if already in progress
    if (this.preloadPromises.has(href)) {
      return this.preloadPromises.get(href)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      
      if (type) link.type = type;
      if (crossorigin) link.crossOrigin = crossorigin;
      if (media) link.media = media;
      if (priority === 'high') link.setAttribute('fetchpriority', 'high');
      
      link.onload = () => {
        this.preloadedResources.add(href);
        resolve();
      };
      
      link.onerror = () => {
        reject(new Error(`Failed to preload resource: ${href}`));
      };
      
      document.head.appendChild(link);
    });

    this.preloadPromises.set(href, promise);
    return promise;
  }

  static async preloadCriticalAssets(): Promise<void> {
    const criticalResources: PreloadResource[] = [
      // Critical fonts
      {
        href: '/fonts/inter-var.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
        priority: 'high'
      },
      
      // Critical images
      {
        href: '/images/logo.svg',
        as: 'image',
        priority: 'high'
      },
      
      // Critical API endpoints
      {
        href: '/api/auth/session',
        as: 'fetch',
        crossorigin: 'anonymous'
      }
    ];

    try {
      await Promise.allSettled(
        criticalResources.map(resource => this.preloadResource(resource))
      );
    } catch (error) {
      console.warn('Some critical resources failed to preload:', error);
    }
  }

  static preloadRouteAssets(route: string): Promise<PromiseSettledResult<void>[]> {
    const routeAssets: Record<string, PreloadResource[]> = {
      '/dashboard': [
        {
          href: '/api/dashboard/metrics',
          as: 'fetch',
          crossorigin: 'anonymous'
        }
      ],
      '/queries': [
        {
          href: '/api/queries/recent',
          as: 'fetch',
          crossorigin: 'anonymous'
        }
      ],
      '/repositories': [
        {
          href: '/api/repositories/list',
          as: 'fetch',
          crossorigin: 'anonymous'
        }
      ]
    };

    const assets = routeAssets[route] || [];
    return Promise.allSettled(
      assets.map(asset => this.preloadResource(asset))
    );
  }

  static getPreloadedResources(): string[] {
    return Array.from(this.preloadedResources);
  }

  static clearPreloadCache(): void {
    this.preloadedResources.clear();
    this.preloadPromises.clear();
  }

  // Prefetch next likely routes
  static prefetchRoutes(routes: string[]): void {
    routes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }

  // Preconnect to external domains
  static preconnectToDomains(domains: string[]): void {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
}

// Auto-preload critical assets on module load
if (typeof window !== 'undefined') {
  ResourcePreloader.preloadCriticalAssets();
  
  // Preconnect to common external domains
  ResourcePreloader.preconnectToDomains([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ]);
}
