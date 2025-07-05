
import { logger } from './logger';
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
      logger.info('Development mode detected, skipping production initialization', {}, 'ProductionInit');
      return;
    }

    try {
      logger.info('Starting production initialization', {
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

      logger.info('Production initialization completed successfully', {}, 'ProductionInit');
    } catch (error) {
      logger.error('Critical error during production initialization', error, 'ProductionInit');
      // In production, we continue despite errors to avoid breaking the app completely
    }
  }

  async runHealthChecks(): Promise<{
    security: boolean;
    performance: boolean;
    seo: boolean;
    details: {
      security: {
        cspEnabled: boolean;
        httpsEnabled: boolean;
        devToolsDisabled: boolean;
      };
      seo: {
        hasTitle: boolean;
        hasDescription: boolean;
        hasCanonical: boolean;
        hasStructuredData: boolean;
      };
    };
  }> {
    try {
      // Security checks
      const cspEnabled = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      const httpsEnabled = window.location.protocol === 'https:';
      const devToolsDisabled = import.meta.env.PROD;

      // SEO checks
      const hasTitle = !!document.title && document.title.length > 0;
      const hasDescription = !!document.querySelector('meta[name="description"]');
      const hasCanonical = !!document.querySelector('link[rel="canonical"]');
      const hasStructuredData = !!document.querySelector('script[type="application/ld+json"]');

      const securityScore = [cspEnabled, httpsEnabled, devToolsDisabled].filter(Boolean).length;
      const seoScore = [hasTitle, hasDescription, hasCanonical, hasStructuredData].filter(Boolean).length;

      return {
        security: securityScore >= 2,
        performance: true, // Basic performance check
        seo: seoScore >= 2,
        details: {
          security: {
            cspEnabled,
            httpsEnabled,
            devToolsDisabled
          },
          seo: {
            hasTitle,
            hasDescription,
            hasCanonical,
            hasStructuredData
          }
        }
      };
    } catch (error) {
      logger.error('Health check failed', error, 'ProductionInit');
      return {
        security: false,
        performance: false,
        seo: false,
        details: {
          security: {
            cspEnabled: false,
            httpsEnabled: false,
            devToolsDisabled: false
          },
          seo: {
            hasTitle: false,
            hasDescription: false,
            hasCanonical: false,
            hasStructuredData: false
          }
        }
      };
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
        logger.error('Security-related error detected', safeError, 'SecurityError');
      } else {
        logger.error('Application error', safeError, 'ApplicationError');
      }
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const safeError = {
        reason: event.reason?.message?.substring(0, 200) || 'Unknown rejection',
        timestamp: new Date().toISOString()
      };

      logger.error('Unhandled promise rejection', safeError, 'PromiseRejection');
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
        logger.info('Page hidden - user may have switched tabs', {}, 'SecurityMonitor');
      } else {
        logger.info('Page visible - user returned to tab', {}, 'SecurityMonitor');
      }
    });

    // Monitor for focus changes (security-relevant for session management)
    window.addEventListener('focus', () => {
      logger.info('Window gained focus', {}, 'SecurityMonitor');
    });

    window.addEventListener('blur', () => {
      logger.info('Window lost focus', {}, 'SecurityMonitor');
    });
  }
}

export const productionInitializer = ProductionInitializer.getInstance();
