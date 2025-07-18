
import { enhancedDemoSessionSecurity } from './enhancedDemoSessionSecurity';
import { secureRateLimiting } from './secureRateLimiting';
import { productionCSPHardening } from './productionCSPHardening';
import { enhancedIPValidation } from './enhancedIPValidation';
import { httpsEnforcement } from '@/utils/security/httpsEnforcement';
import { productionLogger } from '@/utils/productionLogger';

class SecurityInitializationManager {
  private static instance: SecurityInitializationManager;
  private initialized = false;

  static getInstance(): SecurityInitializationManager {
    if (!SecurityInitializationManager.instance) {
      SecurityInitializationManager.instance = new SecurityInitializationManager();
    }
    return SecurityInitializationManager.instance;
  }

  async initializeEnhancedSecurity(): Promise<void> {
    if (this.initialized) {
      productionLogger.info('Security already initialized, skipping');
      return;
    }

    try {
      productionLogger.info('Initializing enhanced security systems...');

      // 1. Enforce HTTPS first
      httpsEnforcement.enforceHTTPS();

      // 2. Apply strict CSP
      productionCSPHardening.applyStrictProductionCSP();

      // 3. Initialize IP validation
      await this.initializeIPValidation();

      // 4. Set up security monitoring
      this.setupSecurityMonitoring();

      // 5. Initialize rate limiting
      this.initializeRateLimitingMonitoring();

      // 6. Set up demo session security
      this.initializeDemoSessionSecurity();

      this.initialized = true;

      productionLogger.secureInfo('Enhanced security systems initialized successfully', {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE,
        features: [
          'httpsEnforcement',
          'strictCSP',
          'enhancedIPValidation',
          'secureRateLimiting',
          'demoSessionSecurity',
          'securityMonitoring'
        ]
      });

      // Run initial security health check
      await this.performInitialSecurityCheck();

    } catch (error) {
      productionLogger.error('Failed to initialize enhanced security systems', error, 'SecurityInitializationManager');
      throw error;
    }
  }

  private async initializeIPValidation(): Promise<void> {
    try {
      const ipResult = await enhancedIPValidation.getClientIP();
      
      if (ipResult.isValid) {
        const analysis = await enhancedIPValidation.analyzeIPSecurity(ipResult.ip);
        
        if (analysis.isHighRisk) {
          productionLogger.warn('High-risk IP detected during initialization', {
            source: ipResult.source,
            confidence: ipResult.confidence,
            riskFactors: analysis.riskFactors
          });
        }
      }
    } catch (error) {
      productionLogger.warn('IP validation initialization failed, continuing with reduced security', error);
    }
  }

  private setupSecurityMonitoring(): void {
    // Monitor for security policy violations
    document.addEventListener('securitypolicyviolation', (event) => {
      productionLogger.error('Security policy violation detected', {
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        violatedDirective: event.violatedDirective
      }, 'SecurityMonitoring');
    });

    // Monitor for suspicious JavaScript execution
    const originalEval = window.eval;
    window.eval = function(code: string) {
      productionLogger.error('Eval execution blocked for security', {
        codeLength: code?.length || 0,
        timestamp: Date.now()
      }, 'SecurityMonitoring');
      throw new Error('eval() is disabled for security reasons');
    };

    // Monitor console access in production
    if (import.meta.env.PROD) {
      const originalConsole = { ...console };
      
      console.log = (...args) => {
        // In production, filter sensitive information from console
        const filtered = args.map(arg => {
          if (typeof arg === 'string') {
            return arg.replace(/token|password|key|secret/gi, '[REDACTED]');
          }
          return arg;
        });
        originalConsole.log(...filtered);
      };
    }
  }

  private initializeRateLimitingMonitoring(): void {
    // Set up periodic rate limiting health checks
    setInterval(async () => {
      try {
        const stats = secureRateLimiting.getLocalStats();
        
        if (stats.violations > 5) {
          productionLogger.warn('High number of rate limit violations detected', {
            violations: stats.violations,
            blockedActions: stats.blockedActions
          });
        }
      } catch (error) {
        productionLogger.error('Rate limiting monitoring error', error, 'SecurityInitializationManager');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes
  }

  private initializeDemoSessionSecurity(): void {
    // Clean up any existing demo sessions on initialization
    localStorage.removeItem('demo_validation');
    
    // Set up demo session monitoring
    setInterval(() => {
      const validationData = localStorage.getItem('demo_validation');
      if (validationData) {
        try {
          const parsed = JSON.parse(validationData);
          const age = Date.now() - parsed.timestamp;
          
          // Alert if demo session data is very old (possible tampering)
          if (age > 3 * 60 * 60 * 1000) { // 3 hours
            productionLogger.warn('Stale demo session validation data detected', {
              age: Math.round(age / 1000 / 60),
              sessionId: parsed.sessionId?.substring(0, 8)
            });
          }
        } catch (error) {
          productionLogger.warn('Invalid demo session validation data format', error);
        }
      }
    }, 10 * 60 * 1000); // Check every 10 minutes
  }

  private async performInitialSecurityCheck(): Promise<void> {
    const checks = [];

    // Check HTTPS
    checks.push({
      name: 'HTTPS',
      passed: location.protocol === 'https:' || !import.meta.env.PROD,
      message: location.protocol === 'https:' ? 'Secure' : 'Development mode'
    });

    // Check CSP
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    checks.push({
      name: 'CSP',
      passed: !!cspMeta,
      message: cspMeta ? 'Active' : 'Missing'
    });

    // Check mixed content
    const mixedContentCheck = httpsEnforcement.checkMixedContentRisks();
    checks.push({
      name: 'Mixed Content',
      passed: !mixedContentCheck.hasRisks,
      message: mixedContentCheck.hasRisks ? `${mixedContentCheck.risks.length} risks` : 'Clean'
    });

    const passedChecks = checks.filter(check => check.passed).length;
    const totalChecks = checks.length;

    productionLogger.secureInfo('Initial security check completed', {
      score: `${passedChecks}/${totalChecks}`,
      checks: checks.map(check => ({
        name: check.name,
        status: check.passed ? 'PASS' : 'FAIL',
        message: check.message
      }))
    });
  }

  getInitializationStatus(): {
    initialized: boolean;
    timestamp?: string;
  } {
    return {
      initialized: this.initialized,
      timestamp: this.initialized ? new Date().toISOString() : undefined
    };
  }
}

export const securityInitializationManager = SecurityInitializationManager.getInstance();

// Auto-initialize when module is loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      securityInitializationManager.initializeEnhancedSecurity();
    });
  } else {
    securityInitializationManager.initializeEnhancedSecurity();
  }
}
