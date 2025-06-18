
// Performance optimization utilities
export class PerformanceOptimizer {
  private static performanceObserver: PerformanceObserver | null = null;

  static startPerformanceMonitoring() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`🎯 LCP: ${entry.startTime.toFixed(2)}ms`);
        }
        if (entry.entryType === 'first-input') {
          console.log(`⚡ FID: ${entry.processingStart - entry.startTime}ms`);
        }
        if (entry.entryType === 'layout-shift') {
          console.log(`📐 CLS: ${entry.value}`);
        }
      });
    });

    this.performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  }

  static stopPerformanceMonitoring() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }

  static measureResourceTiming() {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const resourceStats = {
      totalResources: resources.length,
      totalSize: 0,
      slowResources: [] as Array<{name: string, duration: number}>,
      resourceTypes: {} as Record<string, number>
    };

    resources.forEach((resource) => {
      const duration = resource.responseEnd - resource.startTime;
      
      // Track slow resources (>1000ms)
      if (duration > 1000) {
        resourceStats.slowResources.push({
          name: resource.name,
          duration: Math.round(duration)
        });
      }

      // Count resource types
      const type = resource.initiatorType || 'other';
      resourceStats.resourceTypes[type] = (resourceStats.resourceTypes[type] || 0) + 1;
    });

    console.log('📊 Resource Performance Stats:', resourceStats);
    return resourceStats;
  }

  static async runLighthouseAudit() {
    console.log('🔍 Running Performance Audit...');
    
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintTiming = performance.getEntriesByType('paint');
    
    const metrics = {
      domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
      loadComplete: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
      firstPaint: paintTiming.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paintTiming.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      resourceStats: this.measureResourceTiming()
    };

    console.log('⚡ Performance Metrics:', metrics);
    return metrics;
  }

  static optimizeImages() {
    const images = document.querySelectorAll('img');
    let optimizedCount = 0;

    images.forEach((img) => {
      // Add loading="lazy" if not present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
        optimizedCount++;
      }

      // Add proper alt text reminder
      if (!img.hasAttribute('alt') || img.getAttribute('alt') === '') {
        console.warn('Image missing alt text:', img.src);
      }
    });

    console.log(`🖼️ Optimized ${optimizedCount} images with lazy loading`);
    return optimizedCount;
  }
}
