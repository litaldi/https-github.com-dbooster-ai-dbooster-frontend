
import { productionSecurityHardening } from '@/services/security/productionSecurityHardening';
import { productionLogger } from './productionLogger';

export function initializeEnhancedSecurity(): void {
  try {
    // Initialize production security hardening
    productionSecurityHardening.initializeProductionSecurity();
    
    // Log security initialization
    productionLogger.warn('Enhanced security features initialized', {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }, 'EnhancedSecurityInit');

    // Set up global error handlers for security
    window.addEventListener('error', (event) => {
      // Log potential security-related errors
      if (event.error?.message?.includes('CSP') || 
          event.error?.message?.includes('blocked') ||
          event.error?.message?.includes('security')) {
        productionLogger.error('Security-related error detected', {
          message: event.error.message,
          filename: event.filename,
          lineno: event.lineno
        }, 'SecurityErrorHandler');
      }
    });

    // Set up unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('security') ||
          event.reason?.message?.includes('unauthorized') ||
          event.reason?.message?.includes('forbidden')) {
        productionLogger.error('Security-related promise rejection', {
          reason: event.reason?.message
        }, 'SecurityErrorHandler');
      }
    });

  } catch (error) {
    productionLogger.error('Failed to initialize enhanced security', error, 'EnhancedSecurityInit');
  }
}
