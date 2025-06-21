
// Enhanced error handling for production environment
export function setupEnhancedGlobalErrorHandling() {
  // Global error handler for unhandled errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Send to monitoring service in production
    if (import.meta.env.PROD) {
      // You can integrate with services like Sentry, LogRocket, etc.
      // For now, we'll just log it
      console.error('Production error logged:', {
        message: event.error?.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    }
  });

  // Global handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    if (import.meta.env.PROD) {
      console.error('Production promise rejection logged:', {
        reason: event.reason,
        type: 'unhandledrejection'
      });
    }
  });

  // React error boundary fallback
  window.addEventListener('react-error', (event: any) => {
    console.error('React error boundary triggered:', event.detail);
    
    if (import.meta.env.PROD) {
      console.error('Production React error logged:', event.detail);
    }
  });
}

// Function to manually report errors
export function reportError(error: Error, context?: string) {
  console.error(`Error in ${context || 'unknown context'}:`, error);
  
  if (import.meta.env.PROD) {
    // Send to monitoring service
    console.error('Manual error report:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
}
