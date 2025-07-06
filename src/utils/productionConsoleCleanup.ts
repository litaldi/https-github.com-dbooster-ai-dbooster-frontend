interface ConsoleMethod {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  trace: (...args: any[]) => void;
  clear: () => void;
}

class ProductionConsoleCleanup {
  private static instance: ProductionConsoleCleanup;
  private originalConsole: Partial<ConsoleMethod> = {};
  private isInitialized = false;

  static getInstance(): ProductionConsoleCleanup {
    if (!ProductionConsoleCleanup.instance) {
      ProductionConsoleCleanup.instance = new ProductionConsoleCleanup();
    }
    return ProductionConsoleCleanup.instance;
  }

  initializeConsoleCleanup(): void {
    if (this.isInitialized || !import.meta.env.PROD) {
      return;
    }

    if (typeof window === 'undefined' || typeof console === 'undefined') {
      return;
    }

    try {
      // Store original console methods
      this.originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
        trace: console.trace,
        clear: console.clear
      };

      // Replace with no-op functions in production
      const noOp = () => {};
      
      console.log = noOp;
      console.info = noOp;
      console.debug = noOp;
      console.trace = noOp;
      console.clear = noOp;

      // Keep error and warn for critical issues, but sanitize them
      console.error = (...args: any[]) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('critical')) {
          this.originalConsole.error?.('Critical error detected');
        }
      };

      console.warn = (...args: any[]) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('security')) {
          this.originalConsole.warn?.('Security warning detected');
        }
      };

      this.isInitialized = true;
    } catch (error) {
      // Silent fail to prevent production issues
    }
  }

  restoreConsole(): void {
    if (!this.isInitialized || typeof console === 'undefined') {
      return;
    }

    try {
      Object.assign(console, this.originalConsole);
      this.isInitialized = false;
    } catch (error) {
      // Silent fail
    }
  }

  enableDevConsole(): void {
    if (import.meta.env.DEV) {
      this.restoreConsole();
    }
  }
}

export const productionConsole = ProductionConsoleCleanup.getInstance();
