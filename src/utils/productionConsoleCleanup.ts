
interface ConsoleMethod {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}

class ProductionConsoleManager {
  private static instance: ProductionConsoleManager;
  private originalConsole: Partial<ConsoleMethod> = {};
  private isProduction = import.meta.env.PROD;

  static getInstance(): ProductionConsoleManager {
    if (!ProductionConsoleManager.instance) {
      ProductionConsoleManager.instance = new ProductionConsoleManager();
    }
    return ProductionConsoleManager.instance;
  }

  initializeConsoleOptimization(): void {
    if (!this.isProduction || typeof console === 'undefined') {
      return;
    }

    // Store original console methods
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };

    // Create optimized console methods for production
    console.log = this.createOptimizedLogger('log');
    console.info = this.createOptimizedLogger('info'); 
    console.debug = () => {}; // Disable debug logs in production
    console.warn = this.createOptimizedLogger('warn');
    console.error = this.createOptimizedLogger('error');
  }

  private createOptimizedLogger(level: string) {
    return (...args: any[]) => {
      // Only log critical issues in production
      if (level === 'error' || level === 'warn') {
        const message = args[0];
        if (typeof message === 'string') {
          const isCritical = ['security', 'critical', 'auth', 'network'].some(keyword =>
            message.toLowerCase().includes(keyword)
          );
          
          if (isCritical) {
            this.originalConsole[level as keyof ConsoleMethod]?.(`[${level.toUpperCase()}]`, ...args);
          }
        }
      }
    };
  }

  restoreConsole(): void {
    if (typeof console !== 'undefined') {
      Object.assign(console, this.originalConsole);
    }
  }
}

export const productionConsoleManager = ProductionConsoleManager.getInstance();
