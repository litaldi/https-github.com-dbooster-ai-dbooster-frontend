
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { inputValidationService } from '../inputValidationService';
import { secureErrorHandler } from '../secureErrorHandler';
import { secureStorageService } from '../secureStorageService';
import { secureSessionManager } from '../secureSessionManager';

interface SecurityConfig {
  enableRateLimit: boolean;
  enableInputValidation: boolean;
  enableSessionSecurity: boolean;
  enableErrorSanitization: boolean;
  strictMode: boolean;
}

interface SecurityEvent {
  type: string;
  success: boolean;
  data?: any;
  context?: string;
}

export class UnifiedSecurityService {
  private static instance: UnifiedSecurityService;
  private config: SecurityConfig = {
    enableRateLimit: true,
    enableInputValidation: true,
    enableSessionSecurity: true,
    enableErrorSanitization: true,
    strictMode: true
  };
  private initialized = false;

  static getInstance(): UnifiedSecurityService {
    if (!UnifiedSecurityService.instance) {
      UnifiedSecurityService.instance = new UnifiedSecurityService();
    }
    return UnifiedSecurityService.instance;
  }

  async initialize(config?: Partial<SecurityConfig>): Promise<void> {
    if (this.initialized) return;

    try {
      if (config) {
        this.config = { ...this.config, ...config };
      }

      // Initialize secure storage
      await secureStorageService.initialize();

      // Set up security headers
      await this.setupSecurityHeaders();

      // Initialize rate limiting
      if (this.config.enableRateLimit) {
        await this.initializeRateLimit();
      }

      this.initialized = true;
      productionLogger.info('Unified Security Service initialized', this.config, 'UnifiedSecurityService');

    } catch (error) {
      productionLogger.error('Failed to initialize security service', error, 'UnifiedSecurityService');
      throw error;
    }
  }

  async validateInput(input: string, context: string = 'general') {
    if (!this.config.enableInputValidation) {
      return {
        isValid: true,
        hasThreats: false,
        threatTypes: [],
        sanitizedInput: input,
        riskLevel: 'low' as const,
        blocked: false
      };
    }

    try {
      const result = await inputValidationService.validateInput(input, context);
      return {
        isValid: result.isValid,
        hasThreats: result.threatTypes.length > 0,
        threatTypes: result.threatTypes,
        sanitizedInput: result.sanitizedInput,
        riskLevel: result.riskLevel,
        blocked: result.blocked
      };
    } catch (error) {
      productionLogger.error('Input validation failed', error, 'UnifiedSecurityService');
      return {
        isValid: false,
        hasThreats: true,
        threatTypes: ['validation_error'],
        sanitizedInput: '',
        riskLevel: 'critical' as const,
        blocked: true
      };
    }
  }

  sanitizeError(error: unknown, context: string) {
    if (!this.config.enableErrorSanitization) {
      // In non-sanitization mode, still provide basic error handling
      return {
        message: error instanceof Error ? error.message : String(error),
        code: 'UNSANITIZED_ERROR',
        timestamp: new Date().toISOString()
      };
    }

    return secureErrorHandler.sanitizeError(error, context);
  }

  async validateSession(sessionId: string): Promise<boolean> {
    if (!this.config.enableSessionSecurity) {
      return true; // Skip validation if disabled
    }

    try {
      return await secureSessionManager.validateSession(sessionId);
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'UnifiedSecurityService');
      return false;
    }
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    if (!this.config.enableSessionSecurity) {
      // Return a simple session ID if security is disabled
      return crypto.randomUUID();
    }

