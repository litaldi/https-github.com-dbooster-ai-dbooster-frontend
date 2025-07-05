
import { productionLogger } from '@/utils/productionLogger';

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  blockDurationMs: number;
}

export class RateLimitService {
  private static instance: RateLimitService;
  private limits: Map<string, RateLimitEntry> = new Map();
  private blockedIPs: Set<string> = new Set();
  
  private configs: Record<string, RateLimitConfig> = {
    api: { windowMs: 60000, maxRequests: 100, blockDurationMs: 300000 }, // 100 req/min, 5min block
    auth: { windowMs: 300000, maxRequests: 5, blockDurationMs: 900000 }, // 5 req/5min, 15min block
    form: { windowMs: 60000, maxRequests: 10, blockDurationMs: 60000 }, // 10 req/min, 1min block
    search: { windowMs: 60000, maxRequests: 30, blockDurationMs: 120000 } // 30 req/min, 2min block
  };

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  async checkRateLimit(identifier: string, action: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    retryAfter?: number;
  }> {
    const config = this.configs[action] || this.configs.api;
    const key = `${identifier}:${action}`;
    const now = Date.now();

    // Check if IP is currently blocked
    if (this.blockedIPs.has(identifier)) {
      productionLogger.warn('Blocked IP attempted access', { identifier, action }, 'RateLimitService');
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + config.blockDurationMs,
        retryAfter: config.blockDurationMs
      };
    }

    let entry = this.limits.get(key);

    // Initialize or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs,
        firstRequest: now
      };
    }

    entry.count++;
    this.limits.set(key, entry);

    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    // Block IP if severely exceeding limits
    if (entry.count > config.maxRequests * 2) {
      this.blockedIPs.add(identifier);
      productionLogger.error('IP blocked for severe rate limit violation', {
        identifier,
        action,
        attemptedRequests: entry.count,
        limit: config.maxRequests
      }, 'RateLimitService');
      
      // Auto-unblock after block duration
      setTimeout(() => {
        this.blockedIPs.delete(identifier);
        productionLogger.info('IP unblocked after timeout', { identifier }, 'RateLimitService');
      }, config.blockDurationMs);
    }

    if (!allowed) {
      productionLogger.warn('Rate limit exceeded', {
        identifier,
        action,
        count: entry.count,
        limit: config.maxRequests
      }, 'RateLimitService');
    }

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      retryAfter: allowed ? undefined : (entry.resetTime - now)
    };
  }

  async cleanupExpiredEntries(): Promise<void> {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      productionLogger.secureDebug('Cleaned up expired rate limit entries', { cleanedCount }, 'RateLimitService');
    }
  }

  getRateLimitStats(): {
    totalEntries: number;
    blockedIPs: number;
    topLimitedActions: Array<{ action: string; count: number }>;
  } {
    const actionCounts: Record<string, number> = {};
    
    for (const key of this.limits.keys()) {
      const action = key.split(':')[1];
      actionCounts[action] = (actionCounts[action] || 0) + 1;
    }

    const topLimitedActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalEntries: this.limits.size,
      blockedIPs: this.blockedIPs.size,
      topLimitedActions
    };
  }

  updateRateLimitConfig(action: string, config: RateLimitConfig): void {
    this.configs[action] = config;
    productionLogger.secureInfo('Rate limit configuration updated', { action, config }, 'RateLimitService');
  }
}

export const rateLimitService = RateLimitService.getInstance();
