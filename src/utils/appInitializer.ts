
import { PerformanceOptimizer } from './performanceOptimizer';
import { ResourcePreloader } from './resourcePreloader';
import { IntelligentPreloader } from './lazyLoader';

class AppInitializer {
  private static instance: AppInitializer;
  private initialized = false;

  static getInstance(): AppInitializer {
    if (!AppInitializer.instance) {
      AppInitializer.instance = new AppInitializer();
    }
    return AppInitializer.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize performance monitoring
      PerformanceOptimizer.startPerformanceMonitoring();

      // Preload critical resources
      ResourcePreloader.preloadCriticalAssets();

      // Initialize intelligent preloading
      const preloader = IntelligentPreloader.getInstance();
      preloader.initialize();

      // Initialize accessibility features
      this.initializeAccessibility();

      // Initialize service worker (if available)
      this.initializeServiceWorker();

      this.initialized = true;
      console.log('✅ App initialization complete');
    } catch (error) {
      console.error('❌ App initialization failed:', error);
    }
  }

  private initializeAccessibility() {
    // Ensure focus management
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered: ', registration);
      } catch (error) {
        console.log('SW registration failed: ', error);
      }
    }
  }

  getInitializationStatus() {
    return this.initialized;
  }
}

export const appInitializer = AppInitializer.getInstance();
