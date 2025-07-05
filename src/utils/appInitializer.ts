
import { performanceTracker } from './performanceTracker';
import { serviceWorkerManager } from './serviceWorker';
import { bundleOptimizer } from './bundleOptimizer';
import { logger } from './logger';

export class AppInitializer {
  private static instance: AppInitializer;

  static getInstance(): AppInitializer {
    if (!AppInitializer.instance) {
      AppInitializer.instance = new AppInitializer();
    }
    return AppInitializer.instance;
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing DBooster application', {}, 'AppInit');

      // Start performance monitoring immediately
      performanceTracker.initialize();
      
      // Register service worker for caching
      await serviceWorkerManager.register();
      
      // Analyze bundle size in development
      if (import.meta.env.DEV) {
        const analysis = await bundleOptimizer.analyzeBundleSize();
        const optimization = bundleOptimizer.generateOptimizationReport();
        
        logger.info('Bundle Analysis Complete', {
          totalSize: `${Math.round(analysis.totalSize / 1024)}KB`,
          potentialSavings: `${Math.round(optimization.potentialSavings / 1024)}KB`,
          recommendations: optimization.recommendations.length
        }, 'BundleAnalyzer');
      }

      // Preload critical resources
      this.preloadCriticalResources();

      logger.info('Application initialization completed', {}, 'AppInit');
    } catch (error) {
      logger.error('Application initialization failed', error, 'AppInit');
    }
  }

  private preloadCriticalResources(): void {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = '/fonts/inter-var.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);

    // Prefetch likely next routes
    const routesToPrefetch = ['/app', '/queries', '/repositories'];
    routesToPrefetch.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }
}

export const appInitializer = AppInitializer.getInstance();
