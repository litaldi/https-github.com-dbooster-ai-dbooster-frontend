
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from './auditLogger';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  password_reset: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  api_call: { maxAttempts: 100, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 },
};

export class RateLimitService {
  private static instance: RateLimitService;

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      const config = RATE_LIMIT_CONFIGS[actionType] || RATE_LIMIT_CONFIGS.api_call;
      const now = new Date();
      const windowStart = new Date(now.getTime() - config.windowMs);

      // Get current rate limit record
      const { data: rateLimitRecord } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', actionType)
        .maybeSingle();

      // Check if currently blocked
      if (rateLimitRecord?.blocked_until && new Date(rateLimitRecord.blocked_until) > now) {
        const retryAfter = Math.ceil((new Date(rateLimitRecord.blocked_until).getTime() - now.getTime()) / 1000);
        await auditLogger.logSecurityEvent({
          event_type: 'rate_limit_blocked',
          event_data: { identifier, actionType, retryAfter }
        });
        return { allowed: false, retryAfter };
      }

      // Check if we need to reset the window
      const needsReset = !rateLimitRecord || 
        !rateLimitRecord.window_start || 
        new Date(rateLimitRecord.window_start) < windowStart;

      if (needsReset) {
        // Reset or create new record
        await supabase.from('rate_limit_tracking').upsert({
          identifier,
          action_type: actionType,
          attempt_count: 1,
          window_start: now.toISOString(),
          blocked_until: null,
        });
        return { allowed: true };
      }

      // Increment attempt count
      const newAttemptCount = (rateLimitRecord.attempt_count || 0) + 1;
      
      if (newAttemptCount > config.maxAttempts) {
        // Block the identifier
        const blockedUntil = new Date(now.getTime() + config.blockDurationMs);
        await supabase.from('rate_limit_tracking').update({
          attempt_count: newAttemptCount,
          blocked_until: blockedUntil.toISOString(),
          updated_at: now.toISOString(),
        }).eq('id', rateLimitRecord.id);

        await auditLogger.logSecurityEvent({
          event_type: 'rate_limit_exceeded',
          event_data: { identifier, actionType, attemptCount: newAttemptCount }
        });

        const retryAfter = Math.ceil(config.blockDurationMs / 1000);
        return { allowed: false, retryAfter };
      }

      // Update attempt count
      await supabase.from('rate_limit_tracking').update({
        attempt_count: newAttemptCount,
        updated_at: now.toISOString(),
      }).eq('id', rateLimitRecord.id);

      return { allowed: true };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // In case of error, allow the request to proceed
      return { allowed: true };
    }
  }
}

export const rateLimitService = RateLimitService.getInstance();
