
import { productionLogger } from './productionLogger';

export interface SanitizedError {
  message: string;
  code?: string;
  originalMessage?: string; // Only in development
}

export class ErrorSanitizer {
  private static instance: ErrorSanitizer;

  static getInstance(): ErrorSanitizer {
    if (!ErrorSanitizer.instance) {
      ErrorSanitizer.instance = new ErrorSanitizer();
    }
    return ErrorSanitizer.instance;
  }

  sanitizeError(error: any, context: string = 'unknown'): SanitizedError {
    const originalMessage = this.extractErrorMessage(error);
    
    // Log the original error for debugging
    productionLogger.error(`Error in ${context}`, error, 'ErrorSanitizer');

    // Sanitize the message for user display
    const sanitizedMessage = this.sanitizeMessage(originalMessage);

    return {
      message: sanitizedMessage,
      code: this.extractErrorCode(error),
      ...(process.env.NODE_ENV === 'development' && { originalMessage })
    };
  }

  private extractErrorMessage(error: any): string {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.error?.message) return error.error.message;
    if (error?.details) return error.details;
    return 'An unexpected error occurred';
  }

  private extractErrorCode(error: any): string | undefined {
    if (error?.code) return error.code;
    if (error?.error?.code) return error.error.code;
    if (error?.status) return String(error.status);
    return undefined;
  }

  private sanitizeMessage(message: string): string {
    // Remove potentially sensitive information
    let sanitized = message
      // Remove database/SQL information
      .replace(/database|sql|postgres|supabase/gi, 'system')
      // Remove IP addresses
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
      // Remove UUIDs
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[ID]')
      // Remove file paths
      .replace(/\/[a-zA-Z0-9_\-\.\/]+/g, '[PATH]')
      // Remove email addresses
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, '[URL]')
      // Remove stack traces
      .replace(/at\s+.+\(.+\)/g, '')
      .replace(/\s+at\s+.*/g, '');

    // Map common error patterns to user-friendly messages
    const errorMappings = [
      {
        pattern: /permission denied|access denied|unauthorized/i,
        message: 'You do not have permission to perform this action'
      },
      {
        pattern: /network|connection|fetch/i,
        message: 'Network connection error. Please check your internet connection and try again'
      },
      {
        pattern: /timeout|timed out/i,
        message: 'The request timed out. Please try again'
      },
      {
        pattern: /rate limit|too many requests/i,
        message: 'Too many requests. Please wait a moment and try again'
      },
      {
        pattern: /validation|invalid input|malformed/i,
        message: 'The information provided is not valid. Please check your input and try again'
      },
      {
        pattern: /not found|404/i,
        message: 'The requested resource was not found'
      },
      {
        pattern: /server error|internal error|500/i,
        message: 'A server error occurred. Please try again later'
      },
      {
        pattern: /authentication|login|session/i,
        message: 'Authentication error. Please sign in again'
      }
    ];

    for (const mapping of errorMappings) {
      if (mapping.pattern.test(sanitized)) {
        return mapping.message;
      }
    }

    // If no specific mapping found, return generic message
    if (sanitized.length > 100 || this.containsSensitiveKeywords(sanitized)) {
      return 'An error occurred while processing your request. Please try again';
    }

    return sanitized.trim() || 'An unexpected error occurred';
  }

  private containsSensitiveKeywords(message: string): boolean {
    const sensitiveKeywords = [
      'password', 'token', 'key', 'secret', 'auth', 'credential',
      'internal', 'system', 'admin', 'root', 'config', 'env'
    ];

    return sensitiveKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  // Utility method for React components
  sanitizeErrorForDisplay(error: any, fallbackMessage: string = 'Something went wrong'): string {
    try {
      const sanitized = this.sanitizeError(error);
      return sanitized.message || fallbackMessage;
    } catch (sanitizationError) {
      productionLogger.error('Error during error sanitization', sanitizationError, 'ErrorSanitizer');
      return fallbackMessage;
    }
  }
}

export const errorSanitizer = ErrorSanitizer.getInstance();

// Convenience functions for common use cases
export const sanitizeErrorMessage = (error: any, context?: string): string => {
  return errorSanitizer.sanitizeError(error, context).message;
};

export const sanitizeErrorForDisplay = (error: any, fallback?: string): string => {
  return errorSanitizer.sanitizeErrorForDisplay(error, fallback);
};
