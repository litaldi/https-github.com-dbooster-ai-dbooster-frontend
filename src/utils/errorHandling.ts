
import { enhancedToast } from '@/components/ui/enhanced-toast';

export interface ErrorInfo {
  code?: string;
  context?: string;
  userId?: string;
  timestamp?: string;
  url?: string;
  userAgent?: string;
}

export class AppError extends Error {
  public code: string;
  public context: string;
  public isUserFacing: boolean;
  public severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    context: string = 'general',
    isUserFacing: boolean = true,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.isUserFacing = isUserFacing;
    this.severity = severity;
  }
}

export function createError(
  message: string,
  code?: string,
  context?: string,
  severity?: 'low' | 'medium' | 'high' | 'critical'
): AppError {
  return new AppError(message, code, context, true, severity);
}

export function handleApiError(error: any): string {
  console.error('API Error:', error);
  
  // Supabase errors
  if (error?.message) {
    if (error.message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (error.message.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    if (error.message.includes('User already registered')) {
      return 'An account with this email already exists. Please try signing in instead.';
    }
    if (error.message.includes('rate limit')) {
      return 'Too many attempts. Please wait a few minutes before trying again.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'Unable to connect. Please check your internet connection.';
  }

  // Rate limiting
  if (error?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  // Server errors
  if (error?.status >= 500) {
    return 'Server error. Please try again later.';
  }

  // Client errors
  if (error?.status >= 400 && error?.status < 500) {
    return error?.message || 'Invalid request. Please check your input and try again.';
  }

  // Default fallback
  return error?.message || 'An unexpected error occurred. Please try again.';
}

export function logError(error: Error | AppError, info?: ErrorInfo) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...info,
    ...(error instanceof AppError && {
      code: error.code,
      context: error.context,
      severity: error.severity,
      isUserFacing: error.isUserFacing,
    }),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', errorData);
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to Sentry, LogRocket, or other error tracking service
    console.error('Production error:', errorData);
  }

  // Show user-facing errors as toasts
  if (error instanceof AppError && error.isUserFacing) {
    enhancedToast.error({
      title: 'Error',
      description: error.message,
      duration: error.severity === 'critical' ? 10000 : 5000,
    });
  }
}

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string = 'operation'
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error(String(error)),
        { context }
      );
      return null;
    }
  };
}

// Retry utility with exponential backoff
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        break;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Global error handler
export function setupGlobalErrorHandling() {
  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(
      new Error(`Unhandled promise rejection: ${event.reason}`),
      { context: 'unhandled_promise' }
    );
    event.preventDefault();
  });

  // Catch global errors
  window.addEventListener('error', (event) => {
    logError(
      new Error(`Global error: ${event.message}`),
      { 
        context: 'global_error',
        url: event.filename,
      }
    );
  });
}
