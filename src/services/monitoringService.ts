
interface ErrorEvent {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  component?: string;
  action?: string;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userId?: string;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private errors: ErrorEvent[] = [];
  private metrics: PerformanceMetric[] = [];
  private maxStoredEvents = 100;

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  constructor() {
    this.setupGlobalErrorHandling();
    this.setupPerformanceMonitoring();
  }

  private setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.error?.message || event.message || 'Unknown error',
        stack: event.error?.stack,
        url: event.filename,
        line: event.lineno,
        column: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        component: 'Global',
        action: 'Uncaught Error'
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        component: 'Global',
        action: 'Unhandled Promise Rejection'
      });
    });
  }

  private setupPerformanceMonitoring() {
    // Monitor Web Vitals if available
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
        onLCP((metric) => this.captureMetric('LCP', metric.value));
        onINP((metric) => this.captureMetric('INP', metric.value));
        onCLS((metric) => this.captureMetric('CLS', metric.value));
        onFCP((metric) => this.captureMetric('FCP', metric.value));
        onTTFB((metric) => this.captureMetric('TTFB', metric.value));
      }).catch(() => {
        // Web Vitals library not available, continue without it
      });
    }

    // Monitor navigation timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            this.captureMetric('DOM Content Loaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
            this.captureMetric('Load Complete', navigation.loadEventEnd - navigation.loadEventStart);
            this.captureMetric('Page Load Time', navigation.loadEventEnd - navigation.fetchStart);
          }
        }, 0);
      });
    }
  }

  captureError(error: Partial<ErrorEvent>) {
    const errorEvent: ErrorEvent = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      url: error.url || window.location.href,
      line: error.line,
      column: error.column,
      timestamp: error.timestamp || Date.now(),
      userAgent: error.userAgent || navigator.userAgent,
      userId: error.userId,
      component: error.component,
      action: error.action
    };

    this.errors.push(errorEvent);
    this.trimStoredEvents();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Captured by Monitoring Service');
      console.error('Error:', errorEvent);
      console.groupEnd();
    }

    // In production, send to external monitoring service
    this.sendToExternalService('error', errorEvent);
  }

  captureMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href
    };

    this.metrics.push(metric);
    this.trimStoredEvents();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric: ${name} = ${value}ms`);
    }

    // Send to external service
    this.sendToExternalService('metric', metric);
  }

  private trimStoredEvents() {
    if (this.errors.length > this.maxStoredEvents) {
      this.errors = this.errors.slice(-this.maxStoredEvents);
    }
    if (this.metrics.length > this.maxStoredEvents) {
      this.metrics = this.metrics.slice(-this.maxStoredEvents);
    }
  }

  private sendToExternalService(type: 'error' | 'metric', data: ErrorEvent | PerformanceMetric) {
    // In production, integrate with services like Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to analytics
      if (window.gtag) {
        window.gtag('event', 'exception' + (type === 'metric' ? '_performance' : ''), {
          description: type === 'error' ? (data as ErrorEvent).message : (data as PerformanceMetric).name,
          fatal: type === 'error'
        });
      }
    }
  }

  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  clearData() {
    this.errors = [];
    this.metrics = [];
  }
}

export const monitoringService = MonitoringService.getInstance();
