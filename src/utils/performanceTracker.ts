
interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  tti?: number;
}

class PerformanceTracker {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  initialize() {
    if (typeof window === 'undefined') return;

    this.trackCoreWebVitals();
    this.trackCustomMetrics();
  }

  private trackCoreWebVitals() {
    // First Contentful Paint
    this.observeEntryType('paint', (entries) => {
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    });

    // Largest Contentful Paint
    this.observeEntryType('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        this.metrics.lcp = lastEntry.startTime;
      }
    });

    // Cumulative Layout Shift
    let clsValue = 0;
    this.observeEntryType('layout-shift', (entries) => {
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.metrics.cls = clsValue;
        }
      }
    });

    // First Input Delay
    this.observeEntryType('first-input', (entries) => {
      const firstInput = entries[0];
      if (firstInput) {
        this.metrics.fid = (firstInput as any).processingStart - firstInput.startTime;
      }
    });
  }

  private trackCustomMetrics() {
    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // Time to Interactive (simplified)
    if (document.readyState === 'complete') {
      this.metrics.tti = performance.now();
    } else {
      window.addEventListener('load', () => {
        this.metrics.tti = performance.now();
      });
    }
  }

  private observeEntryType(entryType: string, callback: (entries: PerformanceEntry[]) => void) {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance observer for ${entryType} not supported:`, error);
    }
  }

  generateReport() {
    const score = this.calculateScore();
    const recommendations = this.generateRecommendations();

    return {
      metrics: { ...this.metrics },
      score,
      recommendations
    };
  }

  private calculateScore(): number {
    let score = 100;
    
    // FCP scoring
    if (this.metrics.fcp) {
      if (this.metrics.fcp > 3000) score -= 25;
      else if (this.metrics.fcp > 1800) score -= 15;
      else if (this.metrics.fcp > 1000) score -= 5;
    }

    // LCP scoring
    if (this.metrics.lcp) {
      if (this.metrics.lcp > 4000) score -= 30;
      else if (this.metrics.lcp > 2500) score -= 20;
      else if (this.metrics.lcp > 1200) score -= 10;
    }

    // CLS scoring
    if (this.metrics.cls) {
      if (this.metrics.cls > 0.25) score -= 25;
      else if (this.metrics.cls > 0.1) score -= 10;
    }

    // FID scoring
    if (this.metrics.fid) {
      if (this.metrics.fid > 300) score -= 20;
      else if (this.metrics.fid > 100) score -= 10;
    }

    return Math.max(0, Math.round(score));
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.fcp && this.metrics.fcp > 1800) {
      recommendations.push('Optimize critical rendering path and reduce render-blocking resources');
    }

    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push('Optimize images and fonts, consider lazy loading for below-fold content');
    }

    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push('Set explicit dimensions for images and ads to prevent layout shifts');
    }

    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push('Reduce JavaScript execution time and optimize event handlers');
    }

    if (this.metrics.ttfb && this.metrics.ttfb > 800) {
      recommendations.push('Optimize server response time and consider using a CDN');
    }

    return recommendations;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = {};
  }
}

export const performanceTracker = new PerformanceTracker();
