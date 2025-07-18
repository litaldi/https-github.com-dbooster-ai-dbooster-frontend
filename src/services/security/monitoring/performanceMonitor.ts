import { productionLogger } from '@/utils/productionLogger';

interface PerformanceMetrics {
  averageResponseTime: number;
  requestsPerMinute: number;
  validationLatency: number;
  memoryUsage: number;
}

interface PerformanceAlert {
  metric: string;
  threshold: number;
  currentValue: number;
  severity: 'warning' | 'critical';
  timestamp: Date;
}

export class SecurityPerformanceMonitor {
  private static instance: SecurityPerformanceMonitor;
  private metrics: PerformanceMetrics;
  private responseTimeHistory: number[] = [];
  private requestTimes: Date[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): SecurityPerformanceMonitor {
    if (!SecurityPerformanceMonitor.instance) {
      SecurityPerformanceMonitor.instance = new SecurityPerformanceMonitor();
    }
    return SecurityPerformanceMonitor.instance;
  }

  constructor() {
    this.metrics = {
      averageResponseTime: 0,
      requestsPerMinute: 0,
      validationLatency: 0,
      memoryUsage: 0
    };
  }

  startMonitoring(): void {
    productionLogger.secureInfo('Starting security performance monitoring');

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkPerformanceThresholds();
    }, 60000); // Every minute
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      productionLogger.secureInfo('Security performance monitoring stopped');
    }
  }

  recordValidationTime(startTime: number): void {
    const duration = Date.now() - startTime;
    this.responseTimeHistory.push(duration);
    
    // Keep only last 100 measurements
    if (this.responseTimeHistory.length > 100) {
      this.responseTimeHistory = this.responseTimeHistory.slice(-100);
    }

    if (duration > 1000) {
      productionLogger.secureWarn('Slow security validation detected', {
        duration,
        threshold: 1000
      });
    }
  }

  recordRequest(): void {
    const now = new Date();
    this.requestTimes.push(now);

    // Keep only last 5 minutes of requests
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    this.requestTimes = this.requestTimes.filter(time => time > fiveMinutesAgo);
  }

  private collectMetrics(): void {
    try {
      if (this.responseTimeHistory.length > 0) {
        this.metrics.averageResponseTime = this.responseTimeHistory.reduce((a, b) => a + b, 0) / this.responseTimeHistory.length;
      }

      const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
      this.metrics.requestsPerMinute = this.requestTimes.filter(time => time > oneMinuteAgo).length;

      if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
        const memory = (window.performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }
    } catch (error) {
      productionLogger.error('Failed to collect performance metrics', error, 'SecurityPerformanceMonitor');
    }
  }

  private checkPerformanceThresholds(): void {
    const alerts: PerformanceAlert[] = [];

    if (this.metrics.averageResponseTime > 500) {
      alerts.push({
        metric: 'averageResponseTime',
        threshold: 500,
        currentValue: this.metrics.averageResponseTime,
        severity: this.metrics.averageResponseTime > 1000 ? 'critical' : 'warning',
        timestamp: new Date()
      });
    }

    if (this.metrics.requestsPerMinute > 1000) {
      alerts.push({
        metric: 'requestsPerMinute',
        threshold: 1000,
        currentValue: this.metrics.requestsPerMinute,
        severity: this.metrics.requestsPerMinute > 2000 ? 'critical' : 'warning',
        timestamp: new Date()
      });
    }

    alerts.forEach(alert => {
      if (alert.severity === 'critical') {
        productionLogger.error(`CRITICAL: Security performance alert - ${alert.metric}`, alert, 'SecurityPerformanceMonitor');
      } else {
        productionLogger.secureWarn(`WARNING: Security performance alert - ${alert.metric}`, alert);
      }
    });
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
}

export const securityPerformanceMonitor = SecurityPerformanceMonitor.getInstance();
