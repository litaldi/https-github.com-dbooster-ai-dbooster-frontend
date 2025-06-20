interface AdvancedPerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'web-vitals' | 'custom' | 'resource' | 'navigation';
  rating?: 'good' | 'needs-improvement' | 'poor';
}

export class AdvancedPerformanceMonitor {
  private static instance: AdvancedPerformanceMonitor;
  private metrics: AdvancedPerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  static getInstance(): AdvancedPerformanceMonitor {
    if (!AdvancedPerformanceMonitor.instance) {
      AdvancedPerformanceMonitor.instance = new AdvancedPerformanceMonitor();
    }
    return AdvancedPerformanceMonitor.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring || typeof window === 'undefined') return;
    
    this.isMonitoring = true;
    this.setupWebVitalsMonitoring();
    this.setupResourceMonitoring();
    this.setupNavigationMonitoring();
    this.setupCustomMetrics();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  private setupWebVitalsMonitoring(): void {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.addMetric({
              name: 'LCP',
              value: entry.startTime,
              timestamp: Date.now(),
              category: 'web-vitals',
              rating: this.getLCPRating(entry.startTime)
            });
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as any;
            if (fidEntry.processingStart) {
              const fid = fidEntry.processingStart - fidEntry.startTime;
              this.addMetric({
                name: 'FID',
                value: fid,
                timestamp: Date.now(),
                category: 'web-vitals',
                rating: this.getFIDRating(fid)
              });
            }
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const clsEntry = entry as any;
            if (!clsEntry.hadRecentInput && clsEntry.value !== undefined) {
              this.addMetric({
                name: 'CLS',
                value: clsEntry.value,
                timestamp: Date.now(),
                category: 'web-vitals',
                rating: this.getCLSRating(clsEntry.value)
              });
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private setupResourceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming;
            if (resource.duration > 1000) { // Only track slow resources
              this.addMetric({
                name: `Slow Resource: ${resource.name.split('/').pop() || 'unknown'}`,
                value: resource.duration,
                timestamp: Date.now(),
                category: 'resource'
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported');
      }
    }
  }

  private setupNavigationMonitoring(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.addMetric({
            name: 'DOM Content Loaded',
            value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            timestamp: Date.now(),
            category: 'navigation'
          });

          this.addMetric({
            name: 'Page Load',
            value: navigation.loadEventEnd - navigation.loadEventStart,
            timestamp: Date.now(),
            category: 'navigation'
          });

          this.addMetric({
            name: 'DNS Lookup',
            value: navigation.domainLookupEnd - navigation.domainLookupStart,
            timestamp: Date.now(),
            category: 'navigation'
          });
        }
      }, 1000);
    }
  }

  private setupCustomMetrics(): void {
    // Memory usage monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.addMetric({
          name: 'Memory Usage',
          value: Math.round(memory.usedJSHeapSize / 1048576), // MB
          timestamp: Date.now(),
          category: 'custom'
        });
      }, 30000); // Every 30 seconds
    }

    // Connection monitoring
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.addMetric({
        name: 'Connection Type',
        value: connection.effectiveType === '4g' ? 4 : connection.effectiveType === '3g' ? 3 : 2,
        timestamp: Date.now(),
        category: 'custom'
      });
    }
  }

  private addMetric(metric: AdvancedPerformanceMetric): void {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log performance issues in development
    if (process.env.NODE_ENV === 'development') {
      if (metric.rating === 'poor' || metric.value > 3000) {
        console.warn(`Performance Issue: ${metric.name} = ${metric.value.toFixed(2)}${metric.name.includes('Memory') ? 'MB' : 'ms'}`);
      }
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance_metric', {
        event_category: metric.category,
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: {
          rating: metric.rating
        }
      });
    }
  }

  private getLCPRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSRating(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good';
    if (value <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  getMetrics(): AdvancedPerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByCategory(category: string): AdvancedPerformanceMetric[] {
    return this.metrics.filter(m => m.category === category);
  }

  getWorstPerformingMetrics(limit = 5): AdvancedPerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  generatePerformanceReport(): {
    summary: { good: number; needsImprovement: number; poor: number };
    recommendations: string[];
    worstMetrics: AdvancedPerformanceMetric[];
  } {
    const webVitals = this.getMetricsByCategory('web-vitals');
    const summary = webVitals.reduce(
      (acc, metric) => {
        if (metric.rating) acc[metric.rating === 'needs-improvement' ? 'needsImprovement' : metric.rating]++;
        return acc;
      },
      { good: 0, needsImprovement: 0, poor: 0 }
    );

    const recommendations: string[] = [];
    const worstMetrics = this.getWorstPerformingMetrics();

    // Generate recommendations based on metrics
    if (summary.poor > 0) {
      recommendations.push('Critical performance issues detected. Consider optimizing largest content elements.');
    }
    if (this.metrics.some(m => m.name.includes('Slow Resource'))) {
      recommendations.push('Slow loading resources detected. Consider image optimization and CDN usage.');
    }
    if (this.metrics.some(m => m.name === 'Memory Usage' && m.value > 50)) {
      recommendations.push('High memory usage detected. Consider optimizing JavaScript bundle size.');
    }

    return { summary, recommendations, worstMetrics };
  }
}

// Initialize performance monitoring
export const performanceMonitor = AdvancedPerformanceMonitor.getInstance();

// Auto-start monitoring in browser
if (typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
}
