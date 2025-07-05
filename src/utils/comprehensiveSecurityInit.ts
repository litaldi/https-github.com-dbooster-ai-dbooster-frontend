import { enhancedProductionLogger } from './enhancedProductionLogger';
import { enhancedSecurityConfig } from '@/services/security/enhancedSecurityConfig';
import { enhancedInputValidation } from '@/services/security/enhancedInputValidation';
import { rateLimitService } from '@/services/security/rateLimitService';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';

export class ComprehensiveSecurityInitializer {
  private static instance: ComprehensiveSecurityInitializer;

  static getInstance(): ComprehensiveSecurityInitializer {
    if (!ComprehensiveSecurityInitializer.instance) {
      ComprehensiveSecurityInitializer.instance = new ComprehensiveSecurityInitializer();
    }
    return ComprehensiveSecurityInitializer.instance;
  }

  async initialize(): Promise<void> {
    try {
      enhancedProductionLogger.info('Initializing comprehensive security system', {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE
      }, 'ComprehensiveSecurityInit');

      // Phase 1: Apply security headers and HTTPS enforcement
      enhancedSecurityConfig.applySecurityHeaders();
      enhancedSecurityConfig.enforceHTTPS();

      // Phase 2: Initialize production console cleanup
      this.initializeProductionConsoleCleanup();

      // Phase 3: Set up global security monitoring
      this.initializeGlobalSecurityMonitoring();

      // Phase 4: Initialize form validation interceptors
      this.initializeFormValidationInterceptors();

      // Phase 5: Set up security event monitoring
      this.initializeSecurityEventMonitoring();

      // Phase 6: Initialize cleanup routines
      this.initializeCleanupRoutines();

      enhancedProductionLogger.info('Comprehensive security system initialized successfully', {}, 'ComprehensiveSecurityInit');
    } catch (error) {
      enhancedProductionLogger.error('Failed to initialize comprehensive security system', error, 'ComprehensiveSecurityInit');
      throw new Error('Critical security initialization failure');
    }
  }

  private initializeProductionConsoleCleanup(): void {
    if (import.meta.env.PROD) {
      // Override console methods in production
      const noOp = () => {};
      
      console.log = noOp;
      console.info = noOp;
      console.debug = noOp;
      console.trace = noOp;
      console.table = noOp;
      console.group = noOp;
      console.groupEnd = noOp;
      console.groupCollapsed = noOp;
      console.time = noOp;
      console.timeEnd = noOp;
      console.count = noOp;
      console.countReset = noOp;
      console.clear = noOp;

      // Keep error and warn but sanitize them
      const originalError = console.error;
      const originalWarn = console.warn;

      console.error = (...args: any[]) => {
        if (args[0] && typeof args[0] === 'string' && (
          args[0].includes('critical') || 
          args[0].includes('security') ||
          args[0].includes('auth')
        )) {
          enhancedProductionLogger.error('Console error intercepted', { message: 'Critical error detected' }, 'ConsoleCleanup');
        }
      };

      console.warn = (...args: any[]) => {
        if (args[0] && typeof args[0] === 'string' && (
          args[0].includes('security') ||
          args[0].includes('auth') ||
          args[0].includes('warning')
        )) {
          enhancedProductionLogger.warn('Console warning intercepted', { message: 'Security warning detected' }, 'ConsoleCleanup');
        }
      };

      enhancedProductionLogger.secureInfo('Production console cleanup initialized', {}, 'ComprehensiveSecurityInit');
    }
  }

  private initializeGlobalSecurityMonitoring(): void {
    // Monitor for suspicious JavaScript execution
    const originalEval = window.eval;
    window.eval = function(code: string) {
      enhancedProductionLogger.error('Eval execution blocked for security', {
        codeLength: code?.length || 0,
        codePreview: code?.substring(0, 50) || ''
      }, 'SecurityMonitor');
      throw new Error('eval() is disabled for security reasons');
    };

    // Monitor dynamic script creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string) {
      const element = originalCreateElement.call(document, tagName);
      if (tagName.toLowerCase() === 'script') {
        enhancedProductionLogger.warn('Dynamic script creation detected', {
          timestamp: Date.now()
        }, 'SecurityMonitor');
        
        // Add security attributes to dynamically created scripts
        (element as HTMLScriptElement).nonce = enhancedSecurityConfig.getNonce();
      }
      return element;
    };

    // Monitor for suspicious network requests
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      // Log external requests for monitoring
      if (!url.includes(window.location.hostname) && !url.includes('supabase.co')) {
        enhancedProductionLogger.warn('External request detected', { url }, 'SecurityMonitor');
      }

