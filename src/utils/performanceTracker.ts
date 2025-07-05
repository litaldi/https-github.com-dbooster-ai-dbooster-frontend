
interface PerformanceReport {
  metrics: {
    fcp?: number;
    lcp?: number;
    cls?: number;
    fid?: number;
    ttfb?: number;
    tti?: number;
  };
  score: number;
  recommendations: string[];
}

class PerformanceTracker {
  private metrics: any = {};
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) return;
    
    this.trackWebVitals();
    this.isInitialized = true;
  }

  private trackWebVitals() {
    // Simulate web vitals tracking
    // In production, you'd use the actual web-vitals library
    this.metrics = {
      fcp: Math.random() * 2000 + 500,
      lcp: Math.random() * 3000 + 1000,
      cls: Math.random() * 0.3,
      fid: Math.random() * 200 + 50,
      ttfb: Math.random() * 500 + 100,
      tti: Math.random() * 4000 + 2000
    };
  }

  generateReport(): PerformanceReport {
    const score = this.calculateScore();
    const recommendations = this.generateRecommendations();

    return {
      metrics: this.metrics,
      score,
      recommendations
    };
  }

  private calculateScore(): number {
    const weights = {
      fcp: 0.15,
      lcp: 0.25,
      cls: 0.15,
      fid: 0.25,
      ttfb: 0.1,
      tti: 0.1
    };

    let totalScore = 0;
    Object.entries(weights).forEach(([metric, weight]) => {
      const value = this.metrics[metric] || 0;
      const score = this.getMetricScore(metric, value);
      totalScore += score * weight;
    });

    return Math.round(totalScore);
  }

  private getMetricScore(metric: string, value: number): number {
    const thresholds: Record<string, [number, number]> = {
      fcp: [1800, 3000],
      lcp: [2500, 4000],
      cls: [0.1, 0.25],
      fid: [100, 300],
      ttfb: [800, 1800],
      tti: [3800, 7300]
    };

    const [good, poor] = thresholds[metric] || [0, 100];
    
    if (value <= good) return 100;
    if (value >= poor) return 0;
    
    return Math.round(100 - ((value - good) / (poor - good)) * 100);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by reducing image sizes');
    }
    
    if (this.metrics.cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift by setting image dimensions');
    }
    
    if (this.metrics.fid > 100) {
      recommendations.push('Improve First Input Delay by reducing JavaScript execution time');
    }

    return recommendations;
  }

  cleanup() {
    this.isInitialized = false;
    this.metrics = {};
  }
}

export const performanceTracker = new PerformanceTracker();
