
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  error?: any;
  metadata?: Record<string, any>;
}

class ProductionLogger {
  private logLevel: string = 'info';
  private logs: LogEntry[] = [];

  constructor() {
    // In production, you might want to send logs to a service
    this.logLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
  }

  private log(level: string, message: string, error?: any, context?: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      metadata
    };

    this.logs.push(entry);

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, error || '', metadata || '');
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && (level === 'error' || level === 'warn')) {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry) {
    // Implement actual monitoring service integration here
    // e.g., Sentry, DataDog, etc.
  }

  error(message: string, error?: any, context?: string, metadata?: Record<string, any>) {
    this.log('error', message, error, context, metadata);
  }

  warn(message: string, error?: any, context?: string, metadata?: Record<string, any>) {
    this.log('warn', message, error, context, metadata);
  }

  info(message: string, metadata?: Record<string, any>, context?: string) {
    this.log('info', message, undefined, context, metadata);
  }

  debug(message: string, metadata?: Record<string, any>, context?: string) {
    this.log('debug', message, undefined, context, metadata);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const productionLogger = new ProductionLogger();
