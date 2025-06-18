
import { securityService } from '@/services/securityService';

export class EnhancedRateLimiter {
  private getIdentifier(): string {
    // Use a combination of factors for identification
    const fingerprint = this.generateFingerprint();
    return fingerprint;
  }

  private generateFingerprint(): string {
    // Create a browser fingerprint for rate limiting
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ];
    
    // Simple hash function for fingerprinting
    const hash = components.join('|');
    let hashValue = 0;
    for (let i = 0; i < hash.length; i++) {
      const char = hash.charCodeAt(i);
      hashValue = ((hashValue << 5) - hashValue) + char;
      hashValue = hashValue & hashValue; // Convert to 32-bit integer
    }
    return Math.abs(hashValue).toString(36);
  }

  async checkRateLimit(actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    const identifier = this.getIdentifier();
    const result = await securityService.checkRateLimit(identifier, actionType);
    
    if (!result.allowed) {
      await securityService.logSecurityEvent({
        event_type: 'rate_limit_violation',
        event_data: { actionType, identifier, retryAfter: result.retryAfter }
      });
    }
    
    return result;
  }

  async resetRateLimit(actionType: string): Promise<void> {
    const identifier = this.getIdentifier();
    await securityService.logSecurityEvent({
      event_type: 'rate_limit_reset',
      event_data: { actionType, identifier }
    });
  }
}

export const enhancedRateLimiter = new EnhancedRateLimiter();