    return await secureSessionManager.createSecureSession(userId, isDemo);
  }

  async checkRateLimit(identifier: string, action: string = 'api'): Promise<{ allowed: boolean; reason?: string }> {
    if (!this.config.enableRateLimit) {
      return { allowed: true };
    }

    try {
      const { data, error } = await supabase
        .from('rate_limit_tracking')
        .select('attempt_count, window_start, blocked_until')
        .eq('identifier', identifier)
        .eq('action_type', action)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      const now = new Date();
      const windowSize = 60 * 1000; // 1 minute window
      const maxAttempts = action === 'login' ? 5 : 10;

      if (data) {
        const windowStart = new Date(data.window_start);
        const isInCurrentWindow = now.getTime() - windowStart.getTime() < windowSize;

        if (data.blocked_until && new Date(data.blocked_until) > now) {
          return { allowed: false, reason: 'Rate limit exceeded, temporarily blocked' };
        }

        if (isInCurrentWindow && data.attempt_count >= maxAttempts) {
          // Block for increasing durations
          const blockDuration = Math.min(data.attempt_count * 60 * 1000, 30 * 60 * 1000); // Max 30 minutes
          const blockedUntil = new Date(now.getTime() + blockDuration);

          await supabase
            .from('rate_limit_tracking')
            .update({
              attempt_count: data.attempt_count + 1,
              blocked_until: blockedUntil.toISOString(),
              updated_at: now.toISOString()
            })
            .eq('identifier', identifier)
            .eq('action_type', action);

          return { allowed: false, reason: 'Rate limit exceeded' };
        }

        if (isInCurrentWindow) {
          // Increment attempt count
          await supabase
            .from('rate_limit_tracking')
            .update({
              attempt_count: data.attempt_count + 1,
              updated_at: now.toISOString()
            })
            .eq('identifier', identifier)
            .eq('action_type', action);
        } else {
          // Reset window
          await supabase
            .from('rate_limit_tracking')
            .update({
              attempt_count: 1,
              window_start: now.toISOString(),
              blocked_until: null,
              updated_at: now.toISOString()
            })
            .eq('identifier', identifier)
            .eq('action_type', action);
        }
      } else {
        // Create new rate limit record
        await supabase
          .from('rate_limit_tracking')
          .insert({
            identifier,
            action_type: action,
            attempt_count: 1,
            window_start: now.toISOString()
          });
      }

      return { allowed: true };
    } catch (error) {
      productionLogger.error('Rate limit check failed', error, 'UnifiedSecurityService');
      return { allowed: this.config.strictMode ? false : true };
    }
  }

  async logSecurityEvent(type: string, success: boolean, data?: any, context?: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase.from('comprehensive_security_log').insert({
        user_id: user.user?.id,
        event_type: type,
        event_category: context || 'general',
        severity: success ? 'info' : 'warning',
        event_data: data,
        ip_address: await this.getUserIP(),
        user_agent: navigator.userAgent
      });
    } catch (error) {
      productionLogger.error('Failed to log security event', error, 'UnifiedSecurityService');
    }
  }

  private async setupSecurityHeaders(): Promise<void> {
    try {
      // Call the security headers edge function to validate setup
      await supabase.functions.invoke('security-headers', {
        body: { action: 'validate_headers' }
      });
      
      productionLogger.info('Security headers validated', {}, 'UnifiedSecurityService');
    } catch (error) {
      productionLogger.warn('Security headers validation failed', error, 'UnifiedSecurityService');
    }
  }

  private async initializeRateLimit(): Promise<void> {
    try {
      // Clean up old rate limit records
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      await supabase
        .from('rate_limit_tracking')
        .delete()
        .lt('updated_at', oneHourAgo.toISOString());
      
      productionLogger.info('Rate limiting initialized', {}, 'UnifiedSecurityService');
    } catch (error) {
      productionLogger.warn('Rate limit cleanup failed', error, 'UnifiedSecurityService');
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

  // Get security status
  getSecurityStatus() {
    return {
      initialized: this.initialized,
      config: this.config,
      timestamp: new Date().toISOString()
    };
  }

  // Emergency security lockdown
  async emergencyLockdown(reason: string): Promise<void> {
    try {
      // Clear all secure storage
      secureStorageService.clearAllSecureItems();
      
      // Log the lockdown
      await this.logSecurityEvent('emergency_lockdown', true, { reason }, 'security');
      
      productionLogger.warn('Emergency security lockdown activated', { reason }, 'UnifiedSecurityService');
    } catch (error) {
      productionLogger.error('Emergency lockdown failed', error, 'UnifiedSecurityService');
    }
  }
}

export const unifiedSecurityService = UnifiedSecurityService.getInstance();
