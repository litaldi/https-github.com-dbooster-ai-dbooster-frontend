
interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
  tti: number;
}

interface PerformanceThresholds {
  fcp: { good: number; poor: number };
  lcp: { good: number; poor: number };
  cls: { good: number; poor: number };
  fid: { good: number; poor: number };
}

export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  private readonly thresholds: PerformanceThresholds = {
    fcp: { good: 1800, poor: 3000 },
    lcp: { good: 2500, poor: 4000 },
    cls: { good: 0.1, poor: 0.25 },
    fid: { good: 100, poor: 300 }
  };

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  initialize() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.observeWebVitals();
    this.measureNavigationTiming();
    this.trackResourceTiming();
  }

  private observeWebVitals() {
    // First Contentful Paint
    this.createObserver(['paint'], (entries) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('fcp', entry.startTime);
        }
      });
    });

    // Largest Contentful Paint
    this.createObserver(['largest-contentful-paint'], (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('lcp', lastEntry.startTime);
    });

    // Cumulative Layout Shift
    this.createObserver(['layout-shift'], (entries) => {
      let clsValue = 0;
      entries.forEach(entry => {
        const layoutShiftEntry = entry as any;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      });
      this.metrics.cls = clsValue;
      this.reportMetric('cls', clsValue);
    });

    // First Input Delay
    this.createObserver(['first-input'], (entries) => {
      const firstInput = entries[0] as any;
      const fid = firstInput.processingStart - firstInput.startTime;
      this.metrics.fid = fid;
      this.reportMetric('fid', fid);
    });
  }

  private createObserver(entryTypes: string[], callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }

  private measureNavigationTiming() {
    if (!performance.getEntriesByType) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      this.metrics.tti = navigation.domInteractive - navigation.fetchStart;
    }
  }

  private trackResourceTiming() {
    this.createObserver(['resource'], (entries) => {
      entries.forEach(entry => {
        const resource = entry as PerformanceResourceTiming;
        if (resource.duration > 1000) { // Track slow resources
          console.warn(`Slow resource detected: ${resource.name} (${Math.round(resource.duration)}ms)`);
        }
      });
    });
  }

  private reportMetric(name: keyof PerformanceMetrics, value: number) {
    const threshold = this.thresholds[name as keyof PerformanceThresholds];
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good';
    
    if (threshold) {
      if (value > threshold.poor) rating = 'poor';
      else if (value > threshold.good) rating = 'needs-improvement';
    }

    // Send to analytics in production
    if (import.meta.env.PROD && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: name,
        value: Math.round(value),
        custom_map: { metric_rating: rating }
      });
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`📊 ${name.toUpperCase()}: ${Math.round(value)}ms (${rating})`);
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  calculateScore(): number {
    const { fcp, lcp, cls, fid } = this.metrics;
    let score = 100;

    if (fcp && fcp > this.thresholds.fcp.good) score -= 20;
    if (lcp && lcp > this.thresholds.lcp.good) score -= 25;
    if (cls && cls > this.thresholds.cls.good) score -= 15;
    if (fid && fid > this.thresholds.fid.good) score -= 20;

    return Math.max(0, score);
  }

  generateReport(): {
    score: number;
    metrics: Partial<PerformanceMetrics>;
    recommendations: string[];
  } {
    const score = this.calculateScore();
    const recommendations: string[] = [];

    if (this.metrics.fcp && this.metrics.fcp > this.thresholds.fcp.good) {
      recommendations.push('Optimize First Contentful Paint - consider preloading critical resources');
    }
    if (this.metrics.lcp && this.metrics.lcp > this.thresholds.lcp.good) {
      recommendations.push('Improve Largest Contentful Paint - optimize images and reduce render-blocking resources');
    }
    if (this.metrics.cls && this.metrics.cls > this.thresholds.cls.good) {
      recommendations.push('Reduce Cumulative Layout Shift - set explicit dimensions for dynamic content');
    }

    return {
      score,
      metrics: this.metrics,
      recommendations
    };
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceTracker = PerformanceTracker.getInstance();
