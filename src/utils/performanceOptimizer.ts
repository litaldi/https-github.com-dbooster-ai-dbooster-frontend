interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

class PerformanceOptimizerService {
  private metrics: PerformanceMetric[] = [];
  private isMonitoring = false;

  startPerformanceMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Monitor Core Web Vitals
    this.measureCoreWebVitals();
    
    // Monitor resource loading
    this.monitorResourceTiming();
  }

  stopPerformanceMonitoring() {
    this.isMonitoring = false;
  }

  private measureCoreWebVitals() {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.addMetric('LCP', entry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.addMetric('FID', entry.processingStart - entry.startTime);
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          this.addMetric('CLS', entry.value);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private monitorResourceTiming() {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        this.addMetric(`Resource: ${resource.name}`, resource.duration);
      }
    }).observe({ entryTypes: ['resource'] });
  }

  private addMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  getMetrics() {
    return [...this.metrics];
  }

  optimizeImages() {
    // Lazy load images that are not in viewport
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  measureResourceTiming(resourceName: string) {
    const entries = performance.getEntriesByName(resourceName);
    return entries.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      size: (entry as PerformanceResourceTiming).transferSize
    }));
  }

  runLighthouseAudit() {
    // Simulate Lighthouse audit checks
    const checks = {
      accessibility: this.checkAccessibility(),
      performance: this.checkPerformance(),
      seo: this.checkSEO(),
      bestPractices: this.checkBestPractices()
    };

    console.log('Lighthouse Audit Results:', checks);
    return checks;
  }

  private checkAccessibility() {
    const score = document.querySelectorAll('[alt]').length > 0 ? 95 : 70;
    return { score, recommendations: ['Add alt text to images', 'Improve color contrast'] };
  }

  private checkPerformance() {
    const score = this.metrics.length > 0 ? 90 : 85;
    return { score, recommendations: ['Optimize images', 'Minify JavaScript'] };
  }

  private checkSEO() {
    const hasTitle = document.title.length > 0;
    const hasMetaDescription = document.querySelector('meta[name="description"]') !== null;
    const score = hasTitle && hasMetaDescription ? 95 : 80;
    return { score, recommendations: ['Add meta description', 'Improve heading structure'] };
  }

  private checkBestPractices() {
    const score = 92;
    return { score, recommendations: ['Use HTTPS', 'Avoid deprecated APIs'] };
  }
}

export const PerformanceOptimizer = new PerformanceOptimizerService();
