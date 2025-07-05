
import { productionLogger } from '@/utils/productionLogger';
import { rateLimitService } from './rateLimitService';
import { enhancedThreatDetection } from './threatDetectionEnhanced';
import { supabase } from '@/integrations/supabase/client';

interface AuthAttempt {
  timestamp: number;
  success: boolean;
  ip: string;
  userAgent: string;
  email?: string;
}

export class ConsolidatedAuthenticationSecurity {
  private static instance: ConsolidatedAuthenticationSecurity;
  private authAttempts: AuthAttempt[] = [];
  private suspiciousIPs: Set<string> = new Set();
  private maxFailedAttempts = 5;
  private lockoutDurationMs = 900000; // 15 minutes

  static getInstance(): ConsolidatedAuthenticationSecurity {
    if (!ConsolidatedAuthenticationSecurity.instance) {
      ConsolidatedAuthenticationSecurity.instance = new ConsolidatedAuthenticationSecurity();
    }
    return ConsolidatedAuthenticationSecurity.instance;
  }

  async validateAuthenticationAttempt(
    email: string,
    ip: string,
    userAgent: string
  ): Promise<{
    allowed: boolean;
    reason?: string;
    waitTime?: number;
  }> {
    try {
      // Check rate limiting first
      const rateLimitResult = await rateLimitService.checkRateLimit(ip, 'auth');
      if (!rateLimitResult.allowed) {
        return {
          allowed: false,
          reason: 'Too many authentication attempts. Please try again later.',
          waitTime: rateLimitResult.retryAfter
        };
      }

      // Check for suspicious patterns in email
      const threatResult = await enhancedThreatDetection.detectThreats(email, {
        inputType: 'email',
        userAgent,
        ip
      });

      if (threatResult.shouldBlock) {
        productionLogger.error('Malicious authentication attempt blocked', {
          email: this.sanitizeEmail(email),
          ip,
          threatTypes: threatResult.threatTypes
        }, 'AuthSecurity');

        return {
          allowed: false,
          reason: 'Invalid authentication data detected.'
        };
      }

      // Check for brute force patterns
      const recentFailures = this.getRecentFailedAttempts(ip, email);
      if (recentFailures >= this.maxFailedAttempts) {
        this.suspiciousIPs.add(ip);
        
        productionLogger.warn('Brute force attempt detected', {
          ip,
          email: this.sanitizeEmail(email),
          failureCount: recentFailures
        }, 'AuthSecurity');

        return {
          allowed: false,
          reason: 'Too many failed attempts. Account temporarily locked.',
          waitTime: this.lockoutDurationMs
        };
      }

      return { allowed: true };
    } catch (error) {
      productionLogger.error('Authentication security check failed', error, 'AuthSecurity');
      return { allowed: false, reason: 'Security check failed. Please try again.' };
    }
  }

  async validateStrongPassword(password: string, email?: string): Promise<{
    isValid: boolean;
    score: number;
    feedback: string[];
  }> {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('Password must be at least 8 characters long');

    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    // Common password checks
    const commonPasswords = ['password', '123456', 'qwerty', 'admin'];
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      feedback.push('Avoid common passwords');
      score = Math.max(0, score - 2);
    }

