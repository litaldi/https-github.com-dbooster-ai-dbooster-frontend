
interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  initialize() {
    if (import.meta.env.PROD) {
      this.observeWebVitals();
      this.monitorResourceLoading();
    }
  }

  private observeWebVitals() {
    // Observe First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // Observe Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Observe Cumulative Layout Shift
    new PerformanceObserver((list) => {
      let cls = 0;
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      }
      this.metrics.cls = cls;
    }).observe({ type: 'layout-shift', buffered: true });
  }

  private monitorResourceLoading() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) {
          // Log slow loading resources in production
          if (import.meta.env.DEV) {
            console.warn('Slow resource:', entry.name, entry.duration);
          }
        }
      }
    }).observe({ type: 'resource', buffered: true });
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
