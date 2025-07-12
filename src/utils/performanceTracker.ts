
interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  tti?: number;
}

interface PerformanceReport {
  metrics: PerformanceMetrics;
  score: number;
  recommendations: string[];
}

class PerformanceTracker {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  initialize() {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    this.observeWebVitals();
    this.observeNavigationTiming();
  }

  private observeWebVitals() {
    // First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      this.observers.push(fcpObserver);
    } catch (error) {
      console.warn('FCP observation not supported');
    }

    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observation not supported');
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (!layoutShiftEntry.hadRecentInput) {
            cls += layoutShiftEntry.value;
          }
        }
        this.metrics.cls = Math.max(this.metrics.cls || 0, cls);
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observation not supported');
    }
  }

  private observeNavigationTiming() {
    if (typeof window !== 'undefined' && window.performance?.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navEntry = navEntries[0] as PerformanceNavigationTiming;
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    }
  }

  generateReport(): PerformanceReport {
    const { fcp, lcp, cls, fid, ttfb } = this.metrics;
    const recommendations: string[] = [];
    let score = 100;

    // FCP scoring (Good: <1.8s, Needs Improvement: 1.8s-3s, Poor: >3s)
    if (fcp) {
      if (fcp > 3000) {
        score -= 20;
        recommendations.push('Improve First Contentful Paint (currently >3s)');
      } else if (fcp > 1800) {
        score -= 10;
        recommendations.push('Optimize First Contentful Paint (currently >1.8s)');
      }
    }

    // LCP scoring (Good: <2.5s, Needs Improvement: 2.5s-4s, Poor: >4s)
    if (lcp) {
      if (lcp > 4000) {
        score -= 25;
        recommendations.push('Improve Largest Contentful Paint (currently >4s)');
      } else if (lcp > 2500) {
        score -= 15;
        recommendations.push('Optimize Largest Contentful Paint (currently >2.5s)');
      }
    }

    // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
    if (cls !== undefined) {
      if (cls > 0.25) {
        score -= 20;
        recommendations.push('Reduce Cumulative Layout Shift (currently >0.25)');
      } else if (cls > 0.1) {
        score -= 10;
        recommendations.push('Minimize Cumulative Layout Shift (currently >0.1)');
      }
    }

    // TTFB scoring (Good: <800ms, Poor: >800ms)
    if (ttfb && ttfb > 800) {
      score -= 15;
      recommendations.push('Improve Time to First Byte (currently >800ms)');
    }

    return {
      metrics: this.metrics,
      score: Math.max(0, score),
      recommendations
    };
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceTracker = new PerformanceTracker();
