interface ConsoleMethod {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  trace: (...args: any[]) => void;
  table: (...args: any[]) => void;
  group: (...args: any[]) => void;
  groupEnd: (...args: any[]) => void;
  groupCollapsed: (...args: any[]) => void;
  time: (...args: any[]) => void;
  timeEnd: (...args: any[]) => void;
  count: (...args: any[]) => void;
  countReset: (...args: any[]) => void;
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
        table: console.table,
        group: console.group,
        groupEnd: console.groupEnd,
        groupCollapsed: console.groupCollapsed,
        time: console.time,
        timeEnd: console.timeEnd,
        count: console.count,
        countReset: console.countReset,
        clear: console.clear
      };

      // Replace with no-op functions in production
      const noOp = () => {};
      
      console.log = noOp;
      console.info = noOp;
      console.debug = noOp;
      console.trace = noOp;
      console.table = noOp;
      console.group = noOp;
      console.groupEnd = noOp;
      console.groupCollapsed = noOp;
      console.time = noOp;
      console.timeEnd = noOp;
      console.count = noOp;
      console.countReset = noOp;
      console.clear = noOp;

      // Keep error and warn for critical issues, but sanitize them
      console.error = (...args: any[]) => {
        // Only log critical errors in production
        if (args[0] && typeof args[0] === 'string' && args[0].includes('critical')) {
          this.originalConsole.error?.('Critical error detected');
        }
      };

      console.warn = (...args: any[]) => {
        // Only log security warnings in production
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

  // Development helper to temporarily restore console
  enableDevConsole(): void {
    if (import.meta.env.DEV) {
      this.restoreConsole();
    }
  }
}

export const productionConsole = ProductionConsoleCleanup.getInstance();
