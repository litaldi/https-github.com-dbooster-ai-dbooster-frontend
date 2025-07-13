
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
  timestamp: string;
}

class ProductionLogger {
  private isDevelopment = import.meta.env.DEV;

  private formatLog(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      level,
      message,
      data,
      context,
      timestamp: new Date().toISOString()
    };
  }

  private log(entry: LogEntry) {
    if (this.isDevelopment) {
      const prefix = `[${entry.level.toUpperCase()}]${entry.context ? ` [${entry.context}]` : ''}`;
      console.log(`${prefix} ${entry.message}`, entry.data || '');
    }
  }

  info(message: string, data?: any, context?: string) {
    const entry = this.formatLog('info', message, data, context);
    this.log(entry);
  }

  warn(message: string, data?: any, context?: string) {
    const entry = this.formatLog('warn', message, data, context);
    this.log(entry);
  }

  error(message: string, error?: any, context?: string) {
    const entry = this.formatLog('error', message, error, context);
    this.log(entry);
  }

  debug(message: string, data?: any, context?: string) {
    const entry = this.formatLog('debug', message, data, context);
    this.log(entry);
  }

  secureInfo(message: string, data?: any, context?: string) {
    const sanitizedData = data ? { ...data } : undefined;
    if (sanitizedData && sanitizedData.password) {
      sanitizedData.password = '[REDACTED]';
    }
    if (sanitizedData && sanitizedData.token) {
      sanitizedData.token = '[REDACTED]';
    }
    this.info(message, sanitizedData, context);
  }
}

export const productionLogger = new ProductionLogger();
