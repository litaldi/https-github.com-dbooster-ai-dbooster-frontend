
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  event_type: string;
  event_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 }, // 5 attempts per 15 min, block for 30 min
  signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }, // 3 attempts per hour, block for 1 hour
  password_reset: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  api_call: { maxAttempts: 100, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 }, // 100 calls per minute
};

export class SecurityService {
  private static instance: SecurityService;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  private getClientInfo() {
    return {
      ip_address: this.getClientIP(),
      user_agent: navigator.userAgent,
    };
  }

  private getClientIP(): string {
    // In a real application, this would come from the server
    // For now, we'll use a placeholder that would be set by the server
    return 'client-ip-placeholder';
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const clientInfo = this.getClientInfo();
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('security_audit_log').insert({
        user_id: user?.id || null,
        event_type: event.event_type,
        event_data: event.event_data || {},
        ip_address: event.ip_address || clientInfo.ip_address,
        user_agent: event.user_agent || clientInfo.user_agent,
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
      // Don't throw here to avoid breaking the main flow
    }
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    try {
      const config = RATE_LIMIT_CONFIGS[actionType] || RATE_LIMIT_CONFIGS.api_call;
      const now = new Date();
      const windowStart = new Date(now.getTime() - config.windowMs);

      // Get current rate limit record
      const { data: rateLimitRecord } = await supabase
        .from('rate_limit_tracking')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', actionType)
        .maybeSingle();

      // Check if currently blocked
      if (rateLimitRecord?.blocked_until && new Date(rateLimitRecord.blocked_until) > now) {
        const retryAfter = Math.ceil((new Date(rateLimitRecord.blocked_until).getTime() - now.getTime()) / 1000);
        await this.logSecurityEvent({
          event_type: 'rate_limit_blocked',
          event_data: { identifier, actionType, retryAfter }
        });
        return { allowed: false, retryAfter };
      }

      // Check if we need to reset the window
      const needsReset = !rateLimitRecord || 
        !rateLimitRecord.window_start || 
        new Date(rateLimitRecord.window_start) < windowStart;

      if (needsReset) {
        // Reset or create new record
        await supabase.from('rate_limit_tracking').upsert({
          identifier,
          action_type: actionType,
          attempt_count: 1,
          window_start: now.toISOString(),
          blocked_until: null,
        });
        return { allowed: true };
      }

      // Increment attempt count
      const newAttemptCount = (rateLimitRecord.attempt_count || 0) + 1;
      
      if (newAttemptCount > config.maxAttempts) {
        // Block the identifier
        const blockedUntil = new Date(now.getTime() + config.blockDurationMs);
        await supabase.from('rate_limit_tracking').update({
          attempt_count: newAttemptCount,
          blocked_until: blockedUntil.toISOString(),
          updated_at: now.toISOString(),
        }).eq('id', rateLimitRecord.id);

        await this.logSecurityEvent({
          event_type: 'rate_limit_exceeded',
          event_data: { identifier, actionType, attemptCount: newAttemptCount }
        });

        const retryAfter = Math.ceil(config.blockDurationMs / 1000);
        return { allowed: false, retryAfter };
      }

      // Update attempt count
      await supabase.from('rate_limit_tracking').update({
        attempt_count: newAttemptCount,
        updated_at: now.toISOString(),
      }).eq('id', rateLimitRecord.id);

      return { allowed: true };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // In case of error, allow the request to proceed
      return { allowed: true };
    }
  }

  async validateInput(input: any, schema: any): Promise<{ valid: boolean; errors?: string[] }> {
    const errors: string[] = [];

    try {
      // Basic validation rules
      if (schema.required && !input) {
        errors.push('Field is required');
        return { valid: false, errors };
      }

      if (schema.type === 'email' && input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          errors.push('Invalid email format');
        }
      }

      if (schema.type === 'phone' && input) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(input)) {
          errors.push('Invalid phone number format');
        }
      }

      if (schema.type === 'password' && input) {
        if (input.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }
        if (!/(?=.*[a-z])/.test(input)) {
          errors.push('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(input)) {
          errors.push('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(input)) {
          errors.push('Password must contain at least one number');
        }
      }

      if (schema.maxLength && input && input.length > schema.maxLength) {
        errors.push(`Field must be no more than ${schema.maxLength} characters`);
      }

      if (schema.minLength && input && input.length < schema.minLength) {
        errors.push(`Field must be at least ${schema.minLength} characters`);
      }

      // XSS prevention - basic sanitization check
      if (typeof input === 'string' && this.containsSuspiciousContent(input)) {
        errors.push('Input contains potentially harmful content');
      }

      return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
    } catch (error) {
      console.error('Input validation error:', error);
      return { valid: false, errors: ['Validation failed'] };
    }
  }

  private containsSuspiciousContent(input: string): boolean {
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>): Promise<void> {
    await this.logSecurityEvent({
      event_type: `auth_${eventType}`,
      event_data: {
        success,
        timestamp: new Date().toISOString(),
        ...details
      }
    });
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('event_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', oneHourAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!recentEvents) return false;

      // Check for suspicious patterns
      const failedLogins = recentEvents.filter(e => e.event_type === 'auth_login' && !e.event_data?.success).length;
      const multipleIPs = new Set(recentEvents.map(e => e.event_data?.ip_address)).size;
      
      return failedLogins > 3 || multipleIPs > 2;
    } catch (error) {
      console.error('Suspicious activity detection failed:', error);
      return false;
    }
  }
}

export const securityService = SecurityService.getInstance();
