
interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

class ProductionLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  error(message: string, error?: any, context?: string) {
    this.log(LOG_LEVELS.ERROR, message, error, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log(LOG_LEVELS.WARN, message, data, context);
  }

  info(message: string, data?: any, context?: string) {
    this.log(LOG_LEVELS.INFO, message, data, context);
  }

  debug(message: string, data?: any, context?: string) {
    if (this.isDevelopment) {
      this.log(LOG_LEVELS.DEBUG, message, data, context);
    }
  }

  secureInfo(message: string, data?: any, context?: string) {
    // Same as info but with additional security considerations
    this.log(LOG_LEVELS.INFO, message, this.sanitizeData(data), context);
  }

  secureDebug(message: string, data?: any, context?: string) {
    if (this.isDevelopment) {
      this.log(LOG_LEVELS.DEBUG, message, this.sanitizeData(data), context);
    }
  }

  private sanitizeData(data?: any): any {
    if (!data) return data;
    
    // Remove sensitive information from logged data
    const sanitized = { ...data };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credential'];
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }

  private log(level: string, message: string, data?: any, context?: string) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context,
      data
    };

    if (this.isDevelopment) {
      console.log(`[${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}`, data || '');
    } else {
      // In production, you might want to send logs to a service
      console.log(JSON.stringify(logEntry));
    }
  }
}

export const productionLogger = new ProductionLogger();
