
interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  tti?: number;
}

interface PerformanceReport {
  score: number;
  metrics: PerformanceMetrics;
  recommendations: string[];
  timestamp: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  initialize(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    this.observeWebVitals();
    this.observeResourceTiming();
    this.observeNavigationTiming();
  }

  private observeWebVitals(): void {
    try {
      // First Contentful Paint (FCP)
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

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = clsValue;
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
  }

  private observeResourceTiming(): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          // Track slow resources
          if (entry.duration > 1000) {
            console.warn(`Slow resource detected: ${entry.name} (${Math.round(entry.duration)}ms)`);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Resource timing observation failed:', error);
    }
  }

  private observeNavigationTiming(): void {
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.ttfb = entry.responseStart - entry.requestStart;
          
          // Calculate Time to Interactive approximation
          const loadEventEnd = entry.loadEventEnd;
          const domContentLoaded = entry.domContentLoadedEventEnd;
          this.metrics.tti = Math.max(loadEventEnd, domContentLoaded);
        });
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    } catch (error) {
      console.warn('Navigation timing observation failed:', error);
    }
  }

  generateReport(): PerformanceReport {
    const score = this.calculatePerformanceScore();
    const recommendations = this.generateRecommendations();

    return {
      score,
      metrics: { ...this.metrics },
      recommendations,
      timestamp: Date.now(),
    };
  }

  private calculatePerformanceScore(): number {
    const weights = {
      fcp: 0.15,
      lcp: 0.25,
      cls: 0.25,
      fid: 0.25,
      ttfb: 0.1,
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([metric, weight]) => {
      const value = this.metrics[metric as keyof PerformanceMetrics];
      if (value !== undefined) {
        totalScore += this.getMetricScore(metric, value) * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  private getMetricScore(metric: string, value: number): number {
    const thresholds: Record<string, { good: number; poor: number }> = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      cls: { good: 0.1, poor: 0.25 },
      fid: { good: 100, poor: 300 },
      ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 50;

    if (value <= threshold.good) return 100;
    if (value >= threshold.poor) return 0;

    // Linear interpolation between good and poor
    const ratio = (threshold.poor - value) / (threshold.poor - threshold.good);
    return Math.round(ratio * 100);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.fcp && this.metrics.fcp > 3000) {
      recommendations.push('Optimize First Contentful Paint by reducing render-blocking resources');
    }

    if (this.metrics.lcp && this.metrics.lcp > 4000) {
      recommendations.push('Improve Largest Contentful Paint by optimizing images and critical resources');
    }

    if (this.metrics.cls && this.metrics.cls > 0.25) {
      recommendations.push('Reduce Cumulative Layout Shift by setting explicit dimensions for images and ads');
    }

    if (this.metrics.fid && this.metrics.fid > 300) {
      recommendations.push('Improve First Input Delay by reducing JavaScript execution time');
    }

    if (this.metrics.ttfb && this.metrics.ttfb > 1800) {
      recommendations.push('Optimize Time to First Byte by improving server response times');
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance looks good! Continue monitoring for regressions.');
    }

    return recommendations;
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export const optimizeImage = (
  src: string,
  width?: number,
  height?: number,
  format: 'webp' | 'avif' | 'jpeg' = 'webp'
): string => {
  // Simple URL-based optimization (would integrate with actual image service)
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('f', format);
  params.set('q', '80'); // Quality

  return `${src}?${params.toString()}`;
};

// Intersection Observer utility
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};

// Bundle analysis utilities
export const bundleAnalysis = {
  getCurrentBundleSize: (): number => {
    if (typeof window === 'undefined') return 0;
    
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes('.js'));
    
    return jsResources.reduce((total, resource) => total + (resource.transferSize || 0), 0);
  },

  trackChunkLoading: (chunkName: string): void => {
    if (import.meta.env.DEV) {
      console.log(`📦 Loading chunk: ${chunkName}`);
    }
  },

  reportUnusedCode: (): void => {
    if (import.meta.env.DEV && 'coverage' in window) {
      console.log('📊 Code coverage data available for analysis');
    }
  },
};

export const performanceMonitor = PerformanceMonitor.getInstance();
