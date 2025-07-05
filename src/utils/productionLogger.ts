
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
    // In production, only log errors and warnings
    this.logLevel = import.meta.env.PROD ? 'warn' : 'debug';
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

    // Console output for development only
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, error || '', metadata || '');
    }

    // In production, send critical errors to monitoring service
    if (import.meta.env.PROD && (level === 'error' || level === 'warn')) {
      this.sendToMonitoringService(entry);
    }
  }

  private sendToMonitoringService(entry: LogEntry) {
    // Implement actual monitoring service integration here
    // e.g., Sentry, DataDog, etc.
    // For now, we'll use a safe fallback that won't break in production
    try {
      // This could be replaced with actual monitoring service calls
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        // Only attempt to send in production environments
        // Implementation would go here
      }
    } catch (error) {
      // Silent fail to prevent production issues
    }
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

  // Add the missing secure logging methods
  secureInfo(message: string, metadata?: Record<string, any>, context?: string) {
    // For secure info logging, we sanitize sensitive data
    const sanitizedMetadata = this.sanitizeMetadata(metadata);
    this.log('info', message, undefined, context, sanitizedMetadata);
  }

  secureDebug(message: string, metadata?: Record<string, any>, context?: string) {
    // For secure debug logging, we sanitize sensitive data
    const sanitizedMetadata = this.sanitizeMetadata(metadata);
    this.log('debug', message, undefined, context, sanitizedMetadata);
  }

  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, any> = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'email', 'phone', 'ssn', 'credit'];

    for (const [key, value] of Object.entries(metadata)) {
      const isSensitive = sensitiveKeys.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey)
      );

      if (isSensitive && typeof value === 'string') {
        // Mask sensitive data
        sanitized[key] = value.length > 0 ? '*'.repeat(Math.min(value.length, 8)) : '';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const productionLogger = new ProductionLogger();
