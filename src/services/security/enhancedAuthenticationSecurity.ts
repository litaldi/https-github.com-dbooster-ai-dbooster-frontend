
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';
import { rateLimitService } from './rateLimitService';

interface SessionInfo {
  sessionToken: string;
  expiresAt: Date;
  userId: string;
}

interface AccountLockoutInfo {
  isLocked: boolean;
  lockedUntil?: Date;
  failedAttempts: number;
}

export class EnhancedAuthenticationSecurity {
  private static instance: EnhancedAuthenticationSecurity;
  
  private readonly SESSION_TIMEOUT_HOURS = 24;
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION_MINUTES = 30;
  
  private readonly PASSWORD_REQUIREMENTS = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventReuse: true
  };

  static getInstance(): EnhancedAuthenticationSecurity {
    if (!EnhancedAuthenticationSecurity.instance) {
      EnhancedAuthenticationSecurity.instance = new EnhancedAuthenticationSecurity();
    }
    return EnhancedAuthenticationSecurity.instance;
  }

  async validateStrongPassword(password: string, email?: string): Promise<{
    isValid: boolean;
    score: number;
    feedback: string[];
    requirements: Record<string, boolean>;
  }> {
    const feedback: string[] = [];
    const requirements = {
      length: password.length >= this.PASSWORD_REQUIREMENTS.minLength,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /[0-9]/.test(password),
      specialChars: /[^A-Za-z0-9]/.test(password),
      notCommon: true,
      notPersonal: true
    };

    let score = 0;

    // Length check
    if (!requirements.length) {
      feedback.push(`Password must be at least ${this.PASSWORD_REQUIREMENTS.minLength} characters long`);
    } else {
      score += 2;
    }

    // Character type checks
    if (!requirements.uppercase) {
      feedback.push('Password must contain at least one uppercase letter');
    } else {
      score += 1;
    }

    if (!requirements.lowercase) {
      feedback.push('Password must contain at least one lowercase letter');
    } else {
      score += 1;
    }

    if (!requirements.numbers) {
      feedback.push('Password must contain at least one number');
    } else {
      score += 1;
    }

    if (!requirements.specialChars) {
      feedback.push('Password must contain at least one special character');
    } else {
      score += 1;
    }

    // Check for common weak patterns
    const commonPatterns = [
      { pattern: /(.)\1{2,}/, feedback: 'Avoid repeating characters' },
      { pattern: /123|abc|qwerty|password/i, feedback: 'Avoid common sequences and words' },
      { pattern: /^[a-zA-Z]+$/, feedback: 'Use a mix of letters, numbers, and symbols' }
    ];

    for (const { pattern, feedback: msg } of commonPatterns) {
      if (pattern.test(password)) {
        feedback.push(msg);
        requirements.notCommon = false;
        score = Math.max(0, score - 1);
      }
    }

    // Check against email if provided
    if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
      feedback.push('Password should not contain your email address');
      requirements.notPersonal = false;
      score = Math.max(0, score - 1);
    }

    // Bonus points for length
    if (password.length >= 16) {
      score += 1;
    }

    const isValid = Object.values(requirements).every(req => req) && feedback.length === 0;

    return {
      isValid,
      score: Math.min(5, score),
      feedback,
      requirements
    };
  }

  async checkAccountLockout(email: string): Promise<AccountLockoutInfo> {
    try {
      const { data: lockout } = await supabase
        .from('account_lockouts')
        .select('*')
        .eq('user_id', email) // Using email as identifier since we don't have user_id yet
        .gt('locked_until', new Date().toISOString())
        .single();

      if (lockout) {
        return {
          isLocked: true,
          lockedUntil: new Date(lockout.locked_until),
          failedAttempts: lockout.failed_attempts
        };
      }

      return {
        isLocked: false,
        failedAttempts: 0
      };
    } catch (error) {
      productionLogger.error('Failed to check account lockout', error, 'EnhancedAuthenticationSecurity');
      return {
        isLocked: false,
        failedAttempts: 0
      };
    }
  }

  async recordFailedAttempt(email: string, ipAddress?: string): Promise<void> {
    try {
      // Get current failed attempts
      const { data: existing } = await supabase
        .from('account_lockouts')
        .select('*')
        .eq('user_id', email)
        .single();

      const failedAttempts = (existing?.failed_attempts || 0) + 1;
      const shouldLock = failedAttempts >= this.MAX_FAILED_ATTEMPTS;

      if (existing) {
        await supabase
          .from('account_lockouts')
          .update({
            failed_attempts: failedAttempts,
            locked_until: shouldLock ? 
              new Date(Date.now() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000).toISOString() : 
              null,
            last_attempt: new Date().toISOString(),
            ip_address: ipAddress
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('account_lockouts')
          .insert({
            user_id: email,
            failed_attempts: failedAttempts,
            locked_until: shouldLock ? 
              new Date(Date.now() + this.LOCKOUT_DURATION_MINUTES * 60 * 1000).toISOString() : 
              null,
            ip_address: ipAddress
          });
      }

      if (shouldLock) {
        await this.createSecurityNotification(email, {
          type: 'account_locked',
          severity: 'high',
          message: `Account locked due to ${this.MAX_FAILED_ATTEMPTS} failed login attempts`,
          metadata: { failedAttempts, ipAddress }
        });
      }
    } catch (error) {
      productionLogger.error('Failed to record failed attempt', error, 'EnhancedAuthenticationSecurity');
    }
  }

  async clearFailedAttempts(email: string): Promise<void> {
    try {
      await supabase
        .from('account_lockouts')
        .delete()
        .eq('user_id', email);
    } catch (error) {
      productionLogger.error('Failed to clear failed attempts', error, 'EnhancedAuthenticationSecurity');
    }
  }

  async createUserSession(userId: string, sessionToken: string): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + this.SESSION_TIMEOUT_HOURS * 60 * 60 * 1000);
      
      await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent
        });
    } catch (error) {
      productionLogger.error('Failed to create user session', error, 'EnhancedAuthenticationSecurity');
    }
  }

  async validateSession(sessionToken: string): Promise<{ valid: boolean; userId?: string }> {
    try {
      const { data: session } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_token', sessionToken)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (session) {
        // Update last activity
        await supabase
          .from('user_sessions')
          .update({ last_activity: new Date().toISOString() })
          .eq('id', session.id);

        return { valid: true, userId: session.user_id };
      }

      return { valid: false };
    } catch (error) {
      productionLogger.error('Failed to validate session', error, 'EnhancedAuthenticationSecurity');
      return { valid: false };
    }
  }

  async cleanupExpiredSessions(): Promise<void> {
    try {
      await supabase.rpc('cleanup_expired_sessions');
    } catch (error) {
      productionLogger.error('Failed to cleanup expired sessions', error, 'EnhancedAuthenticationSecurity');
    }
  }

  async createSecurityNotification(userId: string, notification: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await supabase
        .from('security_notifications')
        .insert({
          user_id: userId,
          event_type: notification.type,
          severity: notification.severity,
          message: notification.message,
          metadata: notification.metadata
        });
    } catch (error) {
      productionLogger.error('Failed to create security notification', error, 'EnhancedAuthenticationSecurity');
    }
  }

  private async getClientIP(): Promise<string | null> {
    try {
      // In production, this would be handled by server-side middleware
      return null;
    } catch (error) {
      return null;
    }
  }

  async performSecureLogin(email: string, password: string, options: {
    rememberMe?: boolean;
    deviceFingerprint?: string;
  } = {}): Promise<{
    success: boolean;
    user?: any;
    session?: any;
    error?: string;
    requiresVerification?: boolean;
  }> {
    try {
      // Check account lockout
      const lockoutInfo = await this.checkAccountLockout(email);
      if (lockoutInfo.isLocked) {
        return {
          success: false,
          error: `Account is locked until ${lockoutInfo.lockedUntil?.toLocaleString()}. Please try again later.`
        };
      }

      // Check rate limiting
      const rateLimitResult = await rateLimitService.checkRateLimit(`login:${email}`, 'login');
      if (!rateLimitResult.allowed) {
        return {
          success: false,
          error: `Too many login attempts. Please try again in ${rateLimitResult.retryAfter} seconds.`
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
        
        await auditLogger.logAuthEvent('login', false, {
          email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
          error: error.message,
          deviceFingerprint: options.deviceFingerprint
        });

        return {
          success: false,
          error: error.message
        };
      }

      // Clear failed attempts on successful login
      await this.clearFailedAttempts(email);

      // Create session tracking
      if (data.session) {
        await this.createUserSession(data.user.id, data.session.access_token);
      }

      await auditLogger.logAuthEvent('login', true, {
        userId: data.user.id,
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        deviceFingerprint: options.deviceFingerprint
      });

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      productionLogger.error('Secure login error', error, 'EnhancedAuthenticationSecurity');
      return {
        success: false,
        error: 'An unexpected error occurred during login'
      };
    }
  }
}

export const enhancedAuthenticationSecurity = EnhancedAuthenticationSecurity.getInstance();
