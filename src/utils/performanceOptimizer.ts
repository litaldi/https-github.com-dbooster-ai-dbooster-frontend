
class PerformanceOptimizer {
  private static metrics: Map<string, number> = new Map();
  private static observers: PerformanceObserver[] = [];

  static startPerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();
    
    // Monitor resource loading
    this.monitorResources();
    
    // Monitor user interactions
    this.monitorInteractions();
  }

  private static monitorCoreWebVitals() {
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          this.metrics.set('fcp', entry.startTime);
          console.log('🎨 FCP:', Math.round(entry.startTime), 'ms');
        }
      }
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (error) {
      console.warn('FCP observer not supported');
    }

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('lcp', lastEntry.startTime);
      console.log('🖼️ LCP:', Math.round(lastEntry.startTime), 'ms');
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported');
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.metrics.set('cls', clsValue);
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer not supported');
    }
  }

  private static monitorResources() {
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        if (resource.duration > 1000) {
          console.warn('⚠️ Slow resource:', resource.name, Math.round(resource.duration), 'ms');
        }
      }
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Resource observer not supported');
    }
  }

  private static monitorInteractions() {
    // Track long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn('🐌 Long task detected:', Math.round(entry.duration), 'ms');
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Long task observer not supported');
    }
  }

  static getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  static cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }

  static generateReport() {
    const metrics = this.getMetrics();
    
    // Calculate performance score
    let score = 100;
    
    if (metrics.fcp > 1800) score -= 20;
    else if (metrics.fcp > 1000) score -= 10;
    
    if (metrics.lcp > 2500) score -= 30;
    else if (metrics.lcp > 1200) score -= 15;
    
    if (metrics.cls > 0.25) score -= 25;
    else if (metrics.cls > 0.1) score -= 10;

    const recommendations = [];
    if (metrics.fcp > 1800) recommendations.push('Optimize critical rendering path');
    if (metrics.lcp > 2500) recommendations.push('Optimize largest contentful paint element');
    if (metrics.cls > 0.25) recommendations.push('Fix layout shift issues');

    return {
      metrics,
      score: Math.max(0, score),
      recommendations
    };
  }
}

export { PerformanceOptimizer };
