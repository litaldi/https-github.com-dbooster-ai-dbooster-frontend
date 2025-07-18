import { productionLogger } from '@/utils/productionLogger';
import { realTimeSecurityMonitor } from './realTimeSecurityMonitor';

interface ApiSecurityStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  suspiciousPatterns: number;
  topDomains: Array<{ domain: string; count: number }>;
}

class EnhancedApiSecurity {
  private static instance: EnhancedApiSecurity;
  private stats: ApiSecurityStats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    suspiciousPatterns: 0,
    topDomains: []
  };
  private responseTimes: number[] = [];
  private domainCounts: Map<string, number> = new Map();

  static getInstance(): EnhancedApiSecurity {
    if (!EnhancedApiSecurity.instance) {
      EnhancedApiSecurity.instance = new EnhancedApiSecurity();
    }
    return EnhancedApiSecurity.instance;
  }

  async makeSecureRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    try {
      // Extract domain for tracking
      const domain = new URL(url).hostname;
      this.domainCounts.set(domain, (this.domainCounts.get(domain) || 0) + 1);
      this.updateTopDomains();

      // Add security headers
      const secureOptions: RequestInit = {
        ...options,
        headers: {
          ...options?.headers,
          'X-Requested-With': 'XMLHttpRequest',
          'X-Content-Type-Options': 'nosniff'
        }
      };

      const response = await fetch(url, secureOptions);
      const responseTime = Date.now() - startTime;
      this.updateResponseTime(responseTime);

      if (!response.ok) {
        this.stats.failedRequests++;
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'rate_limit_hit',
          severity: 'medium',
          message: 'API request failed',
          metadata: { url, status: response.status, responseTime }
        });
        throw new Error(`API request failed: ${response.status}`);
      }

      this.stats.successfulRequests++;
      
      // Check for suspicious patterns
      if (responseTime > 5000) {
        this.stats.suspiciousPatterns++;
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'suspicious_activity',
          severity: 'low',
          message: 'Slow API response detected',
          metadata: { url, responseTime }
        });
      }

      return response.json();
    } catch (error) {
      this.stats.failedRequests++;
      const responseTime = Date.now() - startTime;
      this.updateResponseTime(responseTime);
      
      productionLogger.error('Secure API request failed', error, 'EnhancedApiSecurity');
      throw error;
    }
  }

  getApiSecurityStats(): ApiSecurityStats {
    return { ...this.stats };
  }

  private updateResponseTime(time: number): void {
    this.responseTimes.push(time);
    
    // Keep only last 100 response times
    if (this.responseTimes.length > 100) {
      this.responseTimes = this.responseTimes.slice(-100);
    }
    
    // Calculate average
    this.stats.averageResponseTime = Math.round(
      this.responseTimes.reduce((sum, t) => sum + t, 0) / this.responseTimes.length
    );
  }

  private updateTopDomains(): void {
    this.stats.topDomains = Array.from(this.domainCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));
  }
}

export const enhancedApiSecurity = EnhancedApiSecurity.getInstance();