    // Email similarity check
    if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
      feedback.push('Password should not contain your email');
      score = Math.max(0, score - 1);
    }

    const isValid = score >= 4 && feedback.length === 0;

    return { isValid, score, feedback };
  }

  async secureLogin(email: string, password: string, options: { 
    rememberMe?: boolean;
    deviceFingerprint?: string;
  } = {}): Promise<{
    success: boolean;
    error?: string;
    requiresVerification?: boolean;
  }> {
    try {
      const userAgent = navigator.userAgent;
      const ip = 'unknown'; // Would be set by server in real implementation

      // Validate authentication attempt
      const validation = await this.validateAuthenticationAttempt(email, ip, userAgent);
      if (!validation.allowed) {
        this.logAuthenticationAttempt(false, ip, userAgent, email);
        return { success: false, error: validation.reason };
      }

      // Perform actual login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        this.logAuthenticationAttempt(false, ip, userAgent, email);
        return { success: false, error: error.message };
      }

      this.logAuthenticationAttempt(true, ip, userAgent, email);

      // Handle remember me option
      if (options.rememberMe) {
        localStorage.setItem('dbooster_remember_me', 'true');
        localStorage.setItem('dbooster_email', email);
      }

      return { 
        success: true, 
        requiresVerification: !data.session 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: errorMessage };
    }
  }

  async secureSignup(email: string, password: string, options: {
    fullName?: string;
    acceptedTerms?: boolean;
  } = {}): Promise<{
    success: boolean;
    error?: string;
    requiresVerification?: boolean;
  }> {
    try {
      if (!options.acceptedTerms) {
        return { success: false, error: 'You must accept the terms and conditions' };
      }

      // Validate password strength
      const passwordValidation = await this.validateStrongPassword(password, email);
      if (!passwordValidation.isValid) {
        return { 
          success: false, 
          error: passwordValidation.feedback.join('. ') 
        };
      }

      // Perform actual signup with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: options.fullName || '',
            name: options.fullName || '',
            accepted_terms: options.acceptedTerms,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { 
        success: true,
        requiresVerification: !data.session 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      return { success: false, error: errorMessage };
    }
  }

  generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    return btoa(JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      timestamp: Date.now()
    })).substring(0, 32);
  }

  async validateSessionSecurity(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return false;

      // Check if session is still valid
      const now = new Date();
      const sessionExpiry = new Date(session.expires_at || 0);
      
      return sessionExpiry > now;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'AuthSecurity');
      return false;
    }
  }

  logAuthenticationAttempt(
    success: boolean,
    ip: string,
    userAgent: string,
    email?: string
  ): void {
    const attempt: AuthAttempt = {
      timestamp: Date.now(),
      success,
      ip,
      userAgent,
      email: email ? this.sanitizeEmail(email) : undefined
    };

    this.authAttempts.push(attempt);

    // Keep only last 1000 attempts
    if (this.authAttempts.length > 1000) {
      this.authAttempts = this.authAttempts.slice(-1000);
    }

    // Log security event
    if (!success) {
      productionLogger.warn('Failed authentication attempt', {
        ip,
        email: email ? this.sanitizeEmail(email) : 'unknown',
        userAgent: userAgent.substring(0, 100) // Limit logged user agent
      }, 'AuthSecurity');
    } else {
      productionLogger.secureInfo('Successful authentication', {
        ip,
        email: email ? this.sanitizeEmail(email) : 'unknown'
      }, 'AuthSecurity');
    }
  }

  private getRecentFailedAttempts(ip: string, email?: string): number {
    const cutoff = Date.now() - this.lockoutDurationMs;
    
    return this.authAttempts.filter(attempt => 
      !attempt.success &&
      attempt.timestamp > cutoff &&
      (attempt.ip === ip || (email && attempt.email === this.sanitizeEmail(email)))
    ).length;
  }

  private sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return 'invalid';
    
    const [local, domain] = email.split('@');
    if (!local || !domain) return 'malformed';
    
    // Mask part of local for privacy
    const maskedLocal = local.length > 2 
      ? local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1)
      : local;
    
    return `${maskedLocal}@${domain}`;
  }

  getAuthenticationStats(): {
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    suspiciousIPs: number;
    recentFailureRate: number;
  } {
    const recentCutoff = Date.now() - (60 * 60 * 1000); // Last hour
    const recentAttempts = this.authAttempts.filter(a => a.timestamp > recentCutoff);
    
    const totalAttempts = this.authAttempts.length;
    const successfulAttempts = this.authAttempts.filter(a => a.success).length;
    const failedAttempts = totalAttempts - successfulAttempts;
    
    const recentFailures = recentAttempts.filter(a => !a.success).length;
    const recentFailureRate = recentAttempts.length > 0 
      ? (recentFailures / recentAttempts.length) * 100 
      : 0;

    return {
      totalAttempts,
      successfulAttempts,
      failedAttempts,
      suspiciousIPs: this.suspiciousIPs.size,
      recentFailureRate: Math.round(recentFailureRate * 100) / 100
    };
  }

  clearOldAttempts(maxAgeHours: number = 24): void {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    this.authAttempts = this.authAttempts.filter(attempt => attempt.timestamp > cutoff);
    
    productionLogger.secureDebug('Cleared old authentication attempts', {
      remainingAttempts: this.authAttempts.length
    }, 'AuthSecurity');
  }
}

export const consolidatedAuthenticationSecurity = ConsolidatedAuthenticationSecurity.getInstance();
