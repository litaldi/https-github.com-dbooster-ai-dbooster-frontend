
export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  component?: string;
  timestamp?: number;
}

export class Logger {
  private static instance: Logger;
  private isDevelopment = import.meta.env.DEV;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogEntry['level'], message: string, data?: any, component?: string) {
    const entry: LogEntry = {
      level,
      message,
      data,
      component,
      timestamp: Date.now()
    };

    if (this.isDevelopment) {
      const prefix = `[${level.toUpperCase()}]${component ? ` [${component}]` : ''}`;
      
      switch (level) {
        case 'error':
          console.error(prefix, message, data);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'info':
          console.info(prefix, message, data);
          break;
        case 'debug':
          console.debug(prefix, message, data);
          break;
      }
    }
  }

  debug(message: string, data?: any, component?: string) {
    this.log('debug', message, data, component);
  }

  info(message: string, data?: any, component?: string) {
    this.log('info', message, data, component);
  }

  warn(message: string, data?: any, component?: string) {
    this.log('warn', message, data, component);
  }

  error(message: string, data?: any, component?: string) {
    this.log('error', message, data, component);
  }
}

export const logger = Logger.getInstance();
