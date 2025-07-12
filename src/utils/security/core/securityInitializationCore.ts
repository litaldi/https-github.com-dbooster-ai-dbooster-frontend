
import { productionLogger } from '@/utils/productionLogger';
import { enhancedSecurityHeaders } from '@/services/security/enhancedSecurityHeaders';
import { environmentMonitoring } from '../monitoring/environmentMonitoring';
import { cspViolationHandler } from '../monitoring/cspViolationHandler';
import { eventMonitoring } from '../monitoring/eventMonitoring';
import { securityCleanup } from '../cleanup/securityCleanup';
import type { SecurityInitializationConfig, SecurityStatus } from '../types/securityTypes';

export class SecurityInitializationCore {
  private static instance: SecurityInitializationCore;

  static getInstance(): SecurityInitializationCore {
    if (!SecurityInitializationCore.instance) {
      SecurityInitializationCore.instance = new SecurityInitializationCore();
    }
    return SecurityInitializationCore.instance;
  }

  async initializeComprehensiveSecurity(): Promise<void> {
    try {
      const config: SecurityInitializationConfig = {
        timestamp: new Date().toISOString(),
        environment: import.meta.env.MODE
      };

      productionLogger.info('Initializing comprehensive security system', config, 'SecurityInit');

      // Apply strict security headers
      enhancedSecurityHeaders.applyStrictSecurityHeaders();

      // Initialize enhanced security monitoring
      await this.initializeEnhancedMonitoring();

      // Initialize global security monitoring
      environmentMonitoring.initializeGlobalSecurityMonitoring();

      // Set up CSP violation reporting
      cspViolationHandler.setupCSPViolationReporting();

      // Initialize cleanup routines
      securityCleanup.initializeCleanupRoutines();

      // Monitor for security events
      eventMonitoring.initializeSecurityEventMonitoring();

      productionLogger.info('Comprehensive security system initialized successfully', {}, 'SecurityInit');
    } catch (error) {
      productionLogger.error('Failed to initialize security system', error, 'SecurityInit');
      throw new Error('Critical security initialization failure');
    }
  }

  private async initializeEnhancedMonitoring(): Promise<void> {
    try {
      // Dynamically import to avoid circular dependencies
      const { enhancedSecurityMonitor } = await import('@/services/security/enhancedSecurityMonitor');
      await enhancedSecurityMonitor.startMonitoring();
      productionLogger.info('Enhanced security monitoring initialized');
    } catch (error) {
      productionLogger.error('Failed to initialize enhanced monitoring', error, 'SecurityInit');
    }
  }
}

export const securityInitializationCore = SecurityInitializationCore.getInstance();
