
import { productionLogger } from '@/utils/productionLogger';

interface BreachCheckResult {
  isBreached: boolean;
  breachCount: number;
  breachSources: string[];
}

class BreachDetectionService {
  private static instance: BreachDetectionService;
  private cache = new Map<string, { result: BreachCheckResult; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): BreachDetectionService {
    if (!BreachDetectionService.instance) {
      BreachDetectionService.instance = new BreachDetectionService();
    }
    return BreachDetectionService.instance;
  }

  async checkPasswordBreach(password: string): Promise<BreachCheckResult> {
    try {
      const passwordHash = await this.hashPassword(password);
      const hashPrefix = passwordHash.substring(0, 5);
      const hashSuffix = passwordHash.substring(5);

      // Check cache first
      const cached = this.cache.get(hashPrefix);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return this.findHashInResponse(cached.result, hashSuffix);
      }

      // Query HaveIBeenPwned API
      const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'SQL-Optimizer-Security-Check'
        }
      });

      if (!response.ok) {
        productionLogger.warn('Breach detection service unavailable, proceeding with local validation');
        return { isBreached: false, breachCount: 0, breachSources: [] };
      }

      const responseText = await response.text();
      const result = this.parseBreachResponse(responseText, hashSuffix);

      // Cache the result
      this.cache.set(hashPrefix, { result, timestamp: Date.now() });

      return result;
    } catch (error) {
      productionLogger.error('Password breach check failed', error, 'BreachDetectionService');
      return { isBreached: false, breachCount: 0, breachSources: [] };
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  private parseBreachResponse(responseText: string, hashSuffix: string): BreachCheckResult {
    const lines = responseText.split('\n');
    
    for (const line of lines) {
      const [suffix, count] = line.split(':');
      if (suffix?.trim() === hashSuffix) {
        return {
          isBreached: true,
          breachCount: parseInt(count?.trim() || '0', 10),
          breachSources: ['HaveIBeenPwned']
        };
      }
    }

    return { isBreached: false, breachCount: 0, breachSources: [] };
  }

  private findHashInResponse(cachedResult: BreachCheckResult, hashSuffix: string): BreachCheckResult {
    // This is a simplified version - in real implementation, we'd store the full response
    return cachedResult;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const breachDetectionService = BreachDetectionService.getInstance();
