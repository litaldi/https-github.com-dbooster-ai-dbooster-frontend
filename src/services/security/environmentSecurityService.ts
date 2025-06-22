
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '../auditLogger';

interface SecurityEnvironmentCheck {
  isSecure: boolean;
  issues: string[];
  warnings: string[];
  score: number;
}

export class EnvironmentSecurityService {
  private static instance: EnvironmentSecurityService;

  static getInstance(): EnvironmentSecurityService {
    if (!EnvironmentSecurityService.instance) {
      EnvironmentSecurityService.instance = new EnvironmentSecurityService();
    }
    return EnvironmentSecurityService.instance;
  }

  async validateEnvironment(): Promise<SecurityEnvironmentCheck> {
    const issues: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    try {
      // Check HTTPS enforcement
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        issues.push('Application not served over HTTPS in production');
        score -= 20;
      }

      // Check for development tools in production
      if (process.env.NODE_ENV === 'production') {
        if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          warnings.push('React DevTools detected in production environment');
          score -= 5;
        }

        if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
          warnings.push('Redux DevTools detected in production environment');
          score -= 5;
        }
      }

      // Validate critical environment variables
      const supabaseUrl = 'https://sxcbpmqsbcpsljwwwwyv.supabase.co';
      if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
        issues.push('Supabase URL is not configured or not using HTTPS');
        score -= 25;
      }

      // Check Content Security Policy
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!cspMeta) {
        warnings.push('Content Security Policy not detected');
        score -= 10;
      }

      // Check for console security
      if (typeof console.clear === 'undefined') {
        warnings.push('Console has been tampered with');
        score -= 5;
      }

      // Check for suspicious global variables
      const suspiciousGlobals = ['eval', 'Function'];
      for (const globalVar of suspiciousGlobals) {
        if (typeof (window as any)[globalVar] !== 'function') {
          warnings.push(`Global ${globalVar} has been modified`);
          score -= 5;
        }
      }

      // Check local storage security
      try {
        localStorage.setItem('security_test', 'test');
        localStorage.removeItem('security_test');
      } catch {
        warnings.push('Local storage access restricted or unavailable');
        score -= 5;
      }

      // Log security validation results
      if (issues.length > 0 || warnings.length > 0) {
        await auditLogger.logSecurityEvent({
          event_type: 'environment_security_validation',
          event_data: {
            issues,
            warnings,
            score,
            userAgent: navigator.userAgent,
            timestamp: Date.now()
          }
        });
      }

      productionLogger.secureInfo('Environment security validation completed', {
        score,
        issueCount: issues.length,
        warningCount: warnings.length
      }, 'EnvironmentSecurityService');

      return {
        isSecure: issues.length === 0,
        issues,
        warnings,
        score: Math.max(0, score)
      };
    } catch (error) {
      productionLogger.error('Environment security validation failed', error, 'EnvironmentSecurityService');
      return {
        isSecure: false,
        issues: ['Failed to validate environment security'],
        warnings: [],
        score: 0
      };
    }
  }

  async validateSessionSecurity(): Promise<boolean> {
    try {
      // Check if running in secure context
      if (typeof window.isSecureContext !== 'undefined' && !window.isSecureContext) {
        await auditLogger.logSecurityEvent({
          event_type: 'insecure_context_detected',
          event_data: {
            protocol: window.location.protocol,
            hostname: window.location.hostname
          }
        });
        return false;
      }

      // Check for session fixation attempts
      const sessionStorage = window.sessionStorage;
      const localStorage = window.localStorage;

      // Look for suspicious session data
      const suspiciousKeys = ['admin', 'root', 'debug', 'test'];
      for (const key of suspiciousKeys) {
        if (sessionStorage.getItem(key) || localStorage.getItem(key)) {
          await auditLogger.logSecurityEvent({
            event_type: 'suspicious_session_data',
            event_data: { suspiciousKey: key }
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      productionLogger.error('Session security validation failed', error, 'EnvironmentSecurityService');
      return false;
    }
  }

  initializeSecurityHeaders(): void {
    if (typeof document !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Enhanced Content Security Policy
      const csp = [
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
        "form-action 'self'",
        "upgrade-insecure-requests",
        "block-all-mixed-content"
      ].join('; ');

      // Apply CSP if not already present
      if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
        const cspMeta = document.createElement('meta');
        cspMeta.httpEquiv = 'Content-Security-Policy';
        cspMeta.content = csp;
        document.head.appendChild(cspMeta);
      }

      // Additional security headers via meta tags
      const securityHeaders = [
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
        { name: 'format-detection', content: 'telephone=no' }
      ];

      for (const header of securityHeaders) {
        if (!document.querySelector(`meta[name="${header.name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = header.name;
          meta.content = header.content;
          document.head.appendChild(meta);
        }
      }

      productionLogger.warn('Enhanced security headers initialized', {}, 'EnvironmentSecurityService');
    }
  }
}

export const environmentSecurityService = EnvironmentSecurityService.getInstance();
