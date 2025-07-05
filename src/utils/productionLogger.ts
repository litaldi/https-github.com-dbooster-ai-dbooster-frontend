
interface LogContext {
  [key: string]: any;
}

export class ProductionLogger {
  private isDevelopment = import.meta.env.DEV;

  info(message: string, context?: LogContext, category?: string) {
    if (this.isDevelopment) {
      console.log(`[${category || 'INFO'}]`, message, context || '');
    }
  }

  warn(message: string, context?: LogContext, category?: string) {
    console.warn(`[${category || 'WARN'}]`, message, context || '');
  }

  error(message: string, error?: any, category?: string) {
    console.error(`[${category || 'ERROR'}]`, message, error || '');
  }

  secureInfo(message: string, context?: LogContext, category?: string) {
    if (this.isDevelopment) {
      console.log(`[SECURE-${category || 'INFO'}]`, message, context || '');
    }
  }

  secureDebug(message: string, context?: LogContext, category?: string) {
    if (this.isDevelopment) {
      console.debug(`[SECURE-${category || 'DEBUG'}]`, message, context || '');
    }
  }
}

export const productionLogger = new ProductionLogger();
