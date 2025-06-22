
import { productionSecurityHardening } from '@/services/security/productionSecurityHardening';
import { environmentSecurityService } from '@/services/security/environmentSecurityService';
import { productionLogger } from './productionLogger';

export function initializeEnhancedSecurity(): void {
  try {
    // Initialize production security hardening
    productionSecurityHardening.initializeProductionSecurity();
    
    // Initialize environment security headers
    environmentSecurityService.initializeSecurityHeaders();
    
    // Log security initialization
    productionLogger.warn('Enhanced security features initialized', {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      features: ['productionHardening', 'environmentValidation', 'threatDetection']
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
      productionLogger.warn('Eval execution detected', {
        codeLength: code?.length || 0,
        codePreview: code?.substring(0, 100) || ''
      }, 'SecurityMonitor');
      return originalEval.call(window, code);
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

  } catch (error) {
    productionLogger.error('Failed to initialize enhanced security', error, 'EnhancedSecurityInit');
  }
}
