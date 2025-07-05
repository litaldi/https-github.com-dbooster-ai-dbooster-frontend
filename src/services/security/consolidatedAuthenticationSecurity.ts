import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';
import { rateLimitService } from './rateLimitService';

interface ConsolidatedAuthResult {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
  requiresVerification?: boolean;
}

interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSymbols: boolean;
  };
}

export class ConsolidatedAuthenticationSecurity {
  private static instance: ConsolidatedAuthenticationSecurity;

  static getInstance(): ConsolidatedAuthenticationSecurity {
    if (!ConsolidatedAuthenticationSecurity.instance) {
      ConsolidatedAuthenticationSecurity.instance = new ConsolidatedAuthenticationSecurity();
    }
    return ConsolidatedAuthenticationSecurity.instance;
  }

  async validateStrongPassword(password: string, email?: string): Promise<PasswordValidationResult> {
    const feedback: string[] = [];
    const requirements = {
      minLength: password.length >= 12,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSymbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    let score = 0;

    if (requirements.minLength) {
      score += 25;
    } else {
      feedback.push('Password must be at least 12 characters long');
    }

    if (requirements.hasUppercase) score += 20;
    else feedback.push('Password must contain uppercase letters');

    if (requirements.hasLowercase) score += 20;
    else feedback.push('Password must contain lowercase letters');

    if (requirements.hasNumbers) score += 20;
    else feedback.push('Password must contain numbers');

    if (requirements.hasSymbols) score += 15;
    else feedback.push('Password must contain special characters');

    // Check for email in password
    if (email && password.toLowerCase().includes(email.toLowerCase().split('@')[0])) {
      score -= 25;
      feedback.push('Password should not contain your email username');
    }

    // Check for common patterns
    const commonPatterns = [/123456/, /password/i, /qwerty/i, /abc123/i];
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        score -= 20;
        feedback.push('Password contains common weak patterns');
        break;
      }
    }

    score = Math.max(0, Math.min(100, score));

    return {
      isValid: score >= 80 && Object.values(requirements).every(req => req),
      score,
      feedback,
      requirements
    };
  }

  async secureLogin(email: string, password: string, options: {
    rememberMe?: boolean;
    deviceFingerprint?: string;
  } = {}): Promise<ConsolidatedAuthResult> {
    const identifier = `login:${email}`;
    
    try {
      // Rate limiting check
      const rateLimitResult = await rateLimitService.checkRateLimit(identifier, 'login');
      if (!rateLimitResult.allowed) {
        await auditLogger.logAuthEvent('login', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          reason: 'rate_limit_exceeded',
          retryAfter: rateLimitResult.retryAfter
        });

        return {
          success: false,
          error: `Too many login attempts. Please try again in ${rateLimitResult.retryAfter} seconds.`
        };
      }

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        await auditLogger.logAuthEvent('login', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message,
          deviceFingerprint: options.deviceFingerprint
        });

        return {
          success: false,
          error: this.sanitizeErrorMessage(error.message)
        };
      }

      // Success
      await auditLogger.logAuthEvent('login', true, {
        userId: data.user?.id,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        deviceFingerprint: options.deviceFingerprint
      });

      return {
        success: true,
        user: data.user,
        session: data.session,
        requiresVerification: !data.user?.email_confirmed_at
      };
    } catch (error) {
      productionLogger.error('Login error', error, 'ConsolidatedAuthenticationSecurity');
      return {
        success: false,
        error: 'An unexpected error occurred during login'
      };
    }
  }

  async secureSignup(email: string, password: string, metadata: {
    fullName?: string;
    acceptedTerms?: boolean;
  } = {}): Promise<ConsolidatedAuthResult> {
    try {
      // Validate password strength
      const passwordValidation = await this.validateStrongPassword(password, email);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: `Password requirements not met: ${passwordValidation.feedback.join(', ')}`
        };
      }

      // Rate limiting check
      const rateLimitResult = await rateLimitService.checkRateLimit(`signup:${email}`, 'signup');
      if (!rateLimitResult.allowed) {
        return {
          success: false,
          error: `Too many signup attempts. Please try again in ${rateLimitResult.retryAfter} seconds.`
        };
      }

      // Attempt signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            name: metadata.fullName,
            accepted_terms: metadata.acceptedTerms
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        await auditLogger.logAuthEvent('signup', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message
        });

        return {
          success: false,
          error: this.sanitizeErrorMessage(error.message)
        };
      }

      await auditLogger.logAuthEvent('signup', true, {
        userId: data.user?.id,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        requiresVerification: !data.session
      });

      return {
        success: true,
        user: data.user,
        session: data.session,
        requiresVerification: !data.session
      };
    } catch (error) {
      productionLogger.error('Signup error', error, 'ConsolidatedAuthenticationSecurity');
      return {
        success: false,
        error: 'An unexpected error occurred during signup'
      };
    }
  }

  async validateSessionSecurity(): Promise<boolean> {
    try {
      // Check if session is valid and secure
      const hasSecureConnection = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      
      // Check for session storage security
      const hasSessionData = !!sessionStorage.getItem('supabase.auth.token') || !!localStorage.getItem('supabase.auth.token');
      
      // Basic session validation
      return hasSecureConnection && hasSessionData;
    } catch (error) {
      console.error('Session security validation failed:', error);
      return false;
    }
  }

  private sanitizeErrorMessage(message: string): string {
    // Remove potentially sensitive information from error messages
    const sanitizedMessage = message
      .replace(/database|sql|postgres|supabase/gi, 'system')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[UUID]');

    // Common error message mappings
    const errorMappings: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password',
      'Email not confirmed': 'Please check your email and confirm your account',
      'User already registered': 'An account with this email already exists',
      'Signup not allowed': 'Account registration is currently unavailable'
    };

    return errorMappings[message] || sanitizedMessage;
  }

  generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage
    ];

    let hash = 0;
    const fingerprint = components.join('|');
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    return hash.toString(16);
  }
}

export const consolidatedAuthenticationSecurity = ConsolidatedAuthenticationSecurity.getInstance();
