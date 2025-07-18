
import { productionLogger } from '@/utils/productionLogger';

interface RateLimitRule {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
  blocked: boolean;
  blockedUntil?: number;
  lastRequest: number;
}

class EnhancedRateLimiting {
  private static instance: EnhancedRateLimiting;
  private limits = new Map<string, RateLimitEntry>();
  private rules: Record<string, RateLimitRule> = {
    'login': { maxRequests: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 5 attempts per 15 min, block for 30 min
    'signup': { maxRequests: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 3 attempts per hour, block for 1 hour
    'api': { maxRequests: 100, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 }, // 100 requests per minute, block for 5 min
    'form_submission': { maxRequests: 10, windowMs: 60 * 1000, blockDurationMs: 2 * 60 * 1000 }, // 10 submissions per minute, block for 2 min
    'password_reset': { maxRequests: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 } // 3 attempts per hour, block for 1 hour
  };

  static getInstance(): EnhancedRateLimiting {
    if (!EnhancedRateLimiting.instance) {
      EnhancedRateLimiting.instance = new EnhancedRateLimiting();
    }
    return EnhancedRateLimiting.instance;
  }

  private getClientIdentifier(): string {
    // Use a combination of factors for client identification
    const factors = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language
    ];
    
    // Simple hash function for client fingerprinting
    let hash = 0;
    const str = factors.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
  }

  checkRateLimit(action: string, customIdentifier?: string): { allowed: boolean; reason?: string; retryAfter?: number } {
    const identifier = customIdentifier || this.getClientIdentifier();
    const key = `${action}:${identifier}`;
    const rule = this.rules[action];
    
    if (!rule) {
      productionLogger.warn(`No rate limit rule found for action: ${action}`);
      return { allowed: true };
    }

    const now = Date.now();
    let entry = this.limits.get(key);

    // Initialize entry if it doesn't exist
    if (!entry) {
      entry = {
        count: 0,
        windowStart: now,
        blocked: false,
        lastRequest: now
      };
      this.limits.set(key, entry);
    }

    // Check if currently blocked
    if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded - temporarily blocked',
        retryAfter: entry.blockedUntil - now
      };
    }

    // Reset block status if block period has expired
    if (entry.blocked && entry.blockedUntil && now >= entry.blockedUntil) {
      entry.blocked = false;
      entry.blockedUntil = undefined;
      entry.count = 0;
      entry.windowStart = now;
    }

    // Reset window if expired
    if (now - entry.windowStart >= rule.windowMs) {
      entry.count = 0;
      entry.windowStart = now;
    }

    // Check if limit exceeded
    if (entry.count >= rule.maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + rule.blockDurationMs;
      
      productionLogger.warn('Rate limit exceeded', {
        action,
        identifier: identifier.substring(0, 8), // Only log partial identifier for privacy
        count: entry.count,
        maxRequests: rule.maxRequests,
        windowMs: rule.windowMs,
        blockedUntil: entry.blockedUntil
      });

      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        retryAfter: rule.blockDurationMs
      };
    }

    // Increment count and update last request time
    entry.count++;
    entry.lastRequest = now;
    
    return { allowed: true };
  }

  recordAttempt(action: string, customIdentifier?: string): void {
    const result = this.checkRateLimit(action, customIdentifier);
    if (!result.allowed) {
      throw new Error(result.reason || 'Rate limit exceeded');
    }
  }

  getRemainingAttempts(action: string, customIdentifier?: string): number {
    const identifier = customIdentifier || this.getClientIdentifier();
    const key = `${action}:${identifier}`;
    const rule = this.rules[action];
    const entry = this.limits.get(key);

    if (!rule || !entry) {
      return rule?.maxRequests || 0;
    }

    const now = Date.now();
    
    // If window expired, return max requests
    if (now - entry.windowStart >= rule.windowMs) {
      return rule.maxRequests;
    }

    return Math.max(0, rule.maxRequests - entry.count);
  }

  getTimeUntilReset(action: string, customIdentifier?: string): number {
    const identifier = customIdentifier || this.getClientIdentifier();
    const key = `${action}:${identifier}`;
    const rule = this.rules[action];
    const entry = this.limits.get(key);

    if (!rule || !entry) {
      return 0;
    }

    const now = Date.now();
    
    // If blocked, return time until unblocked
    if (entry.blocked && entry.blockedUntil) {
      return Math.max(0, entry.blockedUntil - now);
    }

    // Return time until window resets
    return Math.max(0, rule.windowMs - (now - entry.windowStart));
  }

  clearLimitsForIdentifier(identifier: string): void {
    const keysToDelete: string[] = [];
    for (const [key] of this.limits) {
      if (key.endsWith(`:${identifier}`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => this.limits.delete(key));
  }

  addCustomRule(action: string, rule: RateLimitRule): void {
    this.rules[action] = rule;
  }

  getStats(): { totalEntries: number; blockedEntries: number; rules: Record<string, RateLimitRule> } {
    let blockedEntries = 0;
    const now = Date.now();
    
    for (const entry of this.limits.values()) {
      if (entry.blocked && entry.blockedUntil && now < entry.blockedUntil) {
        blockedEntries++;
      }
    }

    return {
      totalEntries: this.limits.size,
      blockedEntries,
      rules: { ...this.rules }
    };
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of this.limits) {
      // Remove entries that are old and not blocked
      if (!entry.blocked && (now - entry.lastRequest) > 24 * 60 * 60 * 1000) { // 24 hours
        keysToDelete.push(key);
      }
      // Remove entries where block has expired
      else if (entry.blocked && entry.blockedUntil && now >= entry.blockedUntil + 60 * 60 * 1000) { // 1 hour after block expires
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.limits.delete(key));
    
    if (keysToDelete.length > 0) {
      productionLogger.info(`Cleaned up ${keysToDelete.length} old rate limit entries`);
    }
  }
}

export const enhancedRateLimiting = EnhancedRateLimiting.getInstance();

// Setup periodic cleanup
setInterval(() => {
  enhancedRateLimiting.cleanup();
}, 60 * 60 * 1000); // Run cleanup every hour
