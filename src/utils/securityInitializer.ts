
import { enhancedSecurityHeaders } from '@/services/security/enhancedSecurityHeaders';
import { enhancedThreatDetection } from '@/services/security/threatDetectionEnhanced';
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { rateLimitService } from '@/services/security/rateLimitService';
import { productionLogger } from '@/utils/productionLogger';

export class SecurityInitializer {
  private static instance: SecurityInitializer;

  static getInstance(): SecurityInitializer {
    if (!SecurityInitializer.instance) {
      SecurityInitializer.instance = new SecurityInitializer();
    }
    return SecurityInitializer.instance;
  }

  async initializeComprehensiveSecurity(): Promise<void> {
    try {
      productionLogger.info('Initializing comprehensive security system', {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE
      }, 'SecurityInit');

      // Apply strict security headers
      enhancedSecurityHeaders.applyStrictSecurityHeaders();

      // Initialize global security monitoring
      this.initializeGlobalSecurityMonitoring();

      // Set up CSP violation reporting
      this.setupCSPViolationReporting();

      // Initialize cleanup routines
      this.initializeCleanupRoutines();

      // Monitor for security events
      this.initializeSecurityEventMonitoring();

      productionLogger.info('Comprehensive security system initialized successfully', {}, 'SecurityInit');
    } catch (error) {
      productionLogger.error('Failed to initialize security system', error, 'SecurityInit');
      throw new Error('Critical security initialization failure');
    }
  }

  private initializeGlobalSecurityMonitoring(): void {
    // Override console methods in production to prevent information disclosure
    if (import.meta.env.PROD) {
      const originalConsole = { ...console };
      
      console.log = (...args) => {
        // Log security-relevant console calls
        if (args.some(arg => typeof arg === 'string' && 
            (arg.includes('security') || arg.includes('auth') || arg.includes('token')))) {
          productionLogger.warn('Security-related console.log detected', { args: args.map(String) }, 'SecurityMonitor');
        }
      };
      
      console.error = (...args) => {
        // Always log console.error calls as they might indicate security issues
        productionLogger.error('Console error detected', { args: args.map(String) }, 'SecurityMonitor');
      };
    }

    // Monitor for suspicious JavaScript execution
    const originalEval = window.eval;
    window.eval = function(code: string) {
      productionLogger.error('Eval execution blocked for security', {
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
        productionLogger.warn('Dynamic script creation detected', {
          timestamp: Date.now()
        }, 'SecurityMonitor');
        
        // Add security attributes to dynamically created scripts
        (element as HTMLScriptElement).nonce = enhancedSecurityHeaders.getNonce();
      }
      return element;
    };
  }

  private setupCSPViolationReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      productionLogger.error('CSP Violation detected', {
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        referrer: event.referrer,
        sample: event.sample,
        statusCode: event.statusCode,
        violatedDirective: event.violatedDirective
      }, 'CSPViolation');

      // Log to audit system for investigation
      enhancedThreatDetection.detectThreats(event.blockedURI || '', {
        inputType: 'csp_violation',
        userAgent: navigator.userAgent
      });
    });
  }

  private initializeCleanupRoutines(): void {
    // Clean up old threat detection events every hour
    setInterval(() => {
      enhancedThreatDetection.cleanupOldEvents(168); // Keep 7 days
    }, 60 * 60 * 1000);

    // Clean up old rate limit entries
    setInterval(async () => {
      try {
        await rateLimitService.cleanupExpiredEntries();
      } catch (error) {
        productionLogger.error('Failed to cleanup rate limit entries', error, 'SecurityCleanup');
      }
    }, 30 * 60 * 1000); // Every 30 minutes
  }

  private initializeSecurityEventMonitoring(): void {
    // Monitor for suspicious form submissions
    document.addEventListener('submit', async (event) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Check form inputs for threats
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          const result = await enhancedThreatDetection.detectThreats(value, {
            inputType: `form_${key}`,
            userAgent: navigator.userAgent
          });
          
          if (result.shouldBlock) {
            event.preventDefault();
            productionLogger.error('Form submission blocked due to security threat', {
              formAction: form.action,
              fieldName: key
            }, 'SecurityMonitor');
            
            alert('Your submission contains potentially dangerous content and has been blocked for security reasons.');
            return;
          }
        }
      }
    });

    // Monitor for suspicious link clicks
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && link.href) {
        const urlValidation = enhancedSecurityHeaders.validateSecureUrl(link.href);
        if (!urlValidation.isValid) {
          event.preventDefault();
          productionLogger.warn('Dangerous link click blocked', {
            href: link.href,
            reason: urlValidation.reason
          }, 'SecurityMonitor');
          
          alert(`This link has been blocked for security reasons: ${urlValidation.reason}`);
        }
      }
    });
  }
}

export const securityInitializer = SecurityInitializer.getInstance();
