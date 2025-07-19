
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

interface SanitizedError {
  message: string;
  code: string;
  context?: Record<string, any>;
  timestamp: string;
}

export class SecureErrorHandler {
  private static instance: SecureErrorHandler;
  
  // Sensitive patterns to remove from error messages
  private readonly SENSITIVE_PATTERNS = [
    /database|sql|postgres|supabase/gi,
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, // UUIDs
    /password|token|secret|key|auth/gi,
    /\/[^\s]*\.(js|ts|tsx|jsx)/gi, // File paths
    /at\s+[^\s]+\s+\([^)]+\)/gi // Stack trace locations
  ];

  // Safe error messages for common scenarios
  private readonly ERROR_MAPPINGS: Record<string, string> = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please verify your email address',
    'User already registered': 'An account with this email already exists',
    'Signup not allowed': 'Registration is currently unavailable',
    'Rate limit exceeded': 'Too many attempts. Please try again later',
    'Session expired': 'Your session has expired. Please log in again',
    'Unauthorized': 'You do not have permission to perform this action',
    'Forbidden': 'Access denied',
    'Network Error': 'Connection error. Please check your internet connection',
    'Timeout': 'Request timed out. Please try again'
  };

  static getInstance(): SecureErrorHandler {
    if (!SecureErrorHandler.instance) {
      SecureErrorHandler.instance = new SecureErrorHandler();
    }
    return SecureErrorHandler.instance;
  }

  sanitizeError(error: unknown, context: string): SanitizedError {
    const timestamp = new Date().toISOString();
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    let errorContext: Record<string, any> = {};

    try {
      // Extract error information safely
      if (error instanceof Error) {
        const originalMessage = error.message;
        
        // Check for known error patterns
        const mappedMessage = this.ERROR_MAPPINGS[originalMessage];
        if (mappedMessage) {
          message = mappedMessage;
          code = this.generateErrorCode(originalMessage);
        } else {
          // Sanitize unknown errors
          message = this.sanitizeMessage(originalMessage);
          code = this.generateErrorCode(originalMessage);
        }

        errorContext = {
          name: error.name,
          context,
          sanitized: message !== originalMessage
        };

        // Log the full error internally
        this.logErrorInternally(error, context, {
          originalMessage,
          sanitizedMessage: message,
          stack: error.stack
        });

      } else if (typeof error === 'string') {
        const mappedMessage = this.ERROR_MAPPINGS[error];
        message = mappedMessage || this.sanitizeMessage(error);
        code = this.generateErrorCode(error);
        
        errorContext = { context, type: 'string_error' };
        
      } else if (error && typeof error === 'object') {
        // Handle structured errors (like from Supabase)
        const errorObj = error as any;
        
        if (errorObj.message) {
          const mappedMessage = this.ERROR_MAPPINGS[errorObj.message];
          message = mappedMessage || this.sanitizeMessage(errorObj.message);
        }
        
        if (errorObj.code) {
          code = String(errorObj.code);
        }
        
        errorContext = {
          context,
          type: 'structured_error',
          hasDetails: !!errorObj.details
        };

        this.logErrorInternally(errorObj, context, {
          originalError: errorObj,
          sanitizedMessage: message
        });
      }

    } catch (sanitizationError) {
      // If sanitization itself fails, use a generic message
      message = 'A system error occurred';
      code = 'SANITIZATION_ERROR';
      
      productionLogger.error('Error sanitization failed', sanitizationError, 'SecureErrorHandler');
    }

    return {
      message,
      code,
      context: errorContext,
      timestamp
    };
  }

  private sanitizeMessage(message: string): string {
    let sanitized = message;

    // Remove sensitive patterns
    this.SENSITIVE_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    // Remove technical jargon that might confuse users
    sanitized = sanitized
      .replace(/constraint|violation|foreign key/gi, 'data validation error')
      .replace(/timeout|timed out/gi, 'connection timeout')
      .replace(/connection refused|ECONNREFUSED/gi, 'service unavailable')
      .replace(/network error|fetch failed/gi, 'network connection issue');

    // Ensure the message is user-friendly
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 97) + '...';
    }

    // If the message is too technical or empty after sanitization, use generic message
    if (sanitized.includes('[REDACTED]') || sanitized.length < 5) {
      sanitized = 'An error occurred while processing your request';
    }

    return sanitized;
  }

  private generateErrorCode(originalMessage: string): string {
    // Generate a consistent error code based on the message
    const hash = this.simpleHash(originalMessage);
    return `ERR_${hash.toString(36).toUpperCase().padStart(6, '0')}`;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private async logErrorInternally(
    error: any, 
    context: string, 
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase.from('comprehensive_security_log').insert({
        user_id: user.user?.id,
        event_type: 'error_occurred',
        event_category: 'error_handling',
        severity: this.determineSeverity(error),
        event_data: {
          context,
          error_type: typeof error,
          error_name: error?.name || 'unknown',
          metadata,
          user_agent: navigator.userAgent
        },
        ip_address: await this.getUserIP()
      });

      // Also log to production logger for immediate visibility
      productionLogger.error(`Error in ${context}`, error, 'SecureErrorHandler');

    } catch (loggingError) {
      // If logging fails, at least log to console
      console.error('Failed to log error:', loggingError);
      productionLogger.error('Error logging failed', loggingError, 'SecureErrorHandler');
    }
  }

  private determineSeverity(error: any): string {
    if (error?.message?.includes('SECURITY VIOLATION') || 
        error?.message?.includes('unauthorized') ||
        error?.message?.includes('permission denied')) {
      return 'critical';
    }
    
    if (error?.message?.includes('network') || 
        error?.message?.includes('timeout') ||
        error?.message?.includes('connection')) {
      return 'warning';
    }
    
    return 'error';
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  // Public method to handle and sanitize errors with context
  handleError(error: unknown, context: string, showToUser: boolean = true): SanitizedError {
    const sanitizedError = this.sanitizeError(error, context);
    
    if (showToUser) {
      // Could integrate with toast notifications here
      console.warn(`Error (${sanitizedError.code}): ${sanitizedError.message}`);
    }
    
    return sanitizedError;
  }

  // Method to check if an error should be shown to the user
  shouldShowToUser(error: unknown): boolean {
    if (error instanceof Error) {
      // Don't show technical errors to users
      const technicalIndicators = [
        'stack trace',
        'database error',
        'sql',
        'constraint violation',
        'internal server error'
      ];
      
      return !technicalIndicators.some(indicator => 
        error.message.toLowerCase().includes(indicator)
      );
    }
    
    return true;
  }
}

export const secureErrorHandler = SecureErrorHandler.getInstance();
