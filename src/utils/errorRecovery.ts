
import { toast } from 'sonner';

export interface ErrorRecoveryOptions {
  retry?: () => Promise<void> | void;
  fallback?: () => void;
  report?: boolean;
  userMessage?: string;
}

export class ErrorRecovery {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;

  static async handleError(
    error: Error,
    context: string,
    options: ErrorRecoveryOptions = {}
  ): Promise<void> {
    console.error(`Error in ${context}:`, error);

    const { retry, fallback, report = true, userMessage } = options;
    const retryKey = `${context}-${error.message}`;
    const currentAttempts = this.retryAttempts.get(retryKey) || 0;

    // Report error if requested
    if (report) {
      this.reportError(error, context);
    }

    // Try recovery strategies
    if (retry && currentAttempts < this.maxRetries) {
      this.retryAttempts.set(retryKey, currentAttempts + 1);
      
      try {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentAttempts) * 1000));
        await retry();
        this.retryAttempts.delete(retryKey);
        return;
      } catch (retryError) {
        console.error(`Retry ${currentAttempts + 1} failed:`, retryError);
      }
    }

    // Use fallback if available
    if (fallback) {
      try {
        fallback();
        return;
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
      }
    }

    // Show user-friendly error message
    const message = userMessage || this.getUserFriendlyMessage(error);
    toast.error(message);
  }

  private static reportError(error: Error, context: string): void {
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { tags: { context } });
    }
  }

  private static getUserFriendlyMessage(error: Error): string {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (error.message.includes('unauthorized') || error.message.includes('403')) {
      return 'You are not authorized to perform this action.';
    }
    
    if (error.message.includes('not found') || error.message.includes('404')) {
      return 'The requested resource was not found.';
    }
    
    if (error.message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }

  static clearRetryHistory(): void {
    this.retryAttempts.clear();
  }
}

// Global error handler
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    ErrorRecovery.handleError(
      new Error(event.reason),
      'unhandled-promise',
      {
        report: true,
        userMessage: 'An unexpected error occurred. The application will continue running.'
      }
    );
    event.preventDefault();
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    ErrorRecovery.handleError(
      event.error || new Error(event.message),
      'global-error',
      {
        report: true,
        userMessage: 'An unexpected error occurred. Please refresh the page if issues persist.'
      }
    );
  });
}
