
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, data?: any, component?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component
    };
  }

  error(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('error', message, data, component);
    
    // Always log errors, even in production
    console.error(`[${entry.timestamp}] ERROR${entry.component ? ` [${entry.component}]` : ''}: ${entry.message}`, entry.data);
    
    // In production, send to monitoring service
    if (!this.isDevelopment) {
      // Here you could send to external logging service
      // this.sendToMonitoringService(entry);
    }
  }

  warn(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('warn', message, data, component);
    
    // Only log warnings in development
    if (this.isDevelopment) {
      console.warn(`[${entry.timestamp}] WARN${entry.component ? ` [${entry.component}]` : ''}: ${entry.message}`, entry.data);
    }
  }

  info(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('info', message, data, component);
    
    // Only log info in development
    if (this.isDevelopment) {
      console.info(`[${entry.timestamp}] INFO${entry.component ? ` [${entry.component}]` : ''}: ${entry.message}`, entry.data);
    }
  }

  debug(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('debug', message, data, component);
    
    // Only log debug in development
    if (this.isDevelopment) {
      console.debug(`[${entry.timestamp}] DEBUG${entry.component ? ` [${entry.component}]` : ''}: ${entry.message}`, entry.data);
    }
  }
}

export const logger = new Logger();
