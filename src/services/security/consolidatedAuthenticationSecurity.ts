
import { enhancedPasswordValidator, PasswordValidationResult } from './enhancedPasswordValidation';
import { sessionSecurityService } from './sessionSecurityService';
import { realTimeSecurityMonitor } from './realTimeSecurityMonitor';
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

export interface AuthenticationResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: any;
  sessionToken?: string;
}

interface AuthenticationStats {
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  recentFailureRate: number;
  suspiciousIPs: number;
  activeDemoSessions: number;
}

export class ConsolidatedAuthenticationSecurity {
  private static instance: ConsolidatedAuthenticationSecurity;
  private authStats: AuthenticationStats = {
    totalAttempts: 0,
    successfulAttempts: 0,
    failedAttempts: 0,
    recentFailureRate: 0,
    suspiciousIPs: 0,
    activeDemoSessions: 0
  };

  static getInstance(): ConsolidatedAuthenticationSecurity {
    if (!ConsolidatedAuthenticationSecurity.instance) {
      ConsolidatedAuthenticationSecurity.instance = new ConsolidatedAuthenticationSecurity();
    }
    return ConsolidatedAuthenticationSecurity.instance;
  }

  async secureLogin(email: string, password: string, options?: { rememberMe?: boolean }): Promise<AuthenticationResult> {
    try {
      this.authStats.totalAttempts++;
      
      // Validate password strength
      const passwordValidation = await this.validatePasswordWithBreachCheck(password, { email });
      
      if (!passwordValidation.isValid) {
        this.authStats.failedAttempts++;
        this.updateFailureRate();
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'login_failure',
          severity: 'medium',
          message: 'Login failed: weak or breached password',
          metadata: { email, reason: 'password_validation_failed' }
        });
        
        return {
          success: false,
          error: 'Password does not meet security requirements'
        };
      }

      // Attempt Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        this.authStats.failedAttempts++;
        this.updateFailureRate();
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'login_failure',
          severity: 'medium',
          message: 'Login failed: invalid credentials',
          metadata: { email, error: error.message }
        });
        
        return {
          success: false,
          error: error.message
        };
      }

      this.authStats.successfulAttempts++;
      this.updateFailureRate();
      
      realTimeSecurityMonitor.logSecurityEvent({
        type: 'login_failure', // Using available type
        severity: 'low',
        message: 'Successful login',
        metadata: { email, userId: data.user?.id }
      });

      return {
        success: true,
        user: data.user,
        sessionToken: data.session?.access_token
      };
    } catch (error) {
      this.authStats.failedAttempts++;
      this.updateFailureRate();
      
      productionLogger.error('Secure login failed', error, 'ConsolidatedAuthenticationSecurity');
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  async secureSignup(email: string, password: string, userData: { fullName: string; acceptedTerms: boolean }): Promise<AuthenticationResult> {
    try {
      this.authStats.totalAttempts++;
      
      // Validate password strength with breach check
      const passwordValidation = await this.validatePasswordWithBreachCheck(password, { email, name: userData.fullName });
      
      if (!passwordValidation.isValid) {
        this.authStats.failedAttempts++;
        this.updateFailureRate();
        
        return {
          success: false,
          error: `Password validation failed: ${passwordValidation.feedback.join(', ')}`
        };
      }

      // Check terms acceptance
      if (!userData.acceptedTerms) {
        return {
          success: false,
          error: 'You must accept the terms and conditions'
        };
      }

      // Attempt Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.fullName
          }
        }
      });

      if (error) {
        this.authStats.failedAttempts++;
        this.updateFailureRate();
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'login_failure',
          severity: 'medium',
          message: 'Signup failed',
          metadata: { email, error: error.message }
        });
        
        return {
          success: false,
          error: error.message
        };
      }

      this.authStats.successfulAttempts++;
      this.updateFailureRate();
      
      realTimeSecurityMonitor.logSecurityEvent({
        type: 'login_failure', // Using available type  
        severity: 'low',
        message: 'Successful signup',
        metadata: { email, userId: data.user?.id }
      });

      return {
        success: true,
        user: data.user,
        message: 'Account created successfully. Please check your email to verify your account.'
      };
    } catch (error) {
      this.authStats.failedAttempts++;
      this.updateFailureRate();
      
      productionLogger.error('Secure signup failed', error, 'ConsolidatedAuthenticationSecurity');
      return {
        success: false,
        error: 'Signup failed'
      };
    }
  }

  getAuthenticationStats(): AuthenticationStats {
    return { ...this.authStats };
  }

  private updateFailureRate(): void {
    if (this.authStats.totalAttempts > 0) {
      this.authStats.recentFailureRate = (this.authStats.failedAttempts / this.authStats.totalAttempts) * 100;
    }
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
      this.authStats.activeDemoSessions++;
      
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
