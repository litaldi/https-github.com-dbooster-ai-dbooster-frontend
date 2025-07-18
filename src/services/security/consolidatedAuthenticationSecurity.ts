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
      
      // Get client IP for threat detection
      const clientIP = await this.getClientIP();
      
      // Enhanced threat detection
      const threatCheck = await import('./threatDetectionEnhanced').then(({ enhancedThreatDetection }) =>
        enhancedThreatDetection.detectThreats(email + password, {
          inputType: 'login_credentials',
          userAgent: navigator.userAgent,
          ipAddress: clientIP
        })
      );

      if (threatCheck.blocked) {
        this.authStats.failedAttempts++;
        this.updateFailureRate();
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'security_violation',
          severity: 'critical',
          message: 'Login blocked due to security threat',
          metadata: { email, threats: threatCheck.threatTypes, ipAddress: clientIP }
        });
        
        return {
          success: false,
          error: 'Login blocked due to security policy violation'
        };
      }

      // Enhanced password validation with breach check
      const passwordValidation = await this.validatePasswordWithBreachCheck(password, { email });
      
      if (!passwordValidation.isValid) {
        this.authStats.failedAttempts++;
        this.updateFailureRate();
        
        // Record failed attempt for IP tracking
        if (clientIP) {
          const { enhancedThreatDetection } = await import('./threatDetectionEnhanced');
          enhancedThreatDetection.recordFailedAttempt(clientIP, 'weak_password');
        }
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'login_failure',
          severity: 'medium',
          message: 'Login failed: password validation failed',
          metadata: { 
            email, 
            reason: 'password_validation_failed',
            feedback: passwordValidation.feedback,
            ipAddress: clientIP
          }
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
        
        // Record failed attempt
        if (clientIP) {
          const { enhancedThreatDetection } = await import('./threatDetectionEnhanced');
          enhancedThreatDetection.recordFailedAttempt(clientIP, 'invalid_credentials');
        }
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'login_failure',
          severity: 'medium',
          message: 'Login failed: invalid credentials',
          metadata: { email, error: error.message, ipAddress: clientIP }
        });
        
        return {
          success: false,
          error: error.message
        };
      }

      // Create secure session
      if (data.user) {
        const { secureSessionManager } = await import('./secureSessionManager');
        await secureSessionManager.createSecureSession(data.user.id, false);
      }

      this.authStats.successfulAttempts++;
      this.updateFailureRate();
      
      realTimeSecurityMonitor.logSecurityEvent({
        type: 'login_failure', // Using available type for now
        severity: 'low',
        message: 'Successful login',
        metadata: { 
          email, 
          userId: data.user?.id,
          ipAddress: clientIP,
          sessionToken: data.session?.access_token?.substring(0, 10) + '...'
        }
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
      
      const clientIP = await this.getClientIP();
      
      // Enhanced threat detection for signup
      const threatCheck = await import('./threatDetectionEnhanced').then(({ enhancedThreatDetection }) =>
        enhancedThreatDetection.detectThreats(email + password + userData.fullName, {
          inputType: 'signup_data',
          userAgent: navigator.userAgent,
          ipAddress: clientIP
        })
      );

      if (threatCheck.blocked) {
        this.authStats.failedAttempts++;
        this.updateFailureRate();
        
        return {
          success: false,
          error: 'Signup blocked due to security policy violation'
        };
      }

      // Enhanced password validation with breach check
      const passwordValidation = await this.validatePasswordWithBreachCheck(password, { 
        email, 
        name: userData.fullName 
      });
      
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
          metadata: { email, error: error.message, ipAddress: clientIP }
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
        metadata: { email, userId: data.user?.id, ipAddress: clientIP }
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
      const { secureSessionManager } = await import('./secureSessionManager');
      const sessionResult = await secureSessionManager.createSecureSession('demo-user', true);
      
      // Handle the case where createSecureSession returns a string (session ID) or null
      if (typeof sessionResult === 'string') {
        // If it's just a session ID, create a simple session object
        const session = {
          id: sessionResult,
          securityScore: 75 // Default security score for demo sessions
        };
        
        this.authStats.activeDemoSessions++;
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'login_failure', // Using available type
          severity: 'low',
          message: 'Secure demo session created',
          metadata: {
            sessionId: session.id,
            securityScore: session.securityScore
          }
        });

        return session;
      } else if (sessionResult) {
        // If it's already an object, use it directly
        this.authStats.activeDemoSessions++;
        
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'login_failure', // Using available type
          severity: 'low',
          message: 'Secure demo session created',
          metadata: {
            sessionId: sessionResult.id || 'unknown',
            securityScore: sessionResult.securityScore || 75
          }
        });

        return sessionResult;
      } else {
        throw new Error('Failed to create demo session');
      }
    } catch (error) {
      productionLogger.error('Secure demo session creation failed', error, 'ConsolidatedAuthenticationSecurity');
      throw error;
    }
  }

  async validateSessionSecurity(sessionId: string): Promise<boolean> {
    try {
      const { secureSessionManager } = await import('./secureSessionManager');
      return await secureSessionManager.validateSession(sessionId);
    } catch (error) {
      productionLogger.error('Session security validation failed', error, 'ConsolidatedAuthenticationSecurity');
      return false;
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

export const consolidatedAuthenticationSecurity = ConsolidatedAuthenticationSecurity.getInstance();
