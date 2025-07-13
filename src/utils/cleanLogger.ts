
interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: string;
  data?: any;
  timestamp: string;
}

class CleanLogger {
  private isDevelopment = import.meta.env.DEV;

  info(message: string, data?: any, context?: string) {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: string) {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: any, context?: string) {
    this.log('error', message, data, context);
  }

  debug(message: string, data?: any, context?: string) {
    if (this.isDevelopment) {
      this.log('debug', message, data, context);
    }
  }

  private log(level: LogEntry['level'], message: string, data?: any, context?: string) {
    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString()
    };

    if (this.isDevelopment) {
      const contextStr = context ? `[${context}] ` : '';
      console.log(`[${level.toUpperCase()}] ${contextStr}${message}`, data || '');
    } else {
      // In production, send to logging service
      console.log(JSON.stringify(entry));
    }
  }
}

export const cleanLogger = new CleanLogger();
