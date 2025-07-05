
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { rateLimitService } from '@/services/security/rateLimitService';
import { productionLogger } from './productionLogger';

export function initializeEnhancedSecurity(): void {
  try {
    // Log security initialization
    productionLogger.secureInfo('Enhanced security features initialized', {
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE || 'development',
      features: ['consolidatedAuth', 'inputValidation', 'rateLimiting', 'threatDetection']
    }, 'EnhancedSecurityInit');

    // Set up enhanced global error handlers for security
    window.addEventListener('error', (event) => {
      // Log potential security-related errors
      if (event.error?.message?.includes('CSP') || 
          event.error?.message?.includes('blocked') ||
          event.error?.message?.includes('security') ||
          event.error?.message?.includes('cors')) {
        productionLogger.error('Security-related error detected', {
          message: event.error.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error.stack?.substring(0, 500)
        }, 'SecurityErrorHandler');
      }
    });

    // Set up enhanced unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('security') ||
          event.reason?.message?.includes('unauthorized') ||
          event.reason?.message?.includes('forbidden') ||
          event.reason?.message?.includes('cors') ||
          event.reason?.message?.includes('blocked')) {
        productionLogger.error('Security-related promise rejection', {
          reason: event.reason?.message,
          stack: event.reason?.stack?.substring(0, 500)
        }, 'SecurityErrorHandler');
      }
    });

    // Monitor for suspicious JavaScript execution
    const originalEval = window.eval;
    window.eval = function(code: string) {
      productionLogger.error('Eval execution blocked for security', {
        codeLength: code?.length || 0,
        codePreview: code?.substring(0, 100) || ''
      }, 'SecurityMonitor');
      throw new Error('eval() is disabled for security reasons');
    };

    // Monitor for dynamic script creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      const element = originalCreateElement.call(document, tagName);
      if (tagName.toLowerCase() === 'script') {
        productionLogger.warn('Dynamic script creation detected', {
          timestamp: Date.now()
        }, 'SecurityMonitor');
      }
      return element;
    };

    // Monitor localStorage access for sensitive data
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key: string, value: string) {
      // Check for sensitive data being stored
      const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credential'];
      const isSensitive = sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive));
      
      if (isSensitive && key !== 'dbooster_remember_me' && !key.startsWith('supabase.auth.')) {
        productionLogger.warn('Sensitive data storage detected', {
          key: key.substring(0, 20),
          timestamp: Date.now()
        }, 'SecurityMonitor');
      }
      
      return originalSetItem.call(this, key, value);
    };

  } catch (error) {
    productionLogger.error('Failed to initialize enhanced security', error, 'EnhancedSecurityInit');
  }
}
