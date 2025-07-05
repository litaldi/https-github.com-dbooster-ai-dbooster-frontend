
import { ResourcePreloader } from './resourcePreloader';

interface LazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  preloadRoute?: string;
}

class IntelligentPreloader {
  private static instance: IntelligentPreloader;
  private imageObserver: IntersectionObserver | null = null;
  private componentObserver: IntersectionObserver | null = null;

  static getInstance(): IntelligentPreloader {
    if (!IntelligentPreloader.instance) {
      IntelligentPreloader.instance = new IntelligentPreloader();
    }
    return IntelligentPreloader.instance;
  }

  initialize() {
    this.initImageLazyLoading();
    this.initComponentLazyLoading();
  }

  initImageLazyLoading(options: LazyLoadOptions = {}) {
    const { threshold = 0.1, rootMargin = '50px', preloadRoute } = options;

    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          
          if (preloadRoute) {
            ResourcePreloader.preloadRouteAssets(preloadRoute);
          }
          
          this.imageObserver?.unobserve(img);
        }
      });
    }, { threshold, rootMargin });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.imageObserver?.observe(img);
    });
  }

  initComponentLazyLoading(options: LazyLoadOptions = {}) {
    const { threshold = 0.1, rootMargin = '100px' } = options;

    if (this.componentObserver) {
      this.componentObserver.disconnect();
    }

    this.componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          const componentName = element.dataset.component;
          
          if (componentName) {
            // Trigger component loading
            this.loadComponent(componentName);
            element.removeAttribute('data-component');
          }
          
          this.componentObserver?.unobserve(element);
        }
      });
    }, { threshold, rootMargin });

    // Observe all elements with data-component
    document.querySelectorAll('[data-component]').forEach(element => {
      this.componentObserver?.observe(element);
    });
  }

  private async loadComponent(componentName: string) {
    try {
      // Dynamic import based on component name
      const componentMap: Record<string, () => Promise<any>> = {
        'PerformanceDashboard': () => import('@/components/performance/PerformanceDashboard'),
        'SecurityDashboard': () => import('@/components/security/SecurityDashboard'),
        'AdvancedQueryBuilder': () => import('@/components/queries/AdvancedQueryBuilder')
      };

      const loader = componentMap[componentName];
      if (loader) {
        await loader();
      }
    } catch (error) {
      console.warn(`Failed to lazy load component: ${componentName}`, error);
    }
  }

  preloadRouteComponents(route: string) {
    const routeComponents: Record<string, string[]> = {
      '/app': ['PerformanceDashboard', 'SecurityDashboard'],
      '/queries': ['AdvancedQueryBuilder'],
      '/reports': ['PerformanceDashboard']
    };

    const components = routeComponents[route] || [];
    components.forEach(component => {
      this.loadComponent(component);
    });

    // Also preload route assets
    ResourcePreloader.preloadRouteAssets(route);
  }

  cleanup() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }
    
    if (this.componentObserver) {
      this.componentObserver.disconnect();
      this.componentObserver = null;
    }
  }
}

// Export both for compatibility
export { IntelligentPreloader };
export const LazyLoader = IntelligentPreloader;
