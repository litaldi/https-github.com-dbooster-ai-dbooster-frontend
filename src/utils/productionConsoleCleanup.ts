
// Enhanced production console cleanup utility
export class ProductionConsoleManager {
  private static instance: ProductionConsoleManager;
  private originalMethods: Partial<Console> = {};
  private isProduction = import.meta.env.PROD;

  static getInstance(): ProductionConsoleManager {
    if (!ProductionConsoleManager.instance) {
      ProductionConsoleManager.instance = new ProductionConsoleManager();
    }
    return ProductionConsoleManager.instance;
  }

  initializeConsoleCleanup() {
    if (!this.isProduction) return;

    // Store original console methods
    this.originalMethods = {
      log: console.log,
      debug: console.debug,
      info: console.info,
      trace: console.trace,
      group: console.group,
      groupEnd: console.groupEnd,
      groupCollapsed: console.groupCollapsed,
      time: console.time,
      timeEnd: console.timeEnd,
      table: console.table,
      dir: console.dir,
      dirxml: console.dirxml,
      count: console.count,
      countReset: console.countReset,
      profile: console.profile,
      profileEnd: console.profileEnd
    };

    // Replace with no-op functions in production
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.trace = () => {};
    console.group = () => {};
    console.groupEnd = () => {};
    console.groupCollapsed = () => {};
    console.time = () => {};
    console.timeEnd = () => {};
    console.table = () => {};
    console.dir = () => {};
    console.dirxml = () => {};
    console.count = () => {};
    console.countReset = () => {};
    console.profile = () => {};
    console.profileEnd = () => {};

    // Keep critical methods for error monitoring
    // console.error and console.warn are preserved for monitoring
  }

  // Utility for development-only logging
  devLog(...args: any[]) {
    if (!this.isProduction && this.originalMethods.log) {
      this.originalMethods.log(...args);
    }
  }

  // Emergency restore function for debugging
  restoreConsole() {
    if (this.originalMethods.log) {
      Object.assign(console, this.originalMethods);
    }
  }
}

export const productionConsole = ProductionConsoleManager.getInstance();
