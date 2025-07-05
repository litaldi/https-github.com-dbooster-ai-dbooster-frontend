
import { productionLogger } from './productionLogger';

export function setupEnhancedGlobalErrorHandling() {
  if (typeof window === 'undefined') return;

  // Handle uncaught JavaScript errors
  window.addEventListener('error', (event) => {
    productionLogger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    }, 'GlobalErrorHandler');
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    productionLogger.error('Unhandled promise rejection', {
      reason: event.reason,
      promise: event.promise
    }, 'GlobalErrorHandler');
    
    // Prevent the default browser behavior
    event.preventDefault();
  });

  // Handle resource loading errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      const target = event.target as HTMLElement;
      productionLogger.error('Resource loading error', {
        element: target?.nodeName,
        source: (target as any)?.src || (target as any)?.href,
        message: event.message
      }, 'GlobalErrorHandler');
    }
  }, true);
}
