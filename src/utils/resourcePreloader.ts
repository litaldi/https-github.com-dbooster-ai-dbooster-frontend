
class ResourcePreloaderService {
  private preloadedResources = new Set<string>();

  async preloadCriticalAssets() {
    const criticalResources = [
      '/fonts/inter-var.woff2',
      '/images/hero-bg.webp',
      '/images/dashboard-preview.webp'
    ];

    const preloadPromises = criticalResources.map(resource => 
      this.preloadResource(resource)
    );

    try {
      await Promise.allSettled(preloadPromises);
      console.log('Critical assets preloaded successfully');
    } catch (error) {
      console.error('Error preloading critical assets:', error);
    }
  }

  private preloadResource(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.preloadedResources.has(url)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      
      // Determine resource type
      if (url.includes('.woff2') || url.includes('.woff') || url.includes('.ttf')) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      } else if (url.includes('.webp') || url.includes('.jpg') || url.includes('.png')) {
        link.as = 'image';
      } else if (url.includes('.css')) {
        link.as = 'style';
      } else if (url.includes('.js')) {
        link.as = 'script';
      }

      link.onload = () => {
        this.preloadedResources.add(url);
        resolve();
      };

      link.onerror = () => {
        console.warn(`Failed to preload resource: ${url}`);
        reject(new Error(`Failed to preload: ${url}`));
      };

      document.head.appendChild(link);
    });
  }

  preloadRouteData(route: string) {
    // Preload data for upcoming routes
    const routeDataMap: Record<string, string[]> = {
      '/dashboard': ['/api/dashboard/stats', '/api/dashboard/recent-queries'],
      '/queries': ['/api/queries/list', '/api/queries/stats'],
      '/repositories': ['/api/repositories/list', '/api/repositories/stats']
    };

    const urls = routeDataMap[route];
    if (urls) {
      urls.forEach(url => {
        fetch(url, { method: 'GET' }).catch(() => {
          // Silent fail for preloading
        });
      });
    }
  }

  prefetchNextPage(nextRoute: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = nextRoute;
    document.head.appendChild(link);
  }
}

export const ResourcePreloader = new ResourcePreloaderService();
