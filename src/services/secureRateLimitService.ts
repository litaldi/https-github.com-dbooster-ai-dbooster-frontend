
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from './auditLogger';
import { productionLogger } from '@/utils/productionLogger';

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

export class SecureRateLimitService {
  private static instance: SecureRateLimitService;

  static getInstance(): SecureRateLimitService {
    if (!SecureRateLimitService.instance) {
      SecureRateLimitService.instance = new SecureRateLimitService();
    }
    return SecureRateLimitService.instance;
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      const config = RATE_LIMIT_CONFIGS[actionType] || RATE_LIMIT_CONFIGS.api_call;
      const now = new Date();
      const windowStart = new Date(now.getTime() - config.windowMs);

      // Get current rate limit record - only system can access this data
      const { data: rateLimitRecord } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', actionType)
        .maybeSingle();

      // Check if currently blocked
      if (rateLimitRecord?.blocked_until && new Date(rateLimitRecord.blocked_until) > now) {
        const retryAfter = Math.ceil((new Date(rateLimitRecord.blocked_until).getTime() - now.getTime()) / 1000);
        
        // Log security event without exposing sensitive data
        await auditLogger.logSecurityEvent({
          event_type: 'rate_limit_blocked',
          event_data: { 
            actionType, 
            retryAfter,
            // Don't log the actual identifier for privacy
            hasIdentifier: !!identifier 
          }
        });
        
        productionLogger.warn('Rate limit blocked request', { 
          actionType, 
          retryAfter 
        }, 'SecureRateLimitService');
        
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

        // Log security violation
        await auditLogger.logSecurityEvent({
          event_type: 'rate_limit_exceeded',
          event_data: { 
            actionType, 
            attemptCount: newAttemptCount,
            severity: 'high'
          }
        });

        productionLogger.critical('Rate limit exceeded - potential abuse detected', { 
          actionType, 
          attemptCount: newAttemptCount 
        }, 'SecureRateLimitService');

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
      productionLogger.error('Rate limit check failed', { error, actionType }, 'SecureRateLimitService');
      // In case of error, allow the request to proceed but log the failure
      return { allowed: true };
    }
  }

  // Admin-only function to get rate limit statistics
  async getRateLimitStats(adminUserId: string): Promise<{ totalBlocked: number; activeBlocks: number } | null> {
    try {
      // This would require admin role validation in a real implementation
      // For now, we'll return basic non-sensitive stats
      const now = new Date();
      
      const { data: blockedRecords } = await supabase
        .from('rate_limit_tracking')
        .select('blocked_until')
        .not('blocked_until', 'is', null);

      if (!blockedRecords) return null;

      const activeBlocks = blockedRecords.filter(record => 
        record.blocked_until && new Date(record.blocked_until) > now
      ).length;

      return {
        totalBlocked: blockedRecords.length,
        activeBlocks
      };
    } catch (error) {
      productionLogger.error('Failed to get rate limit stats', { error }, 'SecureRateLimitService');
      return null;
    }
  }
}

export const secureRateLimitService = SecureRateLimitService.getInstance();
