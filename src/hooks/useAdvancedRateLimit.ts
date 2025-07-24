import { useState, useEffect, useCallback } from 'react';
import { productionLogger } from '@/utils/productionLogger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  action: string;
  identifier?: string;
}

interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

interface RateLimitMetrics {
  totalRequests: number;
  blockedRequests: number;
  successRate: number;
  averageInterval: number;
}

class AdvancedRateLimiter {
  private static instance: AdvancedRateLimiter;
  private requests: Map<string, number[]> = new Map();
  private suspiciousIPs: Set<string> = new Set();
  private dynamicLimits: Map<string, RateLimitConfig> = new Map();

  static getInstance(): AdvancedRateLimiter {
    if (!AdvancedRateLimiter.instance) {
      AdvancedRateLimiter.instance = new AdvancedRateLimiter();
    }
    return AdvancedRateLimiter.instance;
  }

  private getKey(action: string, identifier?: string): string {
    return `${action}:${identifier || 'anonymous'}`;
  }

  private getCurrentIP(): string {
    // In a real implementation, this would get the actual client IP
    // For now, we'll use a placeholder
    return 'client-ip';
  }

  checkRateLimit(config: RateLimitConfig): RateLimitStatus {
    const key = this.getKey(config.action, config.identifier);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get existing requests for this key
    let requestTimes = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    requestTimes = requestTimes.filter(time => time > windowStart);

    // Check if we're within the limit
    const remaining = Math.max(0, config.maxRequests - requestTimes.length);
    const allowed = requestTimes.length < config.maxRequests;

    // Calculate reset time
    const oldestRequest = requestTimes[0];
    const resetTime = oldestRequest ? oldestRequest + config.windowMs : now + config.windowMs;

    if (allowed) {
      // Add current request time
      requestTimes.push(now);
      this.requests.set(key, requestTimes);
    } else {
      // Track suspicious behavior
      this.detectSuspiciousActivity(config, requestTimes);
    }

    return {
      allowed,
      remaining,
      resetTime,
      retryAfter: allowed ? undefined : Math.ceil((resetTime - now) / 1000)
    };
  }

  private detectSuspiciousActivity(config: RateLimitConfig, requestTimes: number[]): void {
    const currentIP = this.getCurrentIP();
    
    // Check for rapid-fire requests (burst detection)
    if (requestTimes.length >= 3) {
      const recentRequests = requestTimes.slice(-3);
      const timeDiff = recentRequests[2] - recentRequests[0];
      
      if (timeDiff < 1000) { // 3 requests within 1 second
        this.suspiciousIPs.add(currentIP);
        
        productionLogger.error('Suspicious burst activity detected', {
          action: config.action,
          identifier: config.identifier,
          requestCount: requestTimes.length,
          timeDiff,
          ip: currentIP
        }, 'AdvancedRateLimiter');

        // Apply stricter limits for suspicious IPs
        this.applyDynamicLimit(config.action, {
          ...config,
          maxRequests: Math.max(1, Math.floor(config.maxRequests * 0.5)),
          windowMs: config.windowMs * 2
        });
      }
    }

    // Check for sustained high-frequency requests
    const requestsInLastMinute = requestTimes.filter(time => time > Date.now() - 60000);
    if (requestsInLastMinute.length > config.maxRequests * 2) {
      this.suspiciousIPs.add(currentIP);
      
      productionLogger.error('Sustained high-frequency requests detected', {
        action: config.action,
        identifier: config.identifier,
        requestsInLastMinute: requestsInLastMinute.length,
        ip: currentIP
      }, 'AdvancedRateLimiter');
    }
  }

  private applyDynamicLimit(action: string, config: RateLimitConfig): void {
    this.dynamicLimits.set(action, config);
    
    // Remove dynamic limit after some time
    setTimeout(() => {
      this.dynamicLimits.delete(action);
    }, config.windowMs * 3);
  }

  getDynamicConfig(action: string, baseConfig: RateLimitConfig): RateLimitConfig {
    const dynamicConfig = this.dynamicLimits.get(action);
    const currentIP = this.getCurrentIP();
    
    // Apply stricter limits for suspicious IPs
    if (this.suspiciousIPs.has(currentIP)) {
      return {
        ...baseConfig,
        maxRequests: Math.max(1, Math.floor(baseConfig.maxRequests * 0.3)),
        windowMs: baseConfig.windowMs * 2
      };
    }

    return dynamicConfig || baseConfig;
  }

  getMetrics(action: string, identifier?: string): RateLimitMetrics {
    const key = this.getKey(action, identifier);
    const requestTimes = this.requests.get(key) || [];
    
    if (requestTimes.length === 0) {
      return {
        totalRequests: 0,
        blockedRequests: 0,
        successRate: 100,
        averageInterval: 0
      };
    }

    // Calculate metrics from recent activity
    const now = Date.now();
    const recentRequests = requestTimes.filter(time => time > now - 3600000); // Last hour
    
    // Estimate blocked requests (this is approximate)
    const estimatedBlocked = Math.max(0, recentRequests.length - (60 * 10)); // Assume 10 req/min is normal
    
    // Calculate average interval between requests
    let totalInterval = 0;
    for (let i = 1; i < recentRequests.length; i++) {
      totalInterval += recentRequests[i] - recentRequests[i - 1];
    }
    const averageInterval = recentRequests.length > 1 ? totalInterval / (recentRequests.length - 1) : 0;

    return {
      totalRequests: recentRequests.length,
      blockedRequests: estimatedBlocked,
      successRate: recentRequests.length > 0 ? ((recentRequests.length - estimatedBlocked) / recentRequests.length) * 100 : 100,
      averageInterval
    };
  }

