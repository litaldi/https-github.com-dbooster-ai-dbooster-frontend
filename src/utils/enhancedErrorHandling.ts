
import { toast } from 'sonner';

export interface EnhancedErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
  sessionId?: string;
  buildVersion?: string;
}

export class EnhancedAppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: EnhancedErrorContext;
  public readonly isOperational: boolean;
  public readonly severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: EnhancedErrorContext,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'EnhancedAppError';
    this.code = code;
    this.statusCode = statusCode;
    this.severity = severity;
    this.context = {
      ...context,
      timestamp: Date.now(),
      userAgent: navigator?.userAgent,
      url: window?.location?.href,
      sessionId: sessionStorage.getItem('session_id') || undefined,
      buildVersion: import.meta.env.VITE_BUILD_VERSION || 'unknown'
    };
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnhancedAppError);
    }
  }
}

export class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;
  private errorQueue: EnhancedAppError[] = [];
  private maxQueueSize = 50;

  static getInstance(): EnhancedErrorHandler {
    if (!EnhancedErrorHandler.instance) {
      EnhancedErrorHandler.instance = new EnhancedErrorHandler();
    }
    return EnhancedErrorHandler.instance;
  }

  handleError(error: Error | EnhancedAppError, context?: EnhancedErrorContext): void {
    let enhancedError: EnhancedAppError;

    if (error instanceof EnhancedAppError) {
      enhancedError = error;
    } else {
      enhancedError = new EnhancedAppError(
        error.message,
        'RUNTIME_ERROR',
        500,
        'medium',
        context,
        true
      );
    }

    // Add to error queue
    this.addToQueue(enhancedError);

    // Log error
    this.logError(enhancedError);

    // Show user notification based on severity
    this.showUserNotification(enhancedError);

    // Report to monitoring service
    this.reportError(enhancedError);
  }

  private addToQueue(error: EnhancedAppError): void {
    this.errorQueue.push(error);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  private logError(error: EnhancedAppError): void {
    const logLevel = this.getLogLevel(error.severity);
    
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${error.severity.toUpperCase()} Error`);
      console[logLevel]('Message:', error.message);
      console[logLevel]('Code:', error.code);
      console[logLevel]('Context:', error.context);
      console[logLevel]('Stack:', error.stack);
      console.groupEnd();
    } else {
      // Production logging (send to external service)
      console.error(`[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`);
    }
  }

  private getLogLevel(severity: string): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'low': return 'log';
      case 'medium': return 'warn';
      case 'high':
      case 'critical': return 'error';
      default: return 'warn';
    }
  }

  private showUserNotification(error: EnhancedAppError): void {
    const userMessage = this.getUserFriendlyMessage(error);
    
    switch (error.severity) {
      case 'low':
        // No notification for low severity
        break;
      case 'medium':
        toast.warning(userMessage, {
          duration: 4000,
          action: {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        });
        break;
      case 'high':
        toast.error(userMessage, {
          duration: 6000,
          action: {
            label: 'Report Issue',
            onClick: () => this.openSupportChat()
          }
        });
        break;
      case 'critical':
        toast.error(userMessage, {
          duration: 0, // Persistent
          action: {
            label: 'Contact Support',
            onClick: () => this.openSupportChat()
          }
        });
        break;
    }
  }

  private getUserFriendlyMessage(error: EnhancedAppError): string {
    const errorMessages: Record<string, string> = {
      NETWORK_ERROR: 'Connection issue detected. Please check your internet connection.',
      AUTH_ERROR: 'Authentication problem. Please sign in again.',
      VALIDATION_ERROR: 'Please check your input and try again.',
      PERMISSION_ERROR: 'You don\'t have permission to perform this action.',
      RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.',
      SERVER_ERROR: 'Server is experiencing issues. Our team has been notified.',
      TIMEOUT_ERROR: 'Request timed out. Please try again.',
      NOT_FOUND_ERROR: 'The requested resource was not found.'
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
  }

  private reportError(error: EnhancedAppError): void {
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && error.severity !== 'low') {
      // Example: Send to Sentry, DataDog, etc.
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          code: error.code,
          severity: error.severity,
          context: error.context,
          stack: error.stack
        })
      }).catch(() => {
        // Silent fail for error reporting
      });
    }
  }

  private openSupportChat(): void {
    // Open support chat widget
    const chatWidget = document.querySelector('[data-chat-widget]');
    if (chatWidget) {
      (chatWidget as HTMLElement).click();
    }
  }

  getErrorHistory(): EnhancedAppError[] {
    return [...this.errorQueue];
  }

  clearErrorHistory(): void {
    this.errorQueue = [];
  }
}

// Global error handler setup
export function setupEnhancedGlobalErrorHandling(): void {
  const errorHandler = EnhancedErrorHandler.getInstance();

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = new EnhancedAppError(
      event.reason?.message || 'Unhandled promise rejection',
      'UNHANDLED_PROMISE',
      500,
      'high',
      { component: 'Global', action: 'Promise Rejection' },
      false
    );
    errorHandler.handleError(error);
    event.preventDefault();
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    const error = new EnhancedAppError(
      event.error?.message || event.message || 'Runtime error',
      'RUNTIME_ERROR',
      500,
      'high',
      { 
        component: 'Global', 
        action: 'Runtime Error',
        url: event.filename,
      },
      false
    );
    errorHandler.handleError(error);
  });

  // Handle network status changes
  window.addEventListener('online', () => {
    toast.success('Connection restored! You\'re back online.', {
      duration: 3000
    });
  });

  window.addEventListener('offline', () => {
    toast.warning('You\'re currently offline. Some features may not work.', {
      duration: 5000
    });
  });
}

// Convenience functions
export const handleApiError = (error: any, context?: EnhancedErrorContext): void => {
  const errorHandler = EnhancedErrorHandler.getInstance();
  
  let enhancedError: EnhancedAppError;
  
  if (error?.status >= 400 && error?.status < 500) {
    enhancedError = new EnhancedAppError(
      error.message || 'Client error',
      'CLIENT_ERROR',
      error.status,
      'medium',
      context
    );
  } else if (error?.status >= 500) {
    enhancedError = new EnhancedAppError(
      'Server error occurred',
      'SERVER_ERROR',
      error.status,
      'high',
      context
    );
  } else {
    enhancedError = new EnhancedAppError(
      error?.message || 'Unknown API error',
      'API_ERROR',
      500,
      'medium',
      context
    );
  }
  
  errorHandler.handleError(enhancedError);
};

export const handleFormError = (error: any, context?: EnhancedErrorContext): void => {
  const errorHandler = EnhancedErrorHandler.getInstance();
  const enhancedError = new EnhancedAppError(
    error?.message || 'Form validation error',
    'VALIDATION_ERROR',
    400,
    'low',
    context
  );
  errorHandler.handleError(enhancedError);
};
