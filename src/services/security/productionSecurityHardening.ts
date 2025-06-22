
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '../auditLogger';

interface SecurityHeaders {
  'Content-Security-Policy': string;
  'Strict-Transport-Security': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Cross-Origin-Embedder-Policy': string;
  'Cross-Origin-Opener-Policy': string;
  'Cross-Origin-Resource-Policy': string;
}

export class ProductionSecurityHardening {
  private static instance: ProductionSecurityHardening;

  static getInstance(): ProductionSecurityHardening {
    if (!ProductionSecurityHardening.instance) {
      ProductionSecurityHardening.instance = new ProductionSecurityHardening();
    }
    return ProductionSecurityHardening.instance;
  }

  getEnhancedSecurityHeaders(): SecurityHeaders {
    return {
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
        "media-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'accelerometer=()',
        'gyroscope=()'
      ].join(', '),
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin'
    };
  }

  applySecurityHeaders(): void {
    if (typeof document !== 'undefined') {
      const headers = this.getEnhancedSecurityHeaders();
      
      // Apply CSP via meta tag
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = headers['Content-Security-Policy'];
      document.head.appendChild(cspMeta);

      // Apply other security headers via meta tags where possible
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);

      productionLogger.secureInfo('Enhanced security headers applied', {}, 'ProductionSecurityHardening');
    }
  }

  async validateEnvironmentSecurity(): Promise<{ isSecure: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      // Check for production environment indicators
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        issues.push('Application not served over HTTPS in production');
      }

      // Check for exposed development tools
      if (window.location.hostname !== 'localhost' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        issues.push('React DevTools detected in production');
      }

      // Check for console tampering
      if (typeof console.clear === 'undefined') {
        issues.push('Console has been tampered with');
      }

      // Validate Supabase configuration
      const supabaseUrl = 'https://sxcbpmqsbcpsljwwwwyv.supabase.co';
      if (!supabaseUrl.startsWith('https://')) {
        issues.push('Supabase URL not using HTTPS');
      }

      if (issues.length > 0) {
        await auditLogger.logSecurityEvent({
          event_type: 'environment_security_issues',
          event_data: {
            issues,
            hostname: window.location.hostname,
            protocol: window.location.protocol
          }
        });
      }

      return {
        isSecure: issues.length === 0,
        issues
      };
    } catch (error) {
      productionLogger.error('Environment security validation failed', error, 'ProductionSecurityHardening');
      return {
        isSecure: false,
        issues: ['Failed to validate environment security']
      };
    }
  }

  initializeProductionSecurity(): void {
    if (process.env.NODE_ENV === 'production') {
      // Apply security headers
      this.applySecurityHeaders();

      // Disable right-click context menu
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        auditLogger.logSecurityEvent({
          event_type: 'context_menu_blocked',
          event_data: { timestamp: Date.now() }
        });
      });

      // Disable F12 and other dev shortcuts
      document.addEventListener('keydown', (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          auditLogger.logSecurityEvent({
            event_type: 'dev_tools_access_blocked',
            event_data: { key: e.key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey }
          });
        }
      });

      // Monitor for suspicious activities
      this.initializeThreatMonitoring();

      productionLogger.warn('Production security hardening initialized', {}, 'ProductionSecurityHardening');
    }
  }

  private initializeThreatMonitoring(): void {
    // Monitor for rapid-fire requests
    let requestCount = 0;
    const requestWindow = 60000; // 1 minute

    const resetCounter = () => {
      requestCount = 0;
    };

    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      requestCount++;
      
      if (requestCount > 100) { // More than 100 requests per minute
        auditLogger.logSecurityEvent({
          event_type: 'suspicious_request_pattern',
          event_data: {
            requestCount,
            timeWindow: requestWindow,
            url: args[0]?.toString()
          }
        });
      }

      return originalFetch.apply(window, args);
    };

    setInterval(resetCounter, requestWindow);

    // Monitor for console tampering attempts
    let consoleWarningShown = false;
    const originalLog = console.log;
    console.log = (...args) => {
      if (!consoleWarningShown && process.env.NODE_ENV === 'production') {
        console.warn('🛡️ Security Notice: Unauthorized access to browser console detected');
        consoleWarningShown = true;
        auditLogger.logSecurityEvent({
          event_type: 'console_access_detected',
          event_data: { timestamp: Date.now() }
        });
      }
      return originalLog.apply(console, args);
    };
  }
}

export const productionSecurityHardening = ProductionSecurityHardening.getInstance();