  clearSuspiciousIP(ip?: string): void {
    if (ip) {
      this.suspiciousIPs.delete(ip);
    } else {
      this.suspiciousIPs.clear();
    }
  }

  isSuspicious(ip?: string): boolean {
    return this.suspiciousIPs.has(ip || this.getCurrentIP());
  }

  reset(action?: string, identifier?: string): void {
    if (action) {
      const key = this.getKey(action, identifier);
      this.requests.delete(key);
    } else {
      this.requests.clear();
    }
  }
}

export function useAdvancedRateLimit() {
  const [rateLimiter] = useState(() => AdvancedRateLimiter.getInstance());
  const [metrics, setMetrics] = useState<Record<string, RateLimitMetrics>>({});

  // Default rate limit configurations
  const defaultConfigs: Record<string, RateLimitConfig> = {
    login: { maxRequests: 5, windowMs: 900000, action: 'login' }, // 5 attempts per 15 minutes
    signup: { maxRequests: 3, windowMs: 3600000, action: 'signup' }, // 3 attempts per hour
    passwordReset: { maxRequests: 3, windowMs: 3600000, action: 'passwordReset' }, // 3 per hour
    apiCall: { maxRequests: 100, windowMs: 60000, action: 'apiCall' }, // 100 per minute
    search: { maxRequests: 30, windowMs: 60000, action: 'search' }, // 30 per minute
    upload: { maxRequests: 10, windowMs: 300000, action: 'upload' }, // 10 per 5 minutes
    download: { maxRequests: 50, windowMs: 300000, action: 'download' }, // 50 per 5 minutes
  };

  const checkRateLimit = useCallback((
    action: string, 
    identifier?: string,
    customConfig?: Partial<RateLimitConfig>
  ): RateLimitStatus => {
    const baseConfig = defaultConfigs[action] || defaultConfigs.apiCall;
    const config = {
      ...baseConfig,
      ...customConfig,
      identifier
    };

    // Get dynamic configuration based on current threat level
    const dynamicConfig = rateLimiter.getDynamicConfig(action, config);
    
    const result = rateLimiter.checkRateLimit(dynamicConfig);

    // Log rate limit violations
    if (!result.allowed) {
      productionLogger.warn('Rate limit exceeded', {
        action,
        identifier,
        remaining: result.remaining,
        retryAfter: result.retryAfter
      }, 'useAdvancedRateLimit');
    }

    return result;
  }, [rateLimiter]);

  const getMetrics = useCallback((action: string, identifier?: string): RateLimitMetrics => {
    return rateLimiter.getMetrics(action, identifier);
  }, [rateLimiter]);

  const clearSuspiciousActivity = useCallback((ip?: string) => {
    rateLimiter.clearSuspiciousIP(ip);
  }, [rateLimiter]);

  const isSuspiciousActivity = useCallback((ip?: string): boolean => {
    return rateLimiter.isSuspicious(ip);
  }, [rateLimiter]);

  const resetRateLimit = useCallback((action?: string, identifier?: string) => {
    rateLimiter.reset(action, identifier);
  }, [rateLimiter]);

  // Enhanced rate limiting with adaptive thresholds
  const adaptiveRateLimit = useCallback((
    action: string,
    identifier?: string,
    riskScore: number = 0
  ): RateLimitStatus => {
    const baseConfig = defaultConfigs[action] || defaultConfigs.apiCall;
    
    // Adjust limits based on risk score (0-100)
    const riskMultiplier = Math.max(0.1, 1 - (riskScore / 100));
    
    const adaptiveConfig = {
      ...baseConfig,
      maxRequests: Math.floor(baseConfig.maxRequests * riskMultiplier),
      identifier
    };

    return rateLimiter.checkRateLimit(adaptiveConfig);
  }, [rateLimiter]);

  // Update metrics periodically
  useEffect(() => {
    const updateMetrics = () => {
      const newMetrics: Record<string, RateLimitMetrics> = {};
      
      Object.keys(defaultConfigs).forEach(action => {
        newMetrics[action] = getMetrics(action);
      });
      
      setMetrics(newMetrics);
    };

    // Initial update
    updateMetrics();

    // Update every 30 seconds
    const interval = setInterval(updateMetrics, 30000);

    return () => clearInterval(interval);
  }, [getMetrics]);

  return {
    checkRateLimit,
    adaptiveRateLimit,
    getMetrics,
    clearSuspiciousActivity,
    isSuspiciousActivity,
    resetRateLimit,
    metrics,
    defaultConfigs
  };
}