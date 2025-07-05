import { productionLogger } from '@/utils/productionLogger';
import { rateLimitService } from './rateLimitService';
import { enhancedThreatDetection } from './threatDetectionEnhanced';

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
