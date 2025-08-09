
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

interface RateLimitEntry {
  identifier: string;
  action: string;
  attemptCount: number;
  windowStart: Date;
  blockedUntil?: Date;
}

interface IPReputationScore {
  ip: string;
  score: number;
  lastUpdate: Date;
  violations: number;
}

class ServerSideRateLimit {
  private static instance: ServerSideRateLimit;
  private ipReputationCache = new Map<string, IPReputationScore>();

  static getInstance(): ServerSideRateLimit {
    if (!ServerSideRateLimit.instance) {
      ServerSideRateLimit.instance = new ServerSideRateLimit();
    }
    return ServerSideRateLimit.instance;
  }

  async checkDatabaseRateLimit(
    identifier: string, 
    action: string
  ): Promise<{ allowed: boolean; retryAfter?: number; reason?: string }> {
    try {
      // Check existing rate limit entry
      const { data: existingEntry } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', action)
        .single();

      if (existingEntry) {
        const now = new Date();
        const windowStart = new Date(existingEntry.window_start);
        const windowDuration = this.getWindowDuration(action);

        // Check if currently blocked
        if (existingEntry.blocked_until && now < new Date(existingEntry.blocked_until)) {
          return {
            allowed: false,
            retryAfter: new Date(existingEntry.blocked_until).getTime() - now.getTime(),
            reason: 'Rate limit exceeded - temporarily blocked'
          };
        }

        // Check if window has expired
        if (now.getTime() - windowStart.getTime() > windowDuration) {
          // Reset the window
          await this.resetRateLimitWindow(existingEntry.id, identifier, action);
          return { allowed: true };
        }

        // Check if limit exceeded
        const maxAttempts = this.getMaxAttempts(action);
        if (existingEntry.attempt_count >= maxAttempts) {
          const blockDuration = this.getBlockDuration(action, existingEntry.attempt_count);
          const blockedUntil = new Date(now.getTime() + blockDuration);

          await supabase
            .from('rate_limit_tracking')
            .update({ 
              blocked_until: blockedUntil.toISOString(),
              updated_at: now.toISOString()
            })
            .eq('id', existingEntry.id);

          return {
            allowed: false,
            retryAfter: blockDuration,
            reason: 'Rate limit exceeded'
          };
        }

        // Increment attempt count
        await supabase
          .from('rate_limit_tracking')
          .update({ 
            attempt_count: existingEntry.attempt_count + 1,
            updated_at: now.toISOString()
          })
          .eq('id', existingEntry.id);

        return { allowed: true };
      } else {
        // Create new rate limit entry
        await supabase
          .from('rate_limit_tracking')
          .insert({
            identifier,
            action_type: action,
            attempt_count: 1,
            window_start: new Date().toISOString()
          });

        return { allowed: true };
      }
    } catch (error) {
      productionLogger.error('Database rate limit check failed', error, 'ServerSideRateLimit');
      // Fail open for database errors
      return { allowed: true };
    }
  }

  async recordViolation(identifier: string, severity: 'low' | 'medium' | 'high' | 'critical'): Promise<void> {
    try {
      const ip = await this.extractIPFromIdentifier(identifier);
      if (!ip) return;

      const existing = this.ipReputationCache.get(ip);
      const scoreDeduction = this.getScoreDeduction(severity);
      
      const newScore = existing ? Math.max(0, existing.score - scoreDeduction) : 100 - scoreDeduction;
      const newViolations = existing ? existing.violations + 1 : 1;

      this.ipReputationCache.set(ip, {
        ip,
        score: newScore,
        lastUpdate: new Date(),
        violations: newViolations
      });

      // Log security audit entry
      await supabase
        .from('security_audit_log')
        .insert({
          event_type: 'rate_limit_violation',
          event_data: {
            identifier,
            severity,
            newScore,
            violations: newViolations
          },
          ip_address: ip
        });

      productionLogger.warn('Rate limit violation recorded', {
        identifier: identifier.substring(0, 8),
        severity,
        newScore,
        violations: newViolations
      });
    } catch (error) {
      productionLogger.error('Failed to record violation', error, 'ServerSideRateLimit');
    }
  }

  getIPReputationScore(ip: string): number {
    const reputation = this.ipReputationCache.get(ip);
    return reputation?.score || 100;
  }

  isIPTrusted(ip: string): boolean {
    return this.getIPReputationScore(ip) >= 70;
  }

  private async resetRateLimitWindow(id: string, identifier: string, action: string): Promise<void> {
    await supabase
      .from('rate_limit_tracking')
      .update({
        attempt_count: 1,
        window_start: new Date().toISOString(),
        blocked_until: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
  }

  private getWindowDuration(action: string): number {
    const durations: Record<string, number> = {
      'login': 15 * 60 * 1000,        // 15 minutes
      'signup': 60 * 60 * 1000,       // 1 hour
      'api': 60 * 1000,               // 1 minute
      'form_submission': 60 * 1000,   // 1 minute
      'password_reset': 60 * 60 * 1000 // 1 hour
    };
    return durations[action] || 60 * 1000;
  }

  private getMaxAttempts(action: string): number {
    const limits: Record<string, number> = {
      'login': 5,
      'signup': 3,
      'api': 100,
      'form_submission': 10,
      'password_reset': 3
    };
    return limits[action] || 10;
  }

  private getBlockDuration(action: string, attemptCount: number): number {
    const baseDurations: Record<string, number> = {
      'login': 30 * 60 * 1000,        // 30 minutes
      'signup': 60 * 60 * 1000,       // 1 hour
      'api': 5 * 60 * 1000,           // 5 minutes
      'form_submission': 2 * 60 * 1000, // 2 minutes
      'password_reset': 60 * 60 * 1000  // 1 hour
    };
    
    // Progressive penalty: increase block duration with repeated violations
    const baseDuration = baseDurations[action] || 5 * 60 * 1000;
    const multiplier = Math.min(Math.pow(2, attemptCount - 5), 8); // Cap at 8x
    return baseDuration * multiplier;
  }

  private getScoreDeduction(severity: string): number {
    const deductions: Record<string, number> = {
      'low': 5,
      'medium': 15,
      'high': 30,
      'critical': 50
    };
    return deductions[severity] || 10;
  }

  private async extractIPFromIdentifier(identifier: string): Promise<string | null> {
    // Try to extract IP from identifier if it's in format "action:ip"
    if (identifier.includes(':')) {
      const parts = identifier.split(':');
      if (parts.length === 2 && this.isValidIP(parts[1])) {
        return parts[1];
      }
    }
    
    // Fallback removed: do not collect IP client-side
    return null;
  }

  private isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  async cleanupExpiredEntries(): Promise<void> {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const { error } = await supabase
        .from('rate_limit_tracking')
        .delete()
        .lt('updated_at', oneDayAgo.toISOString())
        .is('blocked_until', null);

      if (error) {
        throw error;
      }

      productionLogger.info('Server-side rate limit cleanup completed');
    } catch (error) {
      productionLogger.error('Failed to cleanup server-side rate limits', error, 'ServerSideRateLimit');
    }
  }
}

export const serverSideRateLimit = ServerSideRateLimit.getInstance();
