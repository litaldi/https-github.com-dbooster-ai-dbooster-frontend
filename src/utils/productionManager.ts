
import { productionLogger } from './productionLogger';

export class ProductionManager {
  private static instance: ProductionManager;
  private initialized = false;

  static getInstance(): ProductionManager {
    if (!ProductionManager.instance) {
      ProductionManager.instance = new ProductionManager();
    }
    return ProductionManager.instance;
  }

  initialize(): void {
    if (this.initialized) return;
    
    try {
      // Initialize production optimizations
      this.setupErrorHandling();
      this.setupPerformanceMonitoring();
      this.initialized = true;
      
      productionLogger.info('Production manager initialized successfully');
    } catch (error) {
      productionLogger.error('Failed to initialize production manager', error);
    }
  }

  private setupErrorHandling(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      productionLogger.error('Global error caught', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      productionLogger.error('Unhandled promise rejection', {
        reason: event.reason
      });
    });
  }

  private setupPerformanceMonitoring(): void {
    // Basic performance monitoring
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            productionLogger.info('Navigation timing', {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  cleanup(): void {
    // Cleanup resources if needed
    this.initialized = false;
  }
}

export const productionManager = ProductionManager.getInstance();
