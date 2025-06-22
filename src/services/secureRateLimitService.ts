
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
  blockDurationMinutes: number;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMinutes: 15, blockDurationMinutes: 30 },
  api: { maxAttempts: 100, windowMinutes: 1, blockDurationMinutes: 5 },
  form_submission: { maxAttempts: 10, windowMinutes: 5, blockDurationMinutes: 10 }
};

export class SecureRateLimitService {
  private static instance: SecureRateLimitService;

  static getInstance(): SecureRateLimitService {
    if (!SecureRateLimitService.instance) {
      SecureRateLimitService.instance = new SecureRateLimitService();
    }
    return SecureRateLimitService.instance;
  }

  async checkRateLimit(identifier: string, action: string): Promise<{ allowed: boolean; remainingAttempts?: number; resetTime?: Date }> {
    try {
      const config = DEFAULT_CONFIGS[action] || DEFAULT_CONFIGS.api;
      const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000);

      // Check current rate limit status
      const { data: existing, error } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', action)
        .gte('window_start', windowStart.toISOString())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        productionLogger.error('Rate limit check failed', error, 'SecureRateLimitService');
        return { allowed: true }; // Fail open for availability
      }

      // Check if currently blocked
      if (existing?.blocked_until && new Date(existing.blocked_until) > new Date()) {
        return {
          allowed: false,
          resetTime: new Date(existing.blocked_until)
        };
      }

      // If no existing record or window expired, allow and create/update record
      if (!existing || new Date(existing.window_start) < windowStart) {
        await this.recordAttempt(identifier, action, 1);
        return {
          allowed: true,
          remainingAttempts: config.maxAttempts - 1
        };
      }

      // Check if limit exceeded
      if (existing.attempt_count >= config.maxAttempts) {
        const blockUntil = new Date(Date.now() + config.blockDurationMinutes * 60 * 1000);
        
        await supabase
          .from('rate_limit_tracking')
          .update({ blocked_until: blockUntil.toISOString() })
          .eq('id', existing.id);

        return {
          allowed: false,
          resetTime: blockUntil
        };
      }

      // Increment attempt count
      await supabase
        .from('rate_limit_tracking')
        .update({ 
          attempt_count: existing.attempt_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - existing.attempt_count - 1
      };
    } catch (error) {
      productionLogger.error('Rate limit service error', error, 'SecureRateLimitService');
      return { allowed: true }; // Fail open
    }
  }

  private async recordAttempt(identifier: string, action: string, attemptCount: number = 1): Promise<void> {
    try {
      await supabase
        .from('rate_limit_tracking')
        .insert({
          identifier,
          action_type: action,
          attempt_count: attemptCount,
          window_start: new Date().toISOString()
        });
    } catch (error) {
      productionLogger.error('Failed to record rate limit attempt', error, 'SecureRateLimitService');
    }
  }

  async getRateLimitStats(userId: string): Promise<{ totalBlocked: number; activeBlocks: number }> {
    try {
      const { data: totalData } = await supabase
        .from('rate_limit_tracking')
        .select('id')
        .eq('identifier', userId)
        .not('blocked_until', 'is', null);

      const { data: activeData } = await supabase
        .from('rate_limit_tracking')
        .select('id')
        .eq('identifier', userId)
        .gt('blocked_until', new Date().toISOString());

      return {
        totalBlocked: totalData?.length || 0,
        activeBlocks: activeData?.length || 0
      };
    } catch (error) {
      productionLogger.error('Failed to get rate limit stats', error, 'SecureRateLimitService');
      return { totalBlocked: 0, activeBlocks: 0 };
    }
  }
}

export const secureRateLimitService = SecureRateLimitService.getInstance();
