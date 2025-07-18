
import { enhancedSecurityService } from '@/services/security/enhancedSecurityService';
import { securityMonitoringService } from '@/services/security/securityMonitoringService';
import { productionLogger } from './productionLogger';

class SecurityInitializer {
  private static instance: SecurityInitializer;
  private initialized = false;

  static getInstance(): SecurityInitializer {
    if (!SecurityInitializer.instance) {
      SecurityInitializer.instance = new SecurityInitializer();
    }
    return SecurityInitializer.instance;
  }

  async initializeComprehensiveSecurity(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      productionLogger.info('Starting comprehensive security initialization');

      // Initialize enhanced security monitoring
      await enhancedSecurityService.initializeSecurityMonitoring();

      // Perform initial security health check
      const healthCheck = await enhancedSecurityService.performSecurityHealthCheck();
      
      productionLogger.info('Initial security health check completed', {
        score: healthCheck.score,
        status: healthCheck.status,
        issueCount: healthCheck.issues.length
      });

      // Check if admin bootstrap is needed
      const bootstrapNeeded = await securityMonitoringService.checkAdminBootstrapNeeded();
      if (bootstrapNeeded) {
        productionLogger.warn('Admin bootstrap process is required', {
          message: 'No admin users found in the system'
        });
      }

      // Set up security event monitoring
      this.setupSecurityEventMonitoring();

      this.initialized = true;
      
      productionLogger.info('Comprehensive security initialization completed successfully', {
        healthScore: healthCheck.score,
        bootstrapNeeded
      });

    } catch (error) {
      productionLogger.error('Failed to initialize comprehensive security', error, 'SecurityInitializer');
      throw error;
    }
  }

  private setupSecurityEventMonitoring(): void {
    // Monitor for authentication events
    window.addEventListener('beforeunload', () => {
      // Log session end for security tracking
      productionLogger.info('Session ending - security event logged');
    });

    // Monitor for potential security violations
    window.addEventListener('securitypolicyviolation', (event) => {
      productionLogger.error('Content Security Policy violation detected', {
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        violatedDirective: event.violatedDirective
      }, 'CSPViolation');
    });

    // Monitor for suspicious console activity
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Check for potential security-related errors
      const errorString = args.join(' ').toLowerCase();
      if (errorString.includes('blocked') || 
          errorString.includes('cors') || 
          errorString.includes('csp') ||
          errorString.includes('security')) {
        productionLogger.warn('Potential security-related console error', {
          error: errorString.substring(0, 200) // Limit length for security
        }, 'SecurityConsoleMonitor');
      }
      originalConsoleError.apply(console, args);
    };
  }

  getInitializationStatus(): {
    initialized: boolean;
    timestamp?: string;
    securityFeatures: string[];
  } {
    return {
      initialized: this.initialized,
      timestamp: this.initialized ? new Date().toISOString() : undefined,
      securityFeatures: [
        'Enhanced Role Management',
        'Privilege Escalation Detection',
        'Security Health Monitoring',
        'Real-time Threat Detection',
        'Admin Bootstrap Protection',
        'Comprehensive Audit Logging'
      ]
    };
  }
}

export const securityInitializer = SecurityInitializer.getInstance();

// Auto-initialize when module is loaded in production
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  securityInitializer.initializeComprehensiveSecurity().catch(error => {
    console.error('Failed to auto-initialize security:', error);
  });
}
