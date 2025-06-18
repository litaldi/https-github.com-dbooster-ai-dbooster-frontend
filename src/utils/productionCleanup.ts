// Utility to clean up development artifacts in production
export function cleanupProductionBuild() {
  if (process.env.NODE_ENV === 'production') {
    // Remove development console methods
    const originalConsole = { ...console };
    
    // Keep error and warn for critical issues, but remove verbose logging
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.trace = () => {};
    console.group = () => {};
    console.groupEnd = () => {};
    console.groupCollapsed = () => {};
    console.time = () => {};
    console.timeEnd = () => {};
    
    // Preserve error and warn for monitoring
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    
    // Remove any development tools from window object
    if (typeof window !== 'undefined') {
      delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;
    }
  }
}

// Call during app initialization
export function initializeProductionEnvironment() {
  cleanupProductionBuild();
  
  // Add any other production-specific initialization
  if (process.env.NODE_ENV === 'production') {
    // Disable React DevTools
    if (typeof window !== 'undefined') {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        isDisabled: true,
        supportsFiber: true,
        inject: () => {},
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {}
      };
    }
  }
}
