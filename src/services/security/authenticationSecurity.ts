
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';
import { resilientRateLimitService } from './resilientRateLimitService';

interface PasswordStrengthResult {
  score: number; // 0-4
  feedback: string[];
  isValid: boolean;
}

interface AuthSecurityConfig {
  minPasswordLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  maxLoginAttempts: number;
  lockoutDurationMs: number;
}

export class AuthenticationSecurity {
  private static instance: AuthenticationSecurity;
  
  private readonly defaultConfig: AuthSecurityConfig = {
    minPasswordLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDurationMs: 15 * 60 * 1000 // 15 minutes
  };

  static getInstance(): AuthenticationSecurity {
    if (!AuthenticationSecurity.instance) {
      AuthenticationSecurity.instance = new AuthenticationSecurity();
    }
    return AuthenticationSecurity.instance;
  }

  validatePasswordStrength(password: string): PasswordStrengthResult {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= this.defaultConfig.minPasswordLength) {
      score += 1;
    } else {
      feedback.push(`Password must be at least ${this.defaultConfig.minPasswordLength} characters long`);
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else if (this.defaultConfig.requireUppercase) {
      feedback.push('Password must contain at least one uppercase letter');
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else if (this.defaultConfig.requireNumbers) {
      feedback.push('Password must contain at least one number');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else if (this.defaultConfig.requireSpecialChars) {
      feedback.push('Password must contain at least one special character');
    }

    // Additional complexity checks
    if (password.length >= 12) {
      score += 1; // Bonus for longer passwords
    }

    // Check for common weak patterns
    const weakPatterns = [
      { pattern: /(.)\1{2,}/, feedback: 'Avoid repeating characters' },
      { pattern: /123|abc|qwerty/i, feedback: 'Avoid common sequences' },
      { pattern: /password|admin|user/i, feedback: 'Avoid common words' }
    ];

    for (const { pattern, feedback: msg } of weakPatterns) {
      if (pattern.test(password)) {
        feedback.push(msg);
        score = Math.max(0, score - 1);
      }
    }

    return {
      score: Math.min(4, score),
      feedback,
      isValid: score >= 3 && feedback.length === 0
    };
  }

  async secureLogin(email: string, password: string, options: {
    rememberMe?: boolean;
    deviceFingerprint?: string;
  } = {}): Promise<{
    success: boolean;
    user?: any;
    session?: any;
    error?: string;
    requiresVerification?: boolean;
  }> {
    const identifier = `login:${email}`;
    
    try {
      // Check rate limiting
      const rateLimitResult = await resilientRateLimitService.checkRateLimit(
        identifier,
        'login',
        {
          maxAttempts: this.defaultConfig.maxLoginAttempts,
          blockDurationMs: this.defaultConfig.lockoutDurationMs
        }
      );

      if (!rateLimitResult.allowed) {
        await auditLogger.logAuthEvent('login', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          reason: 'rate_limit_exceeded',
          retryAfter: rateLimitResult.retryAfter
        });

        return {
          success: false,
          error: `Too many login attempts. Please try again in ${rateLimitResult.retryAfter} seconds.`
        };
      }

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          data: {
            deviceFingerprint: options.deviceFingerprint,
            rememberMe: options.rememberMe
          }
        }
      });

      if (error) {
        await auditLogger.logAuthEvent('login', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message,
          remainingAttempts: rateLimitResult.remainingAttempts
        });

        productionLogger.warn('Login failed', {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message
        }, 'AuthenticationSecurity');

        return {
          success: false,
          error: error.message
        };
      }

      // Successful login
      await auditLogger.logAuthEvent('login', true, {
        userId: data.user?.id,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        deviceFingerprint: options.deviceFingerprint
      });

      productionLogger.warn('Login successful', {
        userId: data.user?.id
      }, 'AuthenticationSecurity');

      return {
        success: true,
        user: data.user,
        session: data.session
      };
    } catch (error) {
      productionLogger.error('Login error', error, 'AuthenticationSecurity');
      return {
        success: false,
        error: 'An unexpected error occurred during login'
      };
    }
  }

  async secureSignup(email: string, password: string, metadata: {
    fullName?: string;
    acceptedTerms?: boolean;
  } = {}): Promise<{
    success: boolean;
    user?: any;
    session?: any;
    error?: string;
    requiresVerification?: boolean;
  }> {
    try {
      // Validate password strength
      const passwordValidation = this.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Password requirements not met: ${passwordValidation.feedback.join(', ')}`
        };
      }

      // Check rate limiting for signup
      const rateLimitResult = await resilientRateLimitService.checkRateLimit(
        `signup:${email}`,
        'signup',
        { maxAttempts: 3, windowMs: 60 * 60 * 1000 } // 3 attempts per hour
      );

      if (!rateLimitResult.allowed) {
        return {
          success: false,
          error: `Too many signup attempts. Please try again in ${rateLimitResult.retryAfter} seconds.`
        };
      }

      // Attempt signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            name: metadata.fullName,
            accepted_terms: metadata.acceptedTerms
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        await auditLogger.logAuthEvent('signup', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message
        });

        return {
          success: false,
          error: error.message
        };
      }

      // Log successful signup
      await auditLogger.logAuthEvent('signup', true, {
        userId: data.user?.id,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        requiresVerification: !data.session
      });

      return {
        success: true,
        user: data.user,
        session: data.session,
        requiresVerification: !data.session
      };
    } catch (error) {
      productionLogger.error('Signup error', error, 'AuthenticationSecurity');
      return {
        success: false,
        error: 'An unexpected error occurred during signup'
      };
    }
  }

  async checkAccountLockout(email: string): Promise<{
    isLocked: boolean;
    unlockTime?: Date;
    remainingAttempts?: number;
  }> {
    const rateLimitResult = await resilientRateLimitService.checkRateLimit(
      `login:${email}`,
      'login',
      { maxAttempts: 0 } // Just check, don't increment
    );

    return {
      isLocked: !rateLimitResult.allowed,
      unlockTime: rateLimitResult.retryAfter ? new Date(Date.now() + rateLimitResult.retryAfter * 1000) : undefined,
      remainingAttempts: rateLimitResult.remainingAttempts
    };
  }

  // Generate device fingerprint for additional security
  generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      canvas.toDataURL()
    ].join('|');

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return hash.toString(16);
  }
}

export const authenticationSecurity = AuthenticationSecurity.getInstance();
