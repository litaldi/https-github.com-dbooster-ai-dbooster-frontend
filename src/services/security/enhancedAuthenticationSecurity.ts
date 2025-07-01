
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/services/auditLogger';
import { productionLogger } from '@/utils/productionLogger';

interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
  };
}

interface LoginResult {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
  user?: any;
}

interface AccountLockoutInfo {
  isLocked: boolean;
  lockedUntil?: Date;
  failedAttempts: number;
}

export class EnhancedAuthenticationSecurity {
  private static instance: EnhancedAuthenticationSecurity;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 30; // minutes

  static getInstance(): EnhancedAuthenticationSecurity {
    if (!EnhancedAuthenticationSecurity.instance) {
      EnhancedAuthenticationSecurity.instance = new EnhancedAuthenticationSecurity();
    }
    return EnhancedAuthenticationSecurity.instance;
  }

  async validateStrongPassword(password: string, email?: string): Promise<PasswordValidationResult> {
    const feedback: string[] = [];
    const requirements = {
      minLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSymbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    let score = 0;

    // Check minimum length
    if (requirements.minLength) {
      score += 20;
    } else {
      feedback.push('Password must be at least 12 characters long');
    }

    // Check character variety
    if (requirements.hasUppercase) {
      score += 15;
    } else {
      feedback.push('Password must contain uppercase letters');
    }

    if (requirements.hasLowercase) {
      score += 15;
    } else {
      feedback.push('Password must contain lowercase letters');
    }

    if (requirements.hasNumbers) {
      score += 15;
    } else {
      feedback.push('Password must contain numbers');
    }

    if (requirements.hasSymbols) {
      score += 15;
    } else {
      feedback.push('Password must contain special characters');
    }

    // Check for common patterns
    if (email && password.toLowerCase().includes(email.toLowerCase().split('@')[0])) {
      score -= 20;
      feedback.push('Password should not contain your email username');
    }

    // Check for common weak patterns
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i
    ];

    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        score -= 15;
        feedback.push('Password contains common weak patterns');
        break;
      }
    }

    // Bonus points for length
    if (password.length >= 16) {
      score += 10;
    }
    if (password.length >= 20) {
      score += 10;
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return {
      isValid: score >= 80 && Object.values(requirements).every(req => req),
      score,
      feedback,
      requirements
    };
  }

  async performSecureLogin(
    email: string,
    password: string,
    options: {
      rememberMe?: boolean;
      deviceFingerprint?: string;
    } = {}
  ): Promise<LoginResult> {
    try {
      // Check if account is locked
      const lockoutInfo = await this.checkAccountLockout(email);
      if (lockoutInfo.isLocked) {
        await auditLogger.logSecurityEvent({
          event_type: 'login_attempt_locked_account',
          event_data: {
            email,
            failedAttempts: lockoutInfo.failedAttempts,
            lockedUntil: lockoutInfo.lockedUntil
          }
        });

        return {
          success: false,
          error: `Account is locked until ${lockoutInfo.lockedUntil?.toLocaleString()}`
        };
      }

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Record failed attempt
        await this.recordFailedAttempt(email);
        
        await auditLogger.logSecurityEvent({
          event_type: 'login_failed',
          event_data: {
            email,
            error: error.message,
            deviceFingerprint: options.deviceFingerprint
          }
        });

        return {
          success: false,
          error: error.message
        };
      }

      // Clear failed attempts on successful login
      await this.clearFailedAttempts(email);

      await auditLogger.logSecurityEvent({
        event_type: 'login_successful',
        event_data: {
          email,
          userId: data.user?.id,
          deviceFingerprint: options.deviceFingerprint
        }
      });

      return {
        success: true,
        user: data.user,
        requiresVerification: !data.user?.email_confirmed_at
      };
    } catch (error) {
      productionLogger.error('Login error', error, 'EnhancedAuthenticationSecurity');
      return {
        success: false,
        error: 'Login failed due to system error'
      };
    }
  }

  async checkAccountLockout(email: string): Promise<AccountLockoutInfo> {
    try {
      // For now, use a simple in-memory approach
      // In production, this would check the account_lockouts table
      const key = `lockout_${email}`;
      const lockoutData = localStorage.getItem(key);
      
      if (lockoutData) {
        const { lockedUntil, failedAttempts } = JSON.parse(lockoutData);
        const lockoutTime = new Date(lockedUntil);
        
        if (lockoutTime > new Date()) {
          return {
            isLocked: true,
            lockedUntil: lockoutTime,
            failedAttempts
          };
        } else {
          // Lockout expired, clear it
          localStorage.removeItem(key);
        }
      }

      return {
        isLocked: false,
        failedAttempts: 0
      };
    } catch (error) {
      productionLogger.error('Error checking account lockout', error, 'EnhancedAuthenticationSecurity');
      return {
        isLocked: false,
        failedAttempts: 0
      };
    }
  }

  private async recordFailedAttempt(email: string): Promise<void> {
    try {
      const key = `failed_attempts_${email}`;
      const attemptsData = localStorage.getItem(key);
      
      let attempts = 1;
      if (attemptsData) {
        const { count, firstAttempt } = JSON.parse(attemptsData);
        const firstAttemptTime = new Date(firstAttempt);
        const now = new Date();
        
        // Reset if more than 15 minutes have passed
        if (now.getTime() - firstAttemptTime.getTime() > 15 * 60 * 1000) {
          attempts = 1;
        } else {
          attempts = count + 1;
        }
      }

      localStorage.setItem(key, JSON.stringify({
        count: attempts,
        firstAttempt: attemptsData ? JSON.parse(attemptsData).firstAttempt : new Date().toISOString()
      }));

      // Lock account if too many failed attempts
      if (attempts >= this.MAX_FAILED_ATTEMPTS) {
        const lockoutUntil = new Date();
        lockoutUntil.setMinutes(lockoutUntil.getMinutes() + this.LOCKOUT_DURATION);
        
        localStorage.setItem(`lockout_${email}`, JSON.stringify({
          lockedUntil: lockoutUntil.toISOString(),
          failedAttempts: attempts
        }));
      }
    } catch (error) {
      productionLogger.error('Error recording failed attempt', error, 'EnhancedAuthenticationSecurity');
    }
  }

  private async clearFailedAttempts(email: string): Promise<void> {
    try {
      localStorage.removeItem(`failed_attempts_${email}`);
      localStorage.removeItem(`lockout_${email}`);
    } catch (error) {
      productionLogger.error('Error clearing failed attempts', error, 'EnhancedAuthenticationSecurity');
    }
  }
}

export const enhancedAuthenticationSecurity = EnhancedAuthenticationSecurity.getInstance();
