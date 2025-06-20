
interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

class EnhancedRateLimiter {
  private limits: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  async checkRateLimit(action: string): Promise<RateLimitResult> {
    const now = Date.now();
    const key = action;
    const limit = this.limits.get(key);

    if (!limit || now > limit.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true };
    }

    if (limit.count >= this.maxAttempts) {
      const retryAfter = Math.ceil((limit.resetTime - now) / 1000);
      return { allowed: false, retryAfter };
    }

    limit.count++;
    return { allowed: true };
  }

  async resetRateLimit(action: string): Promise<void> {
    this.limits.delete(action);
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter();
