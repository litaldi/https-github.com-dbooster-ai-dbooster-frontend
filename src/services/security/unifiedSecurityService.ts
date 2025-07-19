
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
      // Fallback to basic session creation
      const sessionId = crypto.randomUUID();
      if (isDemo) {
        // For demo sessions, still encrypt the storage even if session security is disabled
        const sessionData = {
          id: sessionId,
          userId,
          isDemo,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour for demo
        };
        
        try {
          // Use basic encryption for demo session data
          const encryptedData = await this.basicEncryptSessionData(sessionData);
          localStorage.setItem(`demo_session_${sessionId}`, encryptedData);
        } catch (error) {
          productionLogger.error('Failed to encrypt demo session data', error, 'UnifiedSecurityService');
          // Fall back to unencrypted storage as last resort
          localStorage.setItem(`demo_session_${sessionId}`, JSON.stringify(sessionData));
        }
      }
      return sessionId;
    }

    return await secureSessionManager.createSecureSession(userId, isDemo);
  }

  async validateSession(sessionId: string): Promise<boolean> {
    if (!this.config.enableSessionSecurity) {
      // Basic validation for fallback mode
      const sessionData = localStorage.getItem(`demo_session_${sessionId}`);
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          return new Date() < new Date(session.expiresAt);
        } catch {
          return false;
        }
      }
      return true; // Allow regular sessions in fallback mode
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
    // Add CSP meta tag if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://api.ipify.org; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' https://api.ipify.org https://*.supabase.co wss://*.supabase.co;";
      document.head.appendChild(cspMeta);
    }

    // Add other security headers via meta tags
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityHeaders.forEach(header => {
      if (!document.querySelector(`meta[http-equiv="${header.name}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = header.name;
        meta.content = header.content;
        document.head.appendChild(meta);
      }
    });
  }

  private async basicEncryptSessionData(sessionData: any): Promise<string> {
    try {
      // Generate a simple key from user agent and timestamp for basic encryption
      const keyMaterial = navigator.userAgent + Date.now().toString();
      const encoder = new TextEncoder();
      const keyData = encoder.encode(keyMaterial);
      
      const key = await crypto.subtle.importKey(
        'raw',
        keyData.slice(0, 32), // Use first 32 bytes
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = encoder.encode(JSON.stringify(sessionData));
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
      );

      return JSON.stringify({
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData)),
        timestamp: Date.now()
      });
    } catch (error) {
      productionLogger.error('Basic session encryption failed', error, 'UnifiedSecurityService');
      throw error;
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
