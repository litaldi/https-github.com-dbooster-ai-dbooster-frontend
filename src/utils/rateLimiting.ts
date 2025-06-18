import { enhancedRateLimiter } from '@/utils/enhancedRateLimiting';

// Keep the existing RateLimiter for backward compatibility
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  async checkRateLimit(identifier: string = 'default'): Promise<void> {
    // Use the enhanced rate limiter for database-backed rate limiting
    const result = await enhancedRateLimiter.checkRateLimit('login');
    
    if (!result.allowed) {
      const timeLeft = result.retryAfter || 900; // Default to 15 minutes
      const minutes = Math.ceil(timeLeft / 60);
      throw new Error(`Too many attempts. Please try again in ${minutes} minutes.`);
    }

    // Fallback to in-memory rate limiting if database fails
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return;
    }

    // Reset if window has passed
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return;
    }

    if (userAttempts.count >= this.maxAttempts) {
      const timeLeft = Math.ceil((this.windowMs - (now - userAttempts.lastAttempt)) / 1000 / 60);
      throw new Error(`Too many attempts. Please try again in ${timeLeft} minutes.`);
    }

    userAttempts.count++;
    userAttempts.lastAttempt = now;
  }

  async resetAttempts(identifier: string = 'default'): Promise<void> {
    this.attempts.delete(identifier);
    await enhancedRateLimiter.resetRateLimit('login');
  }
}
