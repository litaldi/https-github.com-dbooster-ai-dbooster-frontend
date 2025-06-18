
import { logger } from './logger';

type ProductionLogLevel = 'error' | 'warn' | 'critical';

interface ProductionLogEntry {
  level: ProductionLogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class ProductionLogger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(level: ProductionLogLevel, message: string, data?: any, component?: string): ProductionLogEntry {
    return {
      level,
      message,
      data: this.sanitizeData(data),
      timestamp: new Date().toISOString(),
      component
    };
  }

  // Sanitize sensitive data in production
  private sanitizeData(data: any): any {
    if (!data || this.isDevelopment) return data;
    
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];
    const sanitized = { ...data };
    
    for (const key of sensitiveKeys) {
      if (key in sanitized) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  critical(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('critical', message, data, component);
    
    // Always log critical issues
    console.error(`[${entry.timestamp}] CRITICAL${entry.component ? ` [${entry.component}]` : ''}: ${entry.message}`, entry.data);
    
    // In production, send to monitoring service
    if (!this.isDevelopment) {
      this.sendToMonitoringService(entry);
    }
  }

  error(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('error', message, data, component);
    
    // Always log errors
    console.error(`[${entry.timestamp}] ERROR${entry.component ? ` [${entry.component}]` : ''}: ${entry.message}`, entry.data);
    
    if (!this.isDevelopment) {
      this.sendToMonitoringService(entry);
    }
  }

  warn(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('warn', message, data, component);
    
    // Log warnings in production for security monitoring
    console.warn(`[${entry.timestamp}] WARN${entry.component ? ` [${entry.component}]` : ''}: ${entry.message}`, entry.data);
    
    if (!this.isDevelopment) {
      this.sendToMonitoringService(entry);
    }
  }

  // Secure info logging - only in development
  secureInfo(message: string, data?: any, component?: string) {
    if (this.isDevelopment) {
      logger.info(message, data, component);
    }
  }

  // Secure debug logging - only in development
  secureDebug(message: string, data?: any, component?: string) {
    if (this.isDevelopment) {
      logger.debug(message, data, component);
    }
  }

  private sendToMonitoringService(entry: ProductionLogEntry): void {
    // In production, integrate with monitoring service like Sentry
    // For now, we'll prepare the structure
    if (entry.level === 'critical' || entry.level === 'error') {
      // Could integrate with external monitoring here
      // Example: Sentry.captureException(new Error(entry.message), { extra: entry.data });
    }
  }
}

export const productionLogger = new ProductionLogger();
