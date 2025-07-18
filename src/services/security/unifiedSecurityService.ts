
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { securityAlertsService } from './securityAlertsService';
import { secureSessionManager } from './secureSessionManager';

interface InputValidationResult {
  valid: boolean;
  sanitized: string;
  issues: string[];
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  reason?: string;
}

class UnifiedSecurityService {
  private static instance: UnifiedSecurityService;

  static getInstance(): UnifiedSecurityService {
    if (!UnifiedSecurityService.instance) {
      UnifiedSecurityService.instance = new UnifiedSecurityService();
    }
    return UnifiedSecurityService.instance;
  }

  async validateInput(input: string, context: string = 'general'): Promise<InputValidationResult> {
    const issues: string[] = [];
    let sanitized = input;

    try {
      // Basic sanitization
      sanitized = input.trim();
      
      // Check for potential XSS patterns
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(sanitized)) {
          issues.push('Potential XSS content detected');
          sanitized = sanitized.replace(pattern, '');
        }
      }

      // Check for SQL injection patterns
      const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,
        /(\b(UNION|OR|AND)\b.*\b(SELECT|INSERT|UPDATE|DELETE)\b)/gi,
        /(--|\#|\/\*|\*\/)/g
      ];

      for (const pattern of sqlPatterns) {
        if (pattern.test(sanitized)) {
          issues.push('Potential SQL injection attempt detected');
          // Log security incident
          await securityAlertsService.createSecurityAlert({
            type: 'security_policy_violation',
            severity: 'high',
            message: 'SQL injection attempt detected in user input',
            metadata: { context, originalInput: input.substring(0, 100) }
          });
        }
      }

      // Context-specific validation
      switch (context) {
        case 'repository_id':
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(sanitized)) {
            issues.push('Invalid UUID format');
          }
          break;
        
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(sanitized)) {
            issues.push('Invalid email format');
          }
          break;
        
        case 'query_content':
          if (sanitized.length > 10000) {
            issues.push('Query content too long');
            sanitized = sanitized.substring(0, 10000);
          }
          break;
      }

      return {
        valid: issues.length === 0,
        sanitized,
        issues
      };

    } catch (error) {
      productionLogger.error('Input validation error', error, 'UnifiedSecurityService');
      return {
        valid: false,
        sanitized: '',
        issues: ['Validation error occurred']
      };
    }
  }

  async checkRateLimit(identifier: string, action: string = 'api'): Promise<RateLimitResult> {
    try {
      const windowSize = this.getRateLimitWindow(action);
      const maxAttempts = this.getRateLimitMax(action);
      const windowStart = new Date(Date.now() - windowSize);

      // Check current attempts in window
      const { data: existing, error } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', action)
        .single();

      if (error && error.code !== 'PGRST116') {
        productionLogger.error('Rate limit check error', error, 'UnifiedSecurityService');
        return { allowed: true, remaining: maxAttempts, resetTime: new Date() };
      }

      const now = new Date();
      let currentCount = 0;
      let resetTime = new Date(now.getTime() + windowSize);

      if (existing) {
        const windowStartTime = new Date(existing.window_start);
        if (now.getTime() - windowStartTime.getTime() < windowSize) {
          currentCount = existing.attempt_count;
          resetTime = new Date(windowStartTime.getTime() + windowSize);
        }
      }

      const allowed = currentCount < maxAttempts;
      
      if (!allowed) {
        await securityAlertsService.createSecurityAlert({
          type: 'rate_limit_exceeded',
          severity: 'medium',
          message: `Rate limit exceeded for action: ${action}`,
          metadata: { identifier, action, attempts: currentCount }
        });
      }

      // Update or insert rate limit record
      await this.updateRateLimitRecord(identifier, action, currentCount + 1, !allowed);

      return {
        allowed,
        remaining: Math.max(0, maxAttempts - currentCount - 1),
        resetTime,
        reason: allowed ? undefined : `Rate limit exceeded for ${action}. Try again later.`
      };

    } catch (error) {
      productionLogger.error('Rate limit check error', error, 'UnifiedSecurityService');
      return { allowed: true, remaining: 100, resetTime: new Date() };
    }
  }

  async logSecurityEvent(event: string, success: boolean, metadata?: Record<string, any>): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase
        .from('security_audit_log')
        .insert({
          event_type: event,
          user_id: user.user?.id,
          event_data: {
            success,
            ...metadata,
            timestamp: new Date().toISOString(),
            session_id: secureSessionManager.getCurrentSession()?.sessionId
          },
          ip_address: await this.getUserIP(),
          user_agent: navigator.userAgent
        });

      if (!success) {
        await securityAlertsService.createSecurityAlert({
          type: 'security_policy_violation',
          severity: 'medium',
          message: `Security event failed: ${event}`,
          userId: user.user?.id,
          metadata
        });
      }

    } catch (error) {
      productionLogger.error('Failed to log security event', error, 'UnifiedSecurityService');
    }
  }

  initializeSecurityHeaders(): void {
    if (typeof document !== 'undefined') {
      // Add security headers via meta tags if not set by server
      this.addMetaTag('X-Content-Type-Options', 'nosniff');
      this.addMetaTag('X-Frame-Options', 'DENY');
      this.addMetaTag('X-XSS-Protection', '1; mode=block');
      this.addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    }
  }

  private getRateLimitWindow(action: string): number {
    const windows: Record<string, number> = {
      login: 15 * 60 * 1000, // 15 minutes
      signup: 60 * 60 * 1000, // 1 hour
      api: 60 * 1000, // 1 minute
      repository_scan: 5 * 60 * 1000 // 5 minutes
    };
    return windows[action] || 60 * 1000;
  }

  private getRateLimitMax(action: string): number {
    const limits: Record<string, number> = {
      login: 5,
      signup: 3,
      api: 60,
      repository_scan: 10
    };
    return limits[action] || 100;
  }

  private async updateRateLimitRecord(identifier: string, action: string, count: number, blocked: boolean): Promise<void> {
    try {
      await supabase
        .from('rate_limit_tracking')
        .upsert({
          identifier,
          action_type: action,
          attempt_count: count,
          window_start: new Date().toISOString(),
          blocked_until: blocked ? new Date(Date.now() + this.getRateLimitWindow(action)).toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'identifier,action_type'
        });
    } catch (error) {
      productionLogger.error('Failed to update rate limit record', error, 'UnifiedSecurityService');
    }
  }

  private addMetaTag(name: string, content: string): void {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

export const unifiedSecurityService = UnifiedSecurityService.getInstance();
