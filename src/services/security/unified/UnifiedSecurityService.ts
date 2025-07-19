
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

interface SecurityValidation {
  isValid: boolean;
  threats: string[];
  sanitized: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface FormValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedData: Record<string, any>;
}

interface SessionInfo {
  sessionId: string;
  userId: string;
  isDemo: boolean;
  expiresAt: Date;
}

export class UnifiedSecurityService {
  private static instance: UnifiedSecurityService;

  static getInstance(): UnifiedSecurityService {
    if (!UnifiedSecurityService.instance) {
      UnifiedSecurityService.instance = new UnifiedSecurityService();
    }
    return UnifiedSecurityService.instance;
  }

  // Authentication Methods
  async secureLogin(email: string, password: string, options?: { rememberMe?: boolean }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await this.logAuthEvent('login_failed', false, { email, error: error.message });
        return { success: false, error: error.message };
      }

      await this.logAuthEvent('login_success', true, { email, userId: data.user?.id });
      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      productionLogger.error('Login error', error, 'UnifiedSecurityService');
      return { success: false, error: 'Login failed' };
    }
  }

  async secureSignup(email: string, password: string, metadata: { fullName: string; acceptedTerms: boolean }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            accepted_terms: metadata.acceptedTerms,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        await this.logAuthEvent('signup_failed', false, { email, error: error.message });
        return { success: false, error: error.message };
      }

      await this.logAuthEvent('signup_success', true, { email, userId: data.user?.id });
      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      productionLogger.error('Signup error', error, 'UnifiedSecurityService');
      return { success: false, error: 'Signup failed' };
    }
  }

  // Session Management
  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + (isDemo ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000));

    try {
      // Store session info securely
      const sessionInfo: SessionInfo = { sessionId, userId, isDemo, expiresAt };
      localStorage.setItem(`secure_session_${sessionId}`, JSON.stringify(sessionInfo));
      
      productionLogger.info('Secure session created', { sessionId: sessionId.substring(0, 8), isDemo });
      return sessionId;
    } catch (error) {
      productionLogger.error('Failed to create secure session', error, 'UnifiedSecurityService');
      throw error;
    }
  }

  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const storedSession = localStorage.getItem(`secure_session_${sessionId}`);
      if (!storedSession) return false;

      const sessionInfo: SessionInfo = JSON.parse(storedSession);
      return new Date() < new Date(sessionInfo.expiresAt);
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'UnifiedSecurityService');
      return false;
    }
  }

  // Input Validation
  async validateUserInput(input: string, context: string = 'general'): Promise<SecurityValidation> {
    const threats: string[] = [];
    let sanitized = input.trim();
    let riskLevel: SecurityValidation['riskLevel'] = 'low';

    // XSS Detection
    if (/<script|javascript:/i.test(input)) {
      threats.push('XSS attempt detected');
      riskLevel = 'high';
      sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
    }

    // SQL Injection Detection
    if (/('|(--)|;|\/\*|\*\/)/i.test(input)) {
      threats.push('SQL injection attempt detected');
      riskLevel = 'high';
    }

    // Basic sanitization
    sanitized = sanitized.replace(/[<>'"]/g, '');

    return {
      isValid: threats.length === 0,
      threats,
      sanitized,
      riskLevel
    };
  }

  async validateFormData(formData: Record<string, any>, context: string): Promise<FormValidationResult> {
    const errors: string[] = [];
    const sanitizedData: Record<string, any> = {};

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        const validation = await this.validateUserInput(value, `${context}.${key}`);
        if (!validation.isValid) {
          errors.push(...validation.threats);
        }
        sanitizedData[key] = validation.sanitized;
      } else {
        sanitizedData[key] = value;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitizedData
    };
  }

  // Monitoring and Logging
  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>) {
    try {
      productionLogger.secureInfo('Auth event', {
        eventType,
        success,
        timestamp: new Date().toISOString(),
        ...details
      }, 'UnifiedSecurityService');
    } catch (error) {
      productionLogger.error('Failed to log auth event', error, 'UnifiedSecurityService');
    }
  }

  async logSecurityEvent(event: any) {
    try {
      productionLogger.secureInfo('Security event', {
        ...event,
        timestamp: new Date().toISOString()
      }, 'UnifiedSecurityService');
    } catch (error) {
      productionLogger.error('Failed to log security event', error, 'UnifiedSecurityService');
    }
  }

  // Rate Limiting
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(action: string, identifier: string): { allowed: boolean; reason?: string } {
    const key = `${action}:${identifier}`;
    const now = Date.now();
    const limit = this.getRateLimitForAction(action);
    
    const record = this.rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      this.rateLimitStore.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
      return { allowed: true };
    }

    if (record.count >= limit) {
      return { allowed: false, reason: `Rate limit exceeded for ${action}` };
    }

    record.count++;
    return { allowed: true };
  }

  private getRateLimitForAction(action: string): number {
    const limits: Record<string, number> = {
      login: 5,
      signup: 3,
      api: 100,
      default: 10
    };
    return limits[action] || limits.default;
  }

  // Utility Methods
  sanitizeInput(input: string, context: string = 'general'): string {
    let sanitized = input.trim();
    
    switch (context) {
      case 'html':
        sanitized = sanitized.replace(/[<>]/g, '');
        break;
      case 'sql':
        sanitized = sanitized.replace(/[';-]/g, '');
        break;
      default:
        sanitized = sanitized.replace(/[<>'"]/g, '');
        break;
    }
    
    return sanitized;
  }
}

export const unifiedSecurityService = UnifiedSecurityService.getInstance();
