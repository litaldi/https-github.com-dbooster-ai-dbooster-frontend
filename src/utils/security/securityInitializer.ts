
import { SecurityHeaders as ClientSecurityHeaders } from '@/middleware/securityHeaders';
import { realTimeSecurityMonitor } from '@/services/security/realTimeSecurityMonitor';
import { productionLogger } from '@/utils/productionLogger';

class SecurityInitializer {
  private static instance: SecurityInitializer;
  private initialized = false;

  static getInstance(): SecurityInitializer {
    if (!SecurityInitializer.instance) {
      SecurityInitializer.instance = new SecurityInitializer();
    }
    return SecurityInitializer.instance;
  }

  async initializeSecuritySystems(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      productionLogger.info('Initializing enhanced security systems...');

      // Apply only effective client-side security meta (Referrer-Policy)
      ClientSecurityHeaders.applyToDocument();
      // Set up security event monitoring
      this.setupSecurityEventListeners();
      
      // Initialize threat detection patterns
      await this.initializeThreatDetection();
      
      // Start security monitoring
      this.startSecurityMonitoring();
      
      this.initialized = true;
      
      productionLogger.secureInfo('Enhanced security systems initialized successfully', {
        timestamp: new Date().toISOString(),
        features: [
          'SecurityHeaders',
          'ThreatDetection', 
          'SessionSecurity',
          'SecurityMonitoring'
        ]
      });

      // Log security health check
      const healthCheck = realTimeSecurityMonitor.getSecurityHealth();
      productionLogger.info('Initial security health check', {
        score: healthCheck.score,
        status: healthCheck.status,
        issues: healthCheck.issues
      });

    } catch (error) {
      productionLogger.error('Failed to initialize security systems', error, 'SecurityInitializer');
      throw error;
    }
  }

  private setupSecurityEventListeners(): void {
    // Monitor for security violations
    window.addEventListener('securitypolicyviolation', (event) => {
      realTimeSecurityMonitor.logSecurityEvent({
        type: 'security_violation',
        severity: 'high',
        message: 'Content Security Policy violation',
        metadata: {
          blockedURI: event.blockedURI,
          documentURI: event.documentURI,
          effectiveDirective: event.effectiveDirective,
          violatedDirective: event.violatedDirective
        }
      });
    });

    // Monitor for potential XSS attempts
    window.addEventListener('error', (event) => {
      if (event.error && event.error.toString().includes('script')) {
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'security_violation',
          severity: 'medium',
          message: 'Potential script injection detected',
          metadata: {
            error: event.error.toString(),
            filename: event.filename,
            lineno: event.lineno
          }
        });
      }
    });

    // Monitor for suspicious navigation attempts
    window.addEventListener('beforeunload', () => {
      const currentScore = realTimeSecurityMonitor.getSecurityHealth().score;
      if (currentScore < 50) {
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          message: 'Page unload with low security score',
          metadata: {
            securityScore: currentScore,
            url: window.location.href
          }
        });
      }
    });
  }

  private async initializeThreatDetection(): Promise<void> {
    try {
      // Initialize enhanced threat detection
      const { enhancedThreatDetection } = await import('@/services/security/threatDetectionEnhanced');
      
      // The threat detection is already initialized when imported
      productionLogger.info('Threat detection patterns loaded');
      
    } catch (error) {
      productionLogger.error('Failed to initialize threat detection', error, 'SecurityInitializer');
    }
  }

  private startSecurityMonitoring(): void {
    // Start periodic security health checks
    setInterval(() => {
      const healthCheck = realTimeSecurityMonitor.getSecurityHealth();
      
      if (healthCheck.status === 'critical') {
        productionLogger.error('CRITICAL SECURITY ALERT', {
          score: healthCheck.score,
          issues: healthCheck.issues
        }, 'SecurityInitializer');
      } else if (healthCheck.status === 'warning') {
        productionLogger.warn('Security warning detected', {
          score: healthCheck.score,
          issues: healthCheck.issues
        }, 'SecurityInitializer');
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    productionLogger.info('Security monitoring started');
  }

  getInitializationStatus(): { initialized: boolean; timestamp?: string } {
    return {
      initialized: this.initialized,
      timestamp: this.initialized ? new Date().toISOString() : undefined
    };
  }
}

export const securityInitializer = SecurityInitializer.getInstance();

// Auto-initialize when the module is loaded
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      securityInitializer.initializeSecuritySystems();
    });
  } else {
    securityInitializer.initializeSecuritySystems();
  }
}
