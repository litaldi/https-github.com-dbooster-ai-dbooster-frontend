
interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  initialize() {
    this.measureCoreWebVitals();
    this.monitorResourceTiming();
    this.setupPerformanceObserver();
  }

  private measureCoreWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.fcp = entry.startTime;
        this.reportMetric('FCP', entry.startTime);
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let cumulativeLayoutShift = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as any;
        if (!layoutShift.hadRecentInput) {
          cumulativeLayoutShift += layoutShift.value;
        }
      }
      this.metrics.cls = cumulativeLayoutShift;
      this.reportMetric('CLS', cumulativeLayoutShift);
    }).observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const navEntry = entry as PerformanceNavigationTiming;
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
        this.reportMetric('TTFB', this.metrics.ttfb);
      }
    }).observe({ entryTypes: ['navigation'] });
  }

  private monitorResourceTiming() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Flag slow resources
        if (resource.duration > 1000) {
          this.reportSlowResource(resource);
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  private setupPerformanceObserver() {
    // Monitor long tasks (>50ms)
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.reportLongTask(entry);
          }
        }).observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }
    }
  }

  private reportMetric(name: string, value: number) {
    if (import.meta.env.PROD) {
      // Send to analytics service
      this.sendToAnalytics('performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        page: window.location.pathname
      });
    } else {
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  private reportSlowResource(resource: PerformanceResourceTiming) {
    if (import.meta.env.PROD) {
      this.sendToAnalytics('slow_resource', {
        resource_name: resource.name.split('/').pop(),
        duration: Math.round(resource.duration),
        size: resource.transferSize
      });
    }
  }

  private reportLongTask(entry: PerformanceEntry) {
    if (import.meta.env.PROD) {
      this.sendToAnalytics('long_task', {
        duration: Math.round(entry.duration),
        start_time: Math.round(entry.startTime)
      });
    }
  }

  private sendToAnalytics(eventName: string, data: any) {
    // Send to Google Analytics or other analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, data);
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
