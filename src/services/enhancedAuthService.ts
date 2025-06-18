
import { AuthService } from '@/services/authService';
import { securityService } from '@/services/securityService';
import { enhancedRateLimiter } from '@/utils/enhancedRateLimiting';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import type { OAuthProvider, AuthCredentials } from '@/types/auth';

export class EnhancedAuthService extends AuthService {
  private async validateAuthInput(credentials: AuthCredentials): Promise<{ valid: boolean; errors?: string[] }> {
    const errors: string[] = [];

    if (credentials.email) {
      const emailValidation = await securityService.validateInput(credentials.email, {
        type: 'email',
        required: true,
        maxLength: 320
      });
      if (!emailValidation.valid && emailValidation.errors) {
        errors.push(...emailValidation.errors);
      }
    }

    if (credentials.phone) {
      const phoneValidation = await securityService.validateInput(credentials.phone, {
        type: 'phone',
        required: true,
        maxLength: 20
      });
      if (!phoneValidation.valid && phoneValidation.errors) {
        errors.push(...phoneValidation.errors);
      }
    }

    if (credentials.password) {
      const passwordValidation = await securityService.validateInput(credentials.password, {
        type: 'password',
        required: true,
        minLength: 8,
        maxLength: 128
      });
      if (!passwordValidation.valid && passwordValidation.errors) {
        errors.push(...passwordValidation.errors);
      }
    }

    if (credentials.name) {
      const nameValidation = await securityService.validateInput(credentials.name, {
        type: 'text',
        required: true,
        maxLength: 100
      });
      if (!nameValidation.valid && nameValidation.errors) {
        errors.push(...nameValidation.errors);
      }
    }

    return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
  }

  private sanitizeCredentials(credentials: AuthCredentials): AuthCredentials {
    return {
      email: credentials.email ? securityService.sanitizeInput(credentials.email) : undefined,
      phone: credentials.phone ? securityService.sanitizeInput(credentials.phone) : undefined,
      password: credentials.password, // Don't sanitize passwords
      name: credentials.name ? securityService.sanitizeInput(credentials.name) : undefined,
    };
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    // Check rate limit
    const rateLimitCheck = await enhancedRateLimiter.checkRateLimit('login');
    if (!rateLimitCheck.allowed) {
      const message = `Too many login attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`;
      enhancedToast.error({ title: 'Rate Limited', description: message });
      throw new Error(message);
    }

    try {
      await securityService.logAuthEvent('oauth_attempt', true, { provider });
      await super.loginWithOAuth(provider);
      await securityService.logAuthEvent('oauth_success', true, { provider });
    } catch (error) {
      await securityService.logAuthEvent('oauth_failure', false, { provider, error: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }

  async loginWithCredentials(credentials: AuthCredentials): Promise<void> {
    // Check rate limit
    const rateLimitCheck = await enhancedRateLimiter.checkRateLimit('login');
    if (!rateLimitCheck.allowed) {
      const message = `Too many login attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`;
      enhancedToast.error({ title: 'Rate Limited', description: message });
      throw new Error(message);
    }

    // Validate input
    const validation = await this.validateAuthInput(credentials);
    if (!validation.valid) {
      const message = validation.errors?.join(', ') || 'Invalid input';
      enhancedToast.error({ title: 'Validation Error', description: message });
      throw new Error(message);
    }

    // Sanitize input
    const sanitizedCredentials = this.sanitizeCredentials(credentials);

    try {
      await securityService.logAuthEvent('login_attempt', true, { 
        method: credentials.email ? 'email' : 'phone',
        email: credentials.email 
      });
      
      await super.loginWithCredentials(sanitizedCredentials);
      
      await securityService.logAuthEvent('login_success', true, { 
        method: credentials.email ? 'email' : 'phone' 
      });
      
      // Reset rate limit on successful login
      await enhancedRateLimiter.resetRateLimit('login');
    } catch (error) {
      await securityService.logAuthEvent('login_failure', false, { 
        method: credentials.email ? 'email' : 'phone',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async signupWithCredentials(credentials: AuthCredentials): Promise<void> {
    // Check rate limit
    const rateLimitCheck = await enhancedRateLimiter.checkRateLimit('signup');
    if (!rateLimitCheck.allowed) {
      const message = `Too many signup attempts. Please try again in ${rateLimitCheck.retryAfter} seconds.`;
      enhancedToast.error({ title: 'Rate Limited', description: message });
      throw new Error(message);
    }

    // Validate input
    const validation = await this.validateAuthInput(credentials);
    if (!validation.valid) {
      const message = validation.errors?.join(', ') || 'Invalid input';
      enhancedToast.error({ title: 'Validation Error', description: message });
      throw new Error(message);
    }

    // Sanitize input
    const sanitizedCredentials = this.sanitizeCredentials(credentials);

    try {
      await securityService.logAuthEvent('signup_attempt', true, { 
        method: credentials.email ? 'email' : 'phone',
        email: credentials.email 
      });
      
      await super.signupWithCredentials(sanitizedCredentials);
      
      await securityService.logAuthEvent('signup_success', true, { 
        method: credentials.email ? 'email' : 'phone' 
      });
    } catch (error) {
      await securityService.logAuthEvent('signup_failure', false, { 
        method: credentials.email ? 'email' : 'phone',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async logout(isDemo: boolean = false): Promise<void> {
    try {
      await securityService.logAuthEvent('logout_attempt', true, { isDemo });
      await super.logout(isDemo);
      await securityService.logAuthEvent('logout_success', true, { isDemo });
    } catch (error) {
      await securityService.logAuthEvent('logout_failure', false, { 
        isDemo,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

export const enhancedAuthService = new EnhancedAuthService();
