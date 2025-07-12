
import { productionLogger } from '@/utils/productionLogger';
import { enhancedThreatDetection } from '@/services/security/threatDetectionEnhanced';
import { rateLimitService } from '@/services/security/rateLimitService';

export class SecurityCleanup {
  private static instance: SecurityCleanup;

  static getInstance(): SecurityCleanup {
    if (!SecurityCleanup.instance) {
      SecurityCleanup.instance = new SecurityCleanup();
    }
    return SecurityCleanup.instance;
  }

  initializeCleanupRoutines(): void {
    this.setupThreatDetectionCleanup();
    this.setupRateLimitCleanup();
  }

  private setupThreatDetectionCleanup(): void {
    // Clean up old threat detection events every hour
    setInterval(() => {
      enhancedThreatDetection.cleanupOldEvents(168); // Keep 7 days
    }, 60 * 60 * 1000);
  }

  private setupRateLimitCleanup(): void {
    // Clean up old rate limit entries
    setInterval(async () => {
      try {
        await rateLimitService.cleanupExpiredEntries();
      } catch (error) {
        productionLogger.error('Failed to cleanup rate limit entries', error, 'SecurityCleanup');
      }
    }, 30 * 60 * 1000); // Every 30 minutes
  }
}

export const securityCleanup = SecurityCleanup.getInstance();
