
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
  action: string;
}

interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: Date | null;
  blocked: boolean;
  blockUntil: Date | null;
}

const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000, action: 'login' },
  api: { maxAttempts: 100, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000, action: 'api' },
  sensitive: { maxAttempts: 3, windowMs: 5 * 60 * 1000, blockDurationMs: 60 * 60 * 1000, action: 'sensitive' }
};

export function useAdvancedRateLimit() {
  const [rateLimitStatus, setRateLimitStatus] = useState<Record<string, RateLimitStatus>>({});

  const getUserIdentifier = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || 'anonymous';
  }, []);

  const checkRateLimit = useCallback(async (action: string, customConfig?: Partial<RateLimitConfig>): Promise<RateLimitStatus> => {
    try {
      const config = { ...DEFAULT_CONFIGS[action] || DEFAULT_CONFIGS.api, ...customConfig };
      const identifier = await getUserIdentifier();
      
      const { data, error } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', action)
        .single();

      if (error && error.code !== 'PGRST116') {
        productionLogger.error('Rate limit check failed', error, 'useAdvancedRateLimit');
        // Fail open for now, but log the issue
        return {
          allowed: true,
          remaining: config.maxAttempts,
          resetTime: null,
          blocked: false,
          blockUntil: null
        };
      }

      const now = new Date();
      const windowStart = data?.window_start ? new Date(data.window_start) : now;
      const isInCurrentWindow = now.getTime() - windowStart.getTime() < config.windowMs;
      const isBlocked = data?.blocked_until && new Date(data.blocked_until) > now;

      if (isBlocked) {
        const status: RateLimitStatus = {
          allowed: false,
          remaining: 0,
          resetTime: new Date(data.blocked_until),
          blocked: true,
          blockUntil: new Date(data.blocked_until)
        };
        setRateLimitStatus(prev => ({ ...prev, [action]: status }));
        return status;
      }

      const currentAttempts = isInCurrentWindow ? (data?.attempt_count || 0) : 0;
      const allowed = currentAttempts < config.maxAttempts;
      const remaining = Math.max(0, config.maxAttempts - currentAttempts);
      
      const resetTime = isInCurrentWindow 
        ? new Date(windowStart.getTime() + config.windowMs)
        : new Date(now.getTime() + config.windowMs);

      const status: RateLimitStatus = {
        allowed,
        remaining,
        resetTime,
        blocked: false,
        blockUntil: null
      };

      setRateLimitStatus(prev => ({ ...prev, [action]: status }));
      return status;

    } catch (error) {
      productionLogger.error('Rate limit check error', error, 'useAdvancedRateLimit');
      // Fail open but log
      return {
        allowed: true,
        remaining: 0,
        resetTime: null,
        blocked: false,
        blockUntil: null
      };
    }
  }, [getUserIdentifier]);

  const recordAttempt = useCallback(async (action: string, success: boolean = true, customConfig?: Partial<RateLimitConfig>) => {
    try {
      const config = { ...DEFAULT_CONFIGS[action] || DEFAULT_CONFIGS.api, ...customConfig };
      const identifier = await getUserIdentifier();
      const now = new Date();

      const { data: existing } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', action)
        .single();

      if (existing) {
        const windowStart = new Date(existing.window_start);
        const isInCurrentWindow = now.getTime() - windowStart.getTime() < config.windowMs;
        const newAttemptCount = isInCurrentWindow ? existing.attempt_count + 1 : 1;
        
        // Check if we should block after this attempt
        let blockedUntil = null;
        if (!success && newAttemptCount >= config.maxAttempts) {
          blockedUntil = new Date(now.getTime() + config.blockDurationMs);
        }

        await supabase
          .from('rate_limit_tracking')
          .update({
            attempt_count: newAttemptCount,
            window_start: isInCurrentWindow ? windowStart.toISOString() : now.toISOString(),
            blocked_until: blockedUntil?.toISOString() || null,
            updated_at: now.toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Create new tracking record
        await supabase
          .from('rate_limit_tracking')
          .insert({
            identifier,
            action_type: action,
            attempt_count: 1,
            window_start: now.toISOString(),
            blocked_until: null
          });
      }

      // Update local status
      await checkRateLimit(action, customConfig);

    } catch (error) {
      productionLogger.error('Failed to record rate limit attempt', error, 'useAdvancedRateLimit');
    }
  }, [getUserIdentifier, checkRateLimit]);

  const resetRateLimit = useCallback(async (action: string) => {
    try {
      const identifier = await getUserIdentifier();
      
      await supabase
        .from('rate_limit_tracking')
        .delete()
        .eq('identifier', identifier)
        .eq('action_type', action);

      setRateLimitStatus(prev => {
        const updated = { ...prev };
        delete updated[action];
        return updated;
      });

    } catch (error) {
      productionLogger.error('Failed to reset rate limit', error, 'useAdvancedRateLimit');
    }
  }, [getUserIdentifier]);

  // Cleanup expired rate limits periodically
  useEffect(() => {
    const cleanup = async () => {
      try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        await supabase
          .from('rate_limit_tracking')
          .delete()
          .lt('updated_at', oneHourAgo.toISOString());
      } catch (error) {
        productionLogger.warn('Rate limit cleanup failed', error, 'useAdvancedRateLimit');
      }
    };

    const interval = setInterval(cleanup, 30 * 60 * 1000); // Cleanup every 30 minutes
    return () => clearInterval(interval);
  }, []);

  return {
    rateLimitStatus,
    checkRateLimit,
    recordAttempt,
    resetRateLimit
  };
}
