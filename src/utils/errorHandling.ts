
import { enhancedToast } from '@/components/ui/enhanced-toast';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: number;
  userAgent?: string;
  url?: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: ErrorContext;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    context?: ErrorContext,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = {
      ...context,
      timestamp: Date.now(),
      userAgent: navigator?.userAgent,
      url: window?.location?.href
    };
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export function handleApiError(error: any): string {
  console.error('API Error:', error);

  // Handle network errors
  if (!navigator.onLine) {
    return 'No internet connection. Please check your network and try again.';
  }

  if (error?.name === 'NetworkError' || error?.message?.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Handle Supabase auth errors
  if (error?.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials.';
  }

  if (error?.message?.includes('User already registered')) {
    return 'An account with this email already exists. Please try signing in instead.';
  }

  if (error?.message?.includes('Email not confirmed')) {
    return 'Please check your email and click the confirmation link.';
  }

  // Handle validation errors
  if (error?.statusCode >= 400 && error?.statusCode < 500) {
    return error?.message || 'Invalid request. Please check your input and try again.';
  }

  // Handle server errors
  if (error?.statusCode >= 500) {
    return 'Server error. Please try again later.';
  }

  // Handle timeout errors
  if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Default error message
  return error?.message || 'An unexpected error occurred. Please try again.';
}

export function logError(error: Error | AppError, context?: ErrorContext) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...(error instanceof AppError && {
      code: error.code,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
      context: error.context
    }),
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚨 Error Logged');
    console.error('Error:', error);
    console.table(errorInfo);
    console.groupEnd();
  } else {
    // In production, send to monitoring service
    console.error('Error logged:', errorInfo);
    // TODO: Send to external monitoring service (Sentry, LogRocket, etc.)
  }

  return errorInfo;
}

export function showErrorToast(error: Error | string, context?: ErrorContext) {
  const message = typeof error === 'string' ? error : handleApiError(error);
  
  enhancedToast.error({
    title: "Error",
    description: message,
    duration: 6000,
  });

  if (typeof error === 'object') {
    logError(error, context);
  }
}

export function setupGlobalErrorHandling() {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const error = new AppError(
      event.error?.message || 'Uncaught error occurred',
      'UNCAUGHT_ERROR',
      500,
      {
        component: 'Global',
        action: 'Uncaught Error'
      },
      false
    );

    logError(error);
    
    // Don't show toast for every uncaught error in production to avoid spam
    if (process.env.NODE_ENV === 'development') {
      showErrorToast(error);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = new AppError(
      event.reason?.message || 'Unhandled promise rejection',
      'UNHANDLED_REJECTION',
      500,
      {
        component: 'Global',
        action: 'Unhandled Promise Rejection'
      },
      false
    );

    logError(error);
    
    // Prevent the default browser behavior
    event.preventDefault();
    
    // Show user-friendly error message
    if (process.env.NODE_ENV === 'development') {
      showErrorToast(error);
    }
  });

  // Handle network status changes
  window.addEventListener('online', () => {
    enhancedToast.success({
      title: "Connection Restored",
      description: "You're back online!",
      duration: 3000,
    });
  });

  window.addEventListener('offline', () => {
    enhancedToast.warning({
      title: "Connection Lost",
      description: "Please check your internet connection.",
      duration: 5000,
    });
  });
}

// Utility function for async error handling
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: ErrorContext
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), context);
      showErrorToast(error instanceof Error ? error : String(error), context);
      return null;
    }
  };
}

// Retry mechanism for failed operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: ErrorContext
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        logError(lastError, { ...context, action: `Failed after ${maxRetries} attempts` });
        throw lastError;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      console.warn(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`, lastError.message);
    }
  }

  throw lastError!;
}
