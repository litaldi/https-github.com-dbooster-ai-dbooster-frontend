
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

export class RateLimitService {
  private static instance: RateLimitService;
  private memoryCache = new Map<string, { count: number; windowStart: number; blockedUntil?: number }>();
  
  private readonly defaultConfigs: Record<string, RateLimitConfig> = {
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 15 * 60 * 1000 },
    signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
    password_reset: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
    api: { maxAttempts: 100, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
    api_call: { maxAttempts: 100, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
    form_submission: { maxAttempts: 10, windowMs: 5 * 60 * 1000, blockDurationMs: 10 * 60 * 1000 }
  };

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  async checkRateLimit(
    identifier: string,
    action: string,
    customConfig?: Partial<RateLimitConfig>
  ): Promise<RateLimitResult> {
    const config = { ...this.defaultConfigs[action] || this.defaultConfigs.api, ...customConfig };
    const key = `${identifier}:${action}`;
    const now = Date.now();

    try {
      // Try database first
      const dbResult = await this.checkDatabaseRateLimit(key, action, config, now);
      if (dbResult) {
        return dbResult;
      }
    } catch (error) {
      productionLogger.warn('Database rate limit check failed, falling back to memory', error, 'RateLimitService');
    }

    // Fallback to memory-based rate limiting
    return this.checkMemoryRateLimit(key, config, now);
  }

  private async checkDatabaseRateLimit(
    key: string,
    action: string,
    config: RateLimitConfig,
    now: number
  ): Promise<RateLimitResult | null> {
    try {
      const { data: existing, error: selectError } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', key)
        .eq('action_type', action)
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
            action_type: action,
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
      productionLogger.error('Database rate limit error', error, 'RateLimitService');
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

export const rateLimitService = RateLimitService.getInstance();

// Clean up memory cache every 30 minutes
setInterval(() => {
  rateLimitService.cleanup();
}, 30 * 60 * 1000);