      return originalFetch.call(window, input, init);
    };
  }

  private initializeFormValidationInterceptors(): void {
    // Intercept form submissions for validation
    document.addEventListener('submit', async (event) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      
      let hasSecurityIssues = false;
      
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          const validation = enhancedInputValidation.validateAndSanitize(value, key);
          
          if (validation.riskLevel === 'critical' || validation.riskLevel === 'high') {
            hasSecurityIssues = true;
            enhancedProductionLogger.error('Form submission blocked due to security threat', {
              formAction: form.action,
              fieldName: key,
              riskLevel: validation.riskLevel,
              threats: validation.metadata.detectedThreats
            }, 'SecurityMonitor');
          }
        }
      }
      
      if (hasSecurityIssues) {
        event.preventDefault();
        alert('Your submission contains potentially dangerous content and has been blocked for security reasons.');
      }
    });

    // Intercept input events for real-time validation
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target.value && target.value.length > 100) { // Only validate longer inputs
        const validation = enhancedInputValidation.validateAndSanitize(target.value, target.type || 'general');
        
        if (validation.riskLevel === 'critical') {
          enhancedProductionLogger.warn('Suspicious input detected', {
            fieldType: target.type,
            fieldName: target.name,
            riskLevel: validation.riskLevel
          }, 'SecurityMonitor');
        }
      }
    });
  }

  private initializeSecurityEventMonitoring(): void {
    // Monitor for suspicious link clicks
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href) {
        try {
          const url = new URL(link.href);
          
          // Block suspicious domains
          const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'short.link', 't.co'];
          if (suspiciousDomains.some(domain => url.hostname.includes(domain))) {
            event.preventDefault();
            enhancedProductionLogger.warn('Suspicious link click blocked', {
              href: link.href,
              reason: 'Potentially unsafe shortened URL'
            }, 'SecurityMonitor');
            
            alert('This link has been blocked for security reasons: Potentially unsafe shortened URL');
          }

          // Log external links
          if (!url.hostname.includes(window.location.hostname)) {
            enhancedProductionLogger.info('External link clicked', { href: url.hostname }, 'SecurityMonitor');
          }
        } catch (error) {
          enhancedProductionLogger.warn('Invalid URL in link', { href: link.href }, 'SecurityMonitor');
        }
      }
    });

    // Monitor page visibility changes
    document.addEventListener('visibilitychange', () => {
      const state = document.hidden ? 'hidden' : 'visible';
      enhancedProductionLogger.secureDebug('Page visibility changed', { state }, 'SecurityMonitor');
    });

    // Monitor focus changes
    window.addEventListener('focus', () => {
      enhancedProductionLogger.secureDebug('Window gained focus', {}, 'SecurityMonitor');
    });

    window.addEventListener('blur', () => {
      enhancedProductionLogger.secureDebug('Window lost focus', {}, 'SecurityMonitor');
    });
  }

  private initializeCleanupRoutines(): void {
    // Clean up expired rate limit entries every 30 minutes
    setInterval(async () => {
      try {
        await rateLimitService.cleanupExpiredEntries();
        enhancedProductionLogger.secureDebug('Rate limit cleanup completed', {}, 'SecurityCleanup');
      } catch (error) {
        enhancedProductionLogger.error('Failed to cleanup rate limit entries', error, 'SecurityCleanup');
      }
    }, 30 * 60 * 1000);

    // Clean up old logs every hour
    setInterval(() => {
      try {
        const logs = enhancedProductionLogger.getLogs();
        if (logs.length > 500) {
          enhancedProductionLogger.clearLogs();
          enhancedProductionLogger.secureInfo('Log cleanup completed', { clearedCount: logs.length }, 'SecurityCleanup');
        }
      } catch (error) {
        enhancedProductionLogger.error('Failed to cleanup logs', error, 'SecurityCleanup');
      }
    }, 60 * 60 * 1000);
  }

  async runSecurityHealthCheck(): Promise<{
    score: number;
    issues: Array<{ severity: 'low' | 'medium' | 'high' | 'critical'; message: string }>;
    recommendations: string[];
  }> {
    const issues: Array<{ severity: 'low' | 'medium' | 'high' | 'critical'; message: string }> = [];
    const recommendations: string[] = [];
    let score = 100;

    try {
      // Check HTTPS
      if (import.meta.env.PROD && window.location.protocol !== 'https:') {
        issues.push({ severity: 'high', message: 'Application not running over HTTPS in production' });
        recommendations.push('Enable HTTPS for all production traffic');
        score -= 20;
      }

      // Check CSP
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (!cspMeta) {
        issues.push({ severity: 'medium', message: 'Content Security Policy not implemented' });
        recommendations.push('Implement Content Security Policy headers');
        score -= 10;
      }

      // Check security headers
      const securityHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection'];
      securityHeaders.forEach(header => {
        const meta = document.querySelector(`meta[http-equiv="${header}"]`);
        if (!meta) {
          issues.push({ severity: 'medium', message: `Missing security header: ${header}` });
          score -= 5;
        }
      });

      // Check for dev tools in production
      if (import.meta.env.PROD && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        issues.push({ severity: 'low', message: 'Development tools detected in production' });
        recommendations.push('Disable development tools in production builds');
        score -= 5;
      }

      enhancedProductionLogger.secureInfo('Security health check completed', { 
        score, 
        issueCount: issues.length 
      }, 'SecurityHealthCheck');

      return { score, issues, recommendations };
    } catch (error) {
      enhancedProductionLogger.error('Security health check failed', error, 'SecurityHealthCheck');
      return { 
        score: 0, 
        issues: [{ severity: 'critical', message: 'Security health check failed' }], 
        recommendations: ['Review security configuration'] 
      };
    }
  }
}

export const comprehensiveSecurityInit = ComprehensiveSecurityInitializer.getInstance();
