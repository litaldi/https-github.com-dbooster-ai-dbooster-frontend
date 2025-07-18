
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
  progressivePenalty: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  reason?: string;
}

interface RateLimitViolation {
  identifier: string;
  action: string;
  attempts: number;
  firstAttempt: number;
  lastAttempt: number;
  blocked: boolean;
}

class SecureRateLimiting {
  private static instance: SecureRateLimiting;
  private localCache = new Map<string, RateLimitViolation>();
  private readonly configs: Record<string, RateLimitConfig> = {
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000, progressivePenalty: true },
    signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000, progressivePenalty: true },
    api: { maxAttempts: 100, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000, progressivePenalty: false },
    demo_session: { maxAttempts: 10, windowMs: 10 * 60 * 1000, blockDurationMs: 30 * 60 * 1000, progressivePenalty: true }
  };

  static getInstance(): SecureRateLimiting {
    if (!SecureRateLimiting.instance) {
      SecureRateLimiting.instance = new SecureRateLimiting();
    }
    return SecureRateLimiting.instance;
  }

  async checkRateLimit(identifier: string, action: string = 'api'): Promise<RateLimitResult> {
    const config = this.configs[action] || this.configs.api;
    const key = `${action}:${identifier}`;

    try {
      // Check server-side rate limit via edge function (fail secure)
      const { data, error } = await supabase.functions.invoke('rate-limit-check', {
        body: { identifier, action, config }
      });

      if (error) {
        // Fail secure: if rate limiting service is down, deny the request
        productionLogger.warn('Rate limiting service unavailable, failing secure', { 
          identifier: identifier.substring(0, 8), 
          action, 
          error 
        });
        return {
          allowed: false,
          remaining: 0,
          resetTime: Date.now() + config.windowMs,
          reason: 'Rate limiting service unavailable'
        };
      }

      // Update local cache for client-side tracking
      this.updateLocalCache(key, config, !data.allowed);

      if (!data.allowed) {
        // Log rate limit violation
        await this.logRateLimitViolation(identifier, action, data);
      }

      return {
        allowed: data.allowed,
        remaining: data.remaining || 0,
        resetTime: data.resetTime || Date.now() + config.windowMs,
        reason: data.reason
      };
    } catch (error) {
      productionLogger.error('Rate limit check failed', error, 'SecureRateLimiting');
      
      // Fail secure: deny request if we can't validate rate limits
      return {
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + config.windowMs,
        reason: 'Rate limit validation failed'
      };
    }
  }

  private updateLocalCache(key: string, config: RateLimitConfig, violation: boolean): void {
    const now = Date.now();
    const existing = this.localCache.get(key);

    if (!existing) {
      this.localCache.set(key, {
        identifier: key.split(':')[1],
        action: key.split(':')[0],
        attempts: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: violation
      });
      return;
    }

    // Reset if outside window
    if (now - existing.firstAttempt > config.windowMs) {
      this.localCache.set(key, {
        identifier: existing.identifier,
        action: existing.action,
        attempts: 1,
        firstAttempt: now,
        lastAttempt: now,
        blocked: violation
      });
      return;
    }

    // Update existing record
    existing.attempts++;
    existing.lastAttempt = now;
    existing.blocked = existing.blocked || violation;
    this.localCache.set(key, existing);
  }

  private async logRateLimitViolation(identifier: string, action: string, data: any): Promise<void> {
    try {
      await supabase.from('security_events_enhanced').insert({
        event_type: 'rate_limit_violation',
        severity: 'medium',
        event_data: {
          identifier: identifier.substring(0, 8), // Partial identifier for privacy
          action,
          attempts: data.attempts,
          blocked: true,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      productionLogger.error('Failed to log rate limit violation', error, 'SecureRateLimiting');
    }
  }

  async reportSuspiciousActivity(identifier: string, activity: string, metadata: any = {}): Promise<void> {
    try {
      productionLogger.warn('Suspicious activity detected', {
        identifier: identifier.substring(0, 8),
        activity,
        metadata
      });

      // Temporarily increase rate limiting for this identifier
      await supabase.functions.invoke('rate-limit-escalate', {
        body: {
          identifier,
          reason: activity,
          escalationFactor: 0.5, // Reduce allowed attempts by 50%
          durationMs: 60 * 60 * 1000 // 1 hour
        }
      });
    } catch (error) {
      productionLogger.error('Failed to report suspicious activity', error, 'SecureRateLimiting');
    }
  }

  getLocalStats(): { violations: number; blockedActions: string[] } {
    const violations = Array.from(this.localCache.values()).filter(v => v.blocked);
    return {
      violations: violations.length,
      blockedActions: [...new Set(violations.map(v => v.action))]
    };
  }

  clearLocalCache(): void {
    this.localCache.clear();
  }
}

export const secureRateLimiting = SecureRateLimiting.getInstance();
