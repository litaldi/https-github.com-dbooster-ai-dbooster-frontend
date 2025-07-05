
import { enhancedProductionLogger } from '@/utils/enhancedProductionLogger';

interface SecurityConfig {
  maxInputLength: Record<string, number>;
  rateLimits: Record<string, { windowMs: number; maxRequests: number; blockDurationMs: number }>;
  csp: {
    nonce: string;
    policy: string;
  };
  validation: {
    email: { maxLength: number; pattern: RegExp };
    password: { minLength: number; maxLength: number; pattern: RegExp };
    general: { maxLength: number };
  };
}

export class EnhancedSecurityConfigService {
  private static instance: EnhancedSecurityConfigService;
  private config: SecurityConfig;

  constructor() {
    this.config = {
      maxInputLength: {
        email: 254,
        password: 128,
        firstName: 50,
        lastName: 50,
        general: 1000,
        textArea: 5000,
        url: 2048
      },
      rateLimits: {
        auth: { windowMs: 300000, maxRequests: 3, blockDurationMs: 900000 }, // 3 attempts per 5min, 15min block
        api: { windowMs: 60000, maxRequests: 60, blockDurationMs: 300000 }, // 60 req/min, 5min block
        form: { windowMs: 60000, maxRequests: 15, blockDurationMs: 60000 }, // 15 req/min, 1min block
        search: { windowMs: 60000, maxRequests: 30, blockDurationMs: 120000 } // 30 req/min, 2min block
      },
      csp: {
        nonce: this.generateNonce(),
        policy: this.generateCSPPolicy()
      },
      validation: {
        email: {
          maxLength: 254,
          pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        },
        password: {
          minLength: 8,
          maxLength: 128,
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
        },
        general: {
          maxLength: 1000
        }
      }
    };
  }

  static getInstance(): EnhancedSecurityConfigService {
    if (!EnhancedSecurityConfigService.instance) {
      EnhancedSecurityConfigService.instance = new EnhancedSecurityConfigService();
    }
    return EnhancedSecurityConfigService.instance;
  }

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private generateCSPPolicy(): string {
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${this.config.csp.nonce}' 'strict-dynamic'`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ');
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  getNonce(): string {
    return this.config.csp.nonce;
  }

  getCSPPolicy(): string {
    return this.config.csp.policy;
  }

  validateInputLength(input: string, type: string = 'general'): { isValid: boolean; maxLength: number; actualLength: number } {
    const maxLength = this.config.maxInputLength[type] || this.config.maxInputLength.general;
    const actualLength = input.length;
    
    return {
      isValid: actualLength <= maxLength,
      maxLength,
      actualLength
    };
  }

  getRateLimit(action: string) {
    return this.config.rateLimits[action] || this.config.rateLimits.api;
  }

  validateEmail(email: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const validation = this.config.validation.email;

    if (!email) {
      errors.push('Email is required');
    } else {
      if (email.length > validation.maxLength) {
        errors.push(`Email must be less than ${validation.maxLength} characters`);
      }
      if (!validation.pattern.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  validatePassword(password: string): { isValid: boolean; errors: string[]; strength: 'weak' | 'medium' | 'strong' } {
    const errors: string[] = [];
    const validation = this.config.validation.password;
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < validation.minLength) {
        errors.push(`Password must be at least ${validation.minLength} characters long`);
      }
      if (password.length > validation.maxLength) {
        errors.push(`Password must be less than ${validation.maxLength} characters`);
      }

      // Strength calculation
      let strengthScore = 0;
      if (password.length >= 8) strengthScore++;
      if (/[a-z]/.test(password)) strengthScore++;
      if (/[A-Z]/.test(password)) strengthScore++;
      if (/\d/.test(password)) strengthScore++;
      if (/[@$!%*?&]/.test(password)) strengthScore++;
      if (password.length >= 12) strengthScore++;

      if (strengthScore >= 5) strength = 'strong';
      else if (strengthScore >= 3) strength = 'medium';

      if (strengthScore < 4) {
        errors.push('Password must contain uppercase, lowercase, number, and special character');
      }
    }

    return { isValid: errors.length === 0, errors, strength };
  }

  applySecurityHeaders(): void {
    try {
      // Apply CSP header
      const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (existingCSP) {
        existingCSP.remove();
      }

      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = this.getCSPPolicy();
      document.head.appendChild(cspMeta);

      // Apply additional security headers
      const securityHeaders = [
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        { name: 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains; preload' }
      ];

      securityHeaders.forEach(({ name, content }) => {
        const existing = document.querySelector(`meta[http-equiv="${name}"]`);
        if (existing) {
          existing.remove();
        }

        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      });

      enhancedProductionLogger.secureInfo('Enhanced security headers applied successfully', {}, 'EnhancedSecurityConfig');
    } catch (error) {
      enhancedProductionLogger.error('Failed to apply enhanced security headers', error, 'EnhancedSecurityConfig');
    }
  }

  enforceHTTPS(): void {
    if (import.meta.env.PROD && window.location.protocol !== 'https:') {
      enhancedProductionLogger.warn('Redirecting to HTTPS for security', {}, 'EnhancedSecurityConfig');
      window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
    }
  }
}

export const enhancedSecurityConfig = EnhancedSecurityConfigService.getInstance();
