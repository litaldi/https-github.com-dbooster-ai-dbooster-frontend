
import { productionLogger } from './productionLogger';
import { ProductionSecurityManager } from './productionSecurity';
import { performanceMonitor } from './performanceMonitor';
import { securityInitializer } from './securityInitializer';
import { initializeSecurityHardening } from './securityHardening';

class ProductionInitializer {
  private static instance: ProductionInitializer;

  static getInstance(): ProductionInitializer {
    if (!ProductionInitializer.instance) {
      ProductionInitializer.instance = new ProductionInitializer();
    }
    return ProductionInitializer.instance;
  }

  async initialize(): Promise<void> {
    if (!import.meta.env.PROD) {
      productionLogger.info('Development mode detected, skipping production initialization', {}, 'ProductionInit');
      return;
    }

    try {
      productionLogger.info('Starting production initialization', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }, 'ProductionInit');

      // Initialize enhanced security system first
      await securityInitializer.initializeComprehensiveSecurity();

      // Initialize legacy security hardening
      initializeSecurityHardening();

      // Initialize production security manager
      const securityManager = ProductionSecurityManager.getInstance();
      securityManager.initializeProductionSecurity();

      // Initialize performance monitoring
      performanceMonitor.initialize();

      // Set up global error handlers with security awareness
      this.setupSecureErrorHandlers();

      // Initialize security monitoring
      this.initializeSecurityMonitoring();

      productionLogger.info('Production initialization completed successfully', {}, 'ProductionInit');
    } catch (error) {
      productionLogger.error('Critical error during production initialization', error, 'ProductionInit');
      // In production, we continue despite errors to avoid breaking the app completely
      console.error('Production initialization failed:', error);
    }
  }

  private setupSecureErrorHandlers(): void {
    // Global error handler with security filtering
    window.addEventListener('error', (event) => {
      // Filter out potentially sensitive information
      const safeError = {
        message: event.error?.message?.substring(0, 200) || 'Unknown error',
        filename: event.filename ? this.sanitizeFilename(event.filename) : 'unknown',
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
      };

      // Check if error might be security-related
      const securityKeywords = ['security', 'auth', 'token', 'credential', 'password', 'csrf', 'xss'];
      const isSecurityRelated = securityKeywords.some(keyword => 
        safeError.message.toLowerCase().includes(keyword)
      );

      if (isSecurityRelated) {
        productionLogger.error('Security-related error detected', safeError, 'SecurityError');
      } else {
        productionLogger.error('Application error', safeError, 'ApplicationError');
      }
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const safeError = {
        reason: event.reason?.message?.substring(0, 200) || 'Unknown rejection',
        timestamp: new Date().toISOString()
      };

      productionLogger.error('Unhandled promise rejection', safeError, 'PromiseRejection');
    });
  }

  private sanitizeFilename(filename: string): string {
    // Remove potentially sensitive path information
    return filename.replace(/.*\//, '').replace(/\?.*$/, '');
  }

  private initializeSecurityMonitoring(): void {
    // Monitor for page visibility changes (potential security concern)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        productionLogger.info('Page hidden - user may have switched tabs', {}, 'SecurityMonitor');
      } else {
        productionLogger.info('Page visible - user returned to tab', {}, 'SecurityMonitor');
      }
    });

    // Monitor for focus changes (security-relevant for session management)
    window.addEventListener('focus', () => {
      productionLogger.info('Window gained focus', {}, 'SecurityMonitor');
    });

    window.addEventListener('blur', () => {
      productionLogger.info('Window lost focus', {}, 'SecurityMonitor');
    });
  }
}

export const productionInitializer = ProductionInitializer.getInstance();
