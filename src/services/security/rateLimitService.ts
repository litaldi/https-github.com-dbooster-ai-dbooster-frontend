
interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs?: number;
}

interface RateLimitRecord {
  attempts: number;
  windowStart: number;
  blockedUntil?: number;
}

export class RateLimitService {
  private static instance: RateLimitService;
  private limits: Map<string, RateLimitRecord> = new Map();
  
  private configs: Record<string, RateLimitConfig> = {
    auth: { windowMs: 15 * 60 * 1000, maxAttempts: 5, blockDurationMs: 15 * 60 * 1000 },
    api: { windowMs: 60 * 1000, maxAttempts: 100 },
    default: { windowMs: 60 * 1000, maxAttempts: 50 }
  };

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  async checkRateLimit(identifier: string, actionType: string = 'default'): Promise<{
    allowed: boolean;
    retryAfter?: number;
    remaining: number;
    resetTime: number;
  }> {
    const config = this.configs[actionType] || this.configs.default;
    const key = `${identifier}:${actionType}`;
    const now = Date.now();
    
    let record = this.limits.get(key);
    
    // Check if currently blocked
    if (record?.blockedUntil && now < record.blockedUntil) {
      return {
        allowed: false,
        retryAfter: Math.ceil((record.blockedUntil - now) / 1000),
        remaining: 0,
        resetTime: record.blockedUntil
      };
    }
    
    // Initialize or reset window
    if (!record || (now - record.windowStart) >= config.windowMs) {
      record = {
        attempts: 1,
        windowStart: now
      };
    } else {
      record.attempts++;
    }
    
    const resetTime = record.windowStart + config.windowMs;
    
    // Check if limit exceeded
    if (record.attempts > config.maxAttempts) {
      if (config.blockDurationMs) {
        record.blockedUntil = now + config.blockDurationMs;
      }
      
      this.limits.set(key, record);
      
      return {
        allowed: false,
        retryAfter: config.blockDurationMs ? Math.ceil(config.blockDurationMs / 1000) : undefined,
        remaining: 0,
        resetTime: record.blockedUntil || resetTime
      };
    }
    
    this.limits.set(key, record);
    
    return {
      allowed: true,
      remaining: config.maxAttempts - record.attempts,
      resetTime
    };
  }

  clearRateLimit(identifier: string, actionType: string = 'default'): void {
    const key = `${identifier}:${actionType}`;
    this.limits.delete(key);
  }

  getRateLimitStatus(identifier: string, actionType: string = 'default'): {
    attempts: number;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  } | null {
    const config = this.configs[actionType] || this.configs.default;
    const key = `${identifier}:${actionType}`;
    const record = this.limits.get(key);
    const now = Date.now();
    
    if (!record) return null;
    
    const blocked = record.blockedUntil ? now < record.blockedUntil : false;
    const resetTime = record.windowStart + config.windowMs;
    
    return {
      attempts: record.attempts,
      remaining: Math.max(0, config.maxAttempts - record.attempts),
      resetTime,
      blocked
    };
  }

  async cleanupExpiredEntries(): Promise<void> {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, record] of this.limits.entries()) {
      // Remove entries that are no longer blocked and outside their window
      const [, actionType] = key.split(':');
      const config = this.configs[actionType] || this.configs.default;
      
      const windowExpired = (now - record.windowStart) >= config.windowMs;
      const notBlocked = !record.blockedUntil || now >= record.blockedUntil;
      
      if (windowExpired && notBlocked) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.limits.delete(key));
  }
}

export const rateLimitService = RateLimitService.getInstance();
