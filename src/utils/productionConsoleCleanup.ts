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
  private allowedContexts = new Set(['test', 'development', 'storybook']);

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

      // Replace with production-safe versions
      const noOp = () => {};
      
      console.log = this.createSecureLogger('log');
      console.info = this.createSecureLogger('info');
      console.debug = noOp;
      console.trace = noOp;
      console.clear = noOp;

      // Keep error and warn for critical issues, but sanitize them
      console.error = this.createSecureLogger('error');
      console.warn = this.createSecureLogger('warn');

      // Add security monitoring
      this.monitorConsoleUsage();

      this.isInitialized = true;
    } catch (error) {
      // Silent fail to prevent production issues
    }
  }

  private createSecureLogger(level: string) {
    return (...args: any[]) => {
      // Check if this is a security-critical or development context
      const stack = new Error().stack || '';
      const isDevelopmentContext = this.allowedContexts.some(context => 
        stack.includes(context) || stack.includes('productionLogger')
      );

      if (isDevelopmentContext) {
        this.originalConsole[level as keyof ConsoleMethod]?.(...args);
        return;
      }

      // In production, only log critical security issues
      if (level === 'error' || level === 'warn') {
        const message = args[0];
        if (typeof message === 'string') {
          const isCritical = ['security', 'critical', 'auth', 'csrf', 'xss'].some(keyword =>
            message.toLowerCase().includes(keyword)
          );
          
          if (isCritical) {
            this.originalConsole[level as keyof ConsoleMethod]?.(`[SECURITY] ${message}`);
          }
        }
      }
    };
  }

  private monitorConsoleUsage(): void {
    // Monitor for unauthorized console usage
    const originalLog = this.originalConsole.log;
    if (originalLog && import.meta.env.PROD) {
      // Set up periodic monitoring for console pollution
      setInterval(() => {
        this.scanForUnauthorizedLogging();
      }, 60000); // Check every minute
    }
  }

  private scanForUnauthorizedLogging(): void {
    // This would be implemented to detect if console methods have been overridden
    // by malicious code or if there are unauthorized logging attempts
    try {
      const currentConsole = console.log.toString();
      const expectedPattern = /createSecureLogger|noOp/;
      
      if (!expectedPattern.test(currentConsole)) {
        // Console may have been compromised
        this.originalConsole.warn?.('[SECURITY] Console logging may have been compromised');
      }
    } catch (error) {
      // Silent fail
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

  // Enhanced security method to completely disable console in production
  lockdownConsole(): void {
    if (import.meta.env.PROD && typeof window !== 'undefined') {
      try {
        // More aggressive console lockdown for maximum security
        Object.defineProperty(window, 'console', {
          value: {
            log: () => {},
            warn: () => {},
            error: () => {},
            info: () => {},
            debug: () => {},
            trace: () => {},
            clear: () => {},
            group: () => {},
            groupEnd: () => {},
            table: () => {},
            time: () => {},
            timeEnd: () => {},
            count: () => {},
            assert: () => {}
          },
          writable: false,
          configurable: false
        });
      } catch (error) {
        // Silent fail
      }
    }
  }
}

export const productionConsole = ProductionConsoleCleanup.getInstance();
