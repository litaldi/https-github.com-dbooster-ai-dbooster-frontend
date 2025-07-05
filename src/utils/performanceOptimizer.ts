
interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  ttfb: number;
  tti: number;
}

class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  startPerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    this.observeWebVitals();
    this.measureNavigationTiming();
  }

  stopPerformanceMonitoring() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  private observeWebVitals() {
    // First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
        }
      });
    });
    paintObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(paintObserver);

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries() as any[];
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  private measureNavigationTiming() {
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        this.metrics.ttfb = nav.responseStart - nav.requestStart;
        this.metrics.tti = nav.domInteractive - nav.fetchStart;
      }
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    return resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: (resource as any).transferSize || 0
    }));
  }

  runLighthouseAudit() {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Performance Metrics:', this.getMetrics());
      console.log('📊 Resource Timing:', this.measureResourceTiming());
    }
  }
}

export { PerformanceOptimizer };
