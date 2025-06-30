
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
  retryAfter?: number;
}

export class ResilientRateLimitService {
  private static instance: ResilientRateLimitService;
  private memoryCache = new Map<string, { count: number; windowStart: number; blockedUntil?: number }>();
  private readonly defaultConfig: RateLimitConfig = {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 15 * 60 * 1000 // 15 minutes
  };

  static getInstance(): ResilientRateLimitService {
    if (!ResilientRateLimitService.instance) {
      ResilientRateLimitService.instance = new ResilientRateLimitService();
    }
    return ResilientRateLimitService.instance;
  }

  async checkRateLimit(
    identifier: string,
    action: string,
    config: Partial<RateLimitConfig> = {}
  ): Promise<RateLimitResult> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const key = `${identifier}:${action}`;
    const now = Date.now();

    try {
      // Try database first
      const dbResult = await this.checkDatabaseRateLimit(key, finalConfig, now);
      if (dbResult) {
        return dbResult;
      }
    } catch (error) {
      productionLogger.warn('Database rate limit check failed, falling back to memory', error, 'ResilientRateLimitService');
    }

    // Fallback to memory-based rate limiting
    return this.checkMemoryRateLimit(key, finalConfig, now);
  }

  private async checkDatabaseRateLimit(
    key: string,
    config: RateLimitConfig,
    now: number
  ): Promise<RateLimitResult | null> {
    try {
      // Check if currently blocked
      const { data: existing, error: selectError } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', key)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      const windowStart = now - config.windowMs;

      if (existing) {
        // Check if blocked
        if (existing.blocked_until && new Date(existing.blocked_until).getTime() > now) {
          return {
            allowed: false,
            remainingAttempts: 0,
            resetTime: new Date(existing.blocked_until).getTime(),
            retryAfter: Math.ceil((new Date(existing.blocked_until).getTime() - now) / 1000)
          };
        }

        // Check if window has reset
        const existingWindowStart = new Date(existing.window_start || 0).getTime();
        if (existingWindowStart < windowStart) {
          // Reset window
          const { error: updateError } = await supabase
            .from('rate_limit_tracking')
            .update({
              attempt_count: 1,
              window_start: new Date(now).toISOString(),
              blocked_until: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) throw updateError;

          return {
            allowed: true,
            remainingAttempts: config.maxAttempts - 1,
            resetTime: now + config.windowMs
          };
        }

        // Increment attempt count
        const newCount = (existing.attempt_count || 0) + 1;
        const shouldBlock = newCount >= config.maxAttempts;

        const { error: updateError } = await supabase
          .from('rate_limit_tracking')
          .update({
            attempt_count: newCount,
            blocked_until: shouldBlock ? new Date(now + config.blockDurationMs).toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;

        if (shouldBlock) {
          return {
            allowed: false,
            remainingAttempts: 0,
            resetTime: now + config.blockDurationMs,
            retryAfter: Math.ceil(config.blockDurationMs / 1000)
          };
        }

        return {
          allowed: true,
          remainingAttempts: config.maxAttempts - newCount,
          resetTime: existingWindowStart + config.windowMs
        };
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('rate_limit_tracking')
          .insert({
            identifier: key,
            action_type: key.split(':')[1] || 'unknown',
            attempt_count: 1,
            window_start: new Date(now).toISOString()
          });

        if (insertError) throw insertError;

        return {
          allowed: true,
          remainingAttempts: config.maxAttempts - 1,
          resetTime: now + config.windowMs
        };
      }
    } catch (error) {
      productionLogger.error('Database rate limit error', error, 'ResilientRateLimitService');
      return null;
    }
  }

  private checkMemoryRateLimit(
    key: string,
    config: RateLimitConfig,
    now: number
  ): RateLimitResult {
    const record = this.memoryCache.get(key);
    const windowStart = now - config.windowMs;

    if (!record) {
      this.memoryCache.set(key, { count: 1, windowStart: now });
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      };
    }

    // Check if blocked
    if (record.blockedUntil && record.blockedUntil > now) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: record.blockedUntil,
        retryAfter: Math.ceil((record.blockedUntil - now) / 1000)
      };
    }

    // Check if window has reset
    if (record.windowStart < windowStart) {
      this.memoryCache.set(key, { count: 1, windowStart: now });
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - 1,
        resetTime: now + config.windowMs
      };
    }

    // Increment count
    const newCount = record.count + 1;
    const shouldBlock = newCount >= config.maxAttempts;

    this.memoryCache.set(key, {
      count: newCount,
      windowStart: record.windowStart,
      blockedUntil: shouldBlock ? now + config.blockDurationMs : undefined
    });

    if (shouldBlock) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: now + config.blockDurationMs,
        retryAfter: Math.ceil(config.blockDurationMs / 1000)
      };
    }

    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - newCount,
      resetTime: record.windowStart + config.windowMs
    };
  }

  // Clean up old memory entries
  cleanup(): void {
    const now = Date.now();
    const cutoff = now - (60 * 60 * 1000); // 1 hour

    for (const [key, record] of this.memoryCache.entries()) {
      if (record.windowStart < cutoff && (!record.blockedUntil || record.blockedUntil < now)) {
        this.memoryCache.delete(key);
      }
    }
  }
}

export const resilientRateLimitService = ResilientRateLimitService.getInstance();

// Clean up memory cache every 30 minutes
setInterval(() => {
  resilientRateLimitService.cleanup();
}, 30 * 60 * 1000);
