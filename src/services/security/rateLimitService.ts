
import { enhancedRateLimiting } from './enhancedRateLimiting';
import { productionLogger } from '@/utils/productionLogger';

export class RateLimitService {
  private static instance: RateLimitService;

  static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }

  async checkRateLimit(identifier: string, action: string = 'api'): Promise<{ allowed: boolean; reason?: string; retryAfter?: number }> {
    try {
      return enhancedRateLimiting.checkRateLimit(action, identifier);
    } catch (error) {
      productionLogger.error('Rate limit check failed', error, 'RateLimitService');
      // Fail open - allow request if rate limiting fails
      return { allowed: true };
    }
  }

  async recordAttempt(identifier: string, action: string = 'api'): Promise<void> {
    try {
      enhancedRateLimiting.recordAttempt(action, identifier);
    } catch (error) {
      productionLogger.error('Failed to record rate limit attempt', error, 'RateLimitService');
      throw error;
    }
  }

  getRemainingAttempts(identifier: string, action: string = 'api'): number {
    return enhancedRateLimiting.getRemainingAttempts(action, identifier);
  }

  getTimeUntilReset(identifier: string, action: string = 'api'): number {
    return enhancedRateLimiting.getTimeUntilReset(action, identifier);
  }

  async cleanupExpiredEntries(): Promise<void> {
    try {
      enhancedRateLimiting.cleanup();
      productionLogger.info('Rate limit cleanup completed successfully');
    } catch (error) {
      productionLogger.error('Failed to cleanup expired rate limit entries', error, 'RateLimitService');
      throw error;
    }
  }

  getStats(): any {
    return enhancedRateLimiting.getStats();
  }
}

export const rateLimitService = RateLimitService.getInstance();
