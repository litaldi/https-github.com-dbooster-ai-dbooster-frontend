interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: number;
  userAgent: string;
  component?: string;
  action?: string;
  userId?: string;
}

interface PerformanceReport {
  metric: string;
  value: number;
  timestamp: number;
  page: string;
}

class MonitoringService {
  private errorQueue: ErrorReport[] = [];
  private performanceQueue: PerformanceReport[] = [];
  private maxQueueSize = 50;

  captureError(error: ErrorReport) {
    this.errorQueue.push({
      ...error,
      timestamp: error.timestamp || Date.now(),
      userAgent: error.userAgent || navigator.userAgent
    });

    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', error);
    }

    this.flushErrors();
  }

  capturePerformance(report: PerformanceReport) {
    this.performanceQueue.push({
      ...report,
      timestamp: report.timestamp || Date.now(),
      page: report.page || window.location.pathname
    });

    if (this.performanceQueue.length > this.maxQueueSize) {
      this.performanceQueue = this.performanceQueue.slice(-this.maxQueueSize);
    }

    this.flushPerformance();
  }

  private async flushErrors() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // In a real app, send to your monitoring service
      console.log('Flushing errors to monitoring service:', errors);
      
      // Example: await fetch('/api/monitoring/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ errors })
      // });
    } catch (error) {
      console.error('Failed to flush errors:', error);
      // Re-add errors to queue for retry
      this.errorQueue.unshift(...errors);
    }
  }

  private async flushPerformance() {
    if (this.performanceQueue.length === 0) return;

    const reports = [...this.performanceQueue];
    this.performanceQueue = [];

    try {
      console.log('Flushing performance data:', reports);
      
      // Example: await fetch('/api/monitoring/performance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reports })
      // });
    } catch (error) {
      console.error('Failed to flush performance data:', error);
      this.performanceQueue.unshift(...reports);
    }
  }

  getErrorReports() {
    return [...this.errorQueue];
  }

  getPerformanceReports() {
    return [...this.performanceQueue];
  }

  clearReports() {
    this.errorQueue = [];
    this.performanceQueue = [];
  }
}

export const monitoringService = new MonitoringService();
