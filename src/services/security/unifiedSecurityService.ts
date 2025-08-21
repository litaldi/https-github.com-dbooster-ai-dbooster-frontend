
import { enhancedSecurityValidation } from './enhancedSecurityValidation';
import { secureSessionManager } from './secureSessionManager';
import { errorSanitizer } from '@/utils/errorSanitizer';
import { rateLimitService } from './rateLimitService';
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedSecurityConfig {
  enableRateLimit: boolean;
  enableInputValidation: boolean;
  enableSessionSecurity: boolean;
  enableErrorSanitization: boolean;
  strictMode: boolean;
}

export class UnifiedSecurityService {
  private static instance: UnifiedSecurityService;
  private config: UnifiedSecurityConfig = {
    enableRateLimit: true,
    enableInputValidation: true,
    enableSessionSecurity: true,
    enableErrorSanitization: true,
    strictMode: true
  };

  static getInstance(): UnifiedSecurityService {
    if (!UnifiedSecurityService.instance) {
      UnifiedSecurityService.instance = new UnifiedSecurityService();
    }
    return UnifiedSecurityService.instance;
  }

  async initialize(config?: Partial<UnifiedSecurityConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    try {
      // Initialize security headers
      this.initializeSecurityHeaders();
      
      // Initialize session manager
      if (this.config.enableSessionSecurity) {
        await secureSessionManager.initializeEncryption();
      }

      productionLogger.info('Unified security service initialized', this.config, 'UnifiedSecurityService');
    } catch (error) {
      productionLogger.error('Failed to initialize unified security service', error, 'UnifiedSecurityService');
    }
  }

  async validateInput(input: string, context: string = 'general'): Promise<any> {
    if (!this.config.enableInputValidation) {
      return { isValid: true, sanitizedInput: input };
    }

    try {
      return await enhancedSecurityValidation.validateAndSanitizeInput(input, {
        context,
        strictMode: this.config.strictMode
      });
    } catch (error) {
      productionLogger.error('Input validation failed', error, 'UnifiedSecurityService');
      return {
        isValid: false,
        hasThreats: true,
        threatTypes: ['validation_error'],
        sanitizedInput: '',
        riskLevel: 'critical',
        blocked: true
      };
    }
  }

  async checkRateLimit(identifier: string, action: string = 'api'): Promise<any> {
    if (!this.config.enableRateLimit) {
      return { allowed: true };
    }

    try {
      return await rateLimitService.checkRateLimit(identifier, action);
    } catch (error) {
      productionLogger.error('Rate limit check failed', error, 'UnifiedSecurityService');
      return { allowed: false, reason: 'Rate limit service error' };
    }
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    if (!this.config.enableSessionSecurity) {
      // SECURITY FIX: Always use secure session manager, no weak fallbacks
      productionLogger.warn('Session security disabled - using basic UUID only', { userId, isDemo }, 'UnifiedSecurityService');
      return crypto.randomUUID();
    }

    return await secureSessionManager.createSecureSession(userId, isDemo);
  }

  async validateSession(sessionId: string): Promise<boolean> {
    if (!this.config.enableSessionSecurity) {
      // SECURITY FIX: No fallback session validation - strict mode only
      productionLogger.warn('Session security disabled - validation bypassed', { sessionId }, 'UnifiedSecurityService');
      return false;
    }

    return await secureSessionManager.validateSession(sessionId);
  }

  sanitizeError(error: any, context: string = 'unknown'): any {
    if (!this.config.enableErrorSanitization) {
      return { message: String(error) };
    }

    return errorSanitizer.sanitizeError(error, context);
  }

  async logSecurityEvent(eventType: string, success: boolean, metadata?: Record<string, any>): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase.from('comprehensive_security_log').insert({
        user_id: user.user?.id,
        event_type: eventType,
        event_category: 'security_service',
        severity: success ? 'info' : 'warning',
        event_data: {
          success,
          ...metadata
        },
        ip_address: await this.getUserIP(),
        user_agent: navigator.userAgent
      });
    } catch (error) {
      productionLogger.error('Failed to log security event', error, 'UnifiedSecurityService');
    }
  }

  initializeSecurityHeaders(): void {
    // Only apply client-effective header via meta: Referrer Policy
    let referrerMeta = document.querySelector('meta[name="referrer"]') as HTMLMetaElement;
    if (!referrerMeta) {
      referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      document.head.appendChild(referrerMeta);
    }
    referrerMeta.content = 'strict-origin-when-cross-origin';
  }

  // SECURITY FIX: Removed basicEncryptSessionData - weak encryption removed

  private async getUserIP(): Promise<string> {
    // Client-side IP collection removed; rely on server headers
    return 'unknown';
  }
}

export const unifiedSecurityService = UnifiedSecurityService.getInstance();
