import { enhancedPasswordValidator, PasswordValidationResult } from './enhancedPasswordValidation';
import { sessionSecurityService } from './sessionSecurityService';
import { realTimeSecurityMonitor } from './realTimeSecurityMonitor';
import { productionLogger } from '@/utils/productionLogger';

export interface AuthenticationResult {
  success: boolean;
  message?: string;
  user?: any;
  sessionToken?: string;
}

export class ConsolidatedAuthenticationSecurity {
  private static instance: ConsolidatedAuthenticationSecurity;

  static getInstance(): ConsolidatedAuthenticationSecurity {
    if (!ConsolidatedAuthenticationSecurity.instance) {
      ConsolidatedAuthenticationSecurity.instance = new ConsolidatedAuthenticationSecurity();
    }
    return ConsolidatedAuthenticationSecurity.instance;
  }

  async validatePasswordWithBreachCheck(password: string, userInfo?: { email?: string; name?: string }): Promise<PasswordValidationResult> {
    try {
      const result = await enhancedPasswordValidator.validatePassword(password, userInfo);
      
      if (result.breachInfo?.isBreached) {
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'security_violation',
          severity: 'high',
          message: 'User attempted to use breached password',
          metadata: {
            breachCount: result.breachInfo.breachCount,
            userEmail: userInfo?.email
          }
        });
      }

      return result;
    } catch (error) {
      productionLogger.error('Password validation with breach check failed', error, 'ConsolidatedAuthenticationSecurity');
      throw error;
    }
  }

  async createSecureDemoSession(): Promise<any> {
    try {
      const session = await sessionSecurityService.createSecureDemoSession();
      
      realTimeSecurityMonitor.logSecurityEvent({
        type: 'login_failure', // Using available type
        severity: 'low',
        message: 'Demo session created',
        metadata: {
          sessionId: session.id,
          securityScore: session.metadata.securityScore
        }
      });

      return session;
    } catch (error) {
      productionLogger.error('Demo session creation failed', error, 'ConsolidatedAuthenticationSecurity');
      throw error;
    }
  }

  async validateSessionSecurity(sessionId: string): Promise<boolean> {
    try {
      const isValid = await sessionSecurityService.validateSession(sessionId);
      const isAnomalous = await sessionSecurityService.detectAnomalousActivity(sessionId);

      if (isAnomalous) {
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          message: 'Anomalous session activity detected',
          metadata: { sessionId }
        });
        
        await sessionSecurityService.cleanupSession(sessionId);
        return false;
      }

      return isValid;
    } catch (error) {
      productionLogger.error('Session security validation failed', error, 'ConsolidatedAuthenticationSecurity');
      return false;
    }
  }
}

export const consolidatedAuthenticationSecurity = ConsolidatedAuthenticationSecurity.getInstance();
