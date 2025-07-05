
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
  sanitizedData?: Record<string, any>;
  metadata?: Record<string, any>;
}

class EnhancedProductionLogger {
  private logLevel: string = 'info';
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private sensitiveKeys = [
    'password', 'token', 'secret', 'key', 'email', 'phone', 'ssn', 'credit',
    'authorization', 'auth', 'bearer', 'api_key', 'apikey', 'session', 'cookie',
    'pin', 'otp', 'verification', 'reset', 'recovery', 'signature', 'hash'
  ];

  constructor() {
    this.logLevel = import.meta.env.PROD ? 'warn' : 'debug';
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    if (typeof data === 'string') {
      // Check if string contains sensitive information
      const lowerData = data.toLowerCase();
      if (this.sensitiveKeys.some(key => lowerData.includes(key))) {
        return '***SANITIZED***';
      }
      return data.length > 200 ? data.substring(0, 200) + '...' : data;
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};
      
      for (const [key, value] of Object.entries(data)) {
        const isSensitive = this.sensitiveKeys.some(sensitiveKey => 
          key.toLowerCase().includes(sensitiveKey)
        );

        if (isSensitive) {
          sanitized[key] = typeof value === 'string' && value.length > 0 
            ? '*'.repeat(Math.min(value.length, 8)) 
            : '***SANITIZED***';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private log(level: string, message: string, data?: any, context?: string, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: message.length > 500 ? message.substring(0, 500) + '...' : message,
      context,
      sanitizedData: this.sanitizeData(data),
      metadata: this.sanitizeData(metadata)
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output for development only
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${level.toUpperCase()}]${context ? ` [${context}]` : ''} ${message}`, entry.sanitizedData || '');
    }

    // In production, send critical errors to monitoring
    if (import.meta.env.PROD && (level === 'error' || level === 'warn')) {
      this.sendToMonitoring(entry);
    }
  }

  private sendToMonitoring(entry: LogEntry) {
    // Production monitoring integration placeholder
    try {
      if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        // This could integrate with Sentry, DataDog, etc.
        // For now, we'll store in sessionStorage for debugging
        const existingLogs = JSON.parse(sessionStorage.getItem('production_logs') || '[]');
        existingLogs.push(entry);
        sessionStorage.setItem('production_logs', JSON.stringify(existingLogs.slice(-100)));
      }
    } catch (error) {
      // Silent fail to prevent production issues
    }
  }

  error(message: string, data?: any, context?: string, metadata?: Record<string, any>) {
    this.log('error', message, data, context, metadata);
  }

  warn(message: string, data?: any, context?: string, metadata?: Record<string, any>) {
    this.log('warn', message, data, context, metadata);
  }

  info(message: string, data?: any, context?: string, metadata?: Record<string, any>) {
    this.log('info', message, data, context, metadata);
  }

  debug(message: string, data?: any, context?: string, metadata?: Record<string, any>) {
    this.log('debug', message, data, context, metadata);
  }

  secureInfo(message: string, metadata?: Record<string, any>, context?: string) {
    this.log('info', message, undefined, context, metadata);
  }

  secureDebug(message: string, metadata?: Record<string, any>, context?: string) {
    this.log('debug', message, undefined, context, metadata);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportSecureLogs(): string {
    return JSON.stringify(this.logs.map(log => ({
      ...log,
      sanitizedData: log.sanitizedData,
      metadata: log.metadata
    })), null, 2);
  }
}

export const enhancedProductionLogger = new EnhancedProductionLogger();
