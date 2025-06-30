
import { supabase } from '@/integrations/supabase/client';
import { rateLimitService } from '@/services/security/rateLimitService';
import { normalizeEmail, cleanPhoneNumber, getAuthRedirectUrl, createUserMetadata } from '@/utils/authUtils';
import { AUTH_CONFIG, type OAuthProvider } from '@/config/auth';
import type { AuthResult, AuthCredentials } from '@/types/auth';

export class AuthMethods {
  private async checkRateLimit(identifier: string, action: string): Promise<void> {
    const result = await rateLimitService.checkRateLimit(identifier, action);
    if (!result.allowed) {
      throw new Error(`Rate limit exceeded. Try again in ${result.retryAfter} seconds.`);
    }
  }

  private handleAuthError(error: any, context: string): never {
    console.error(`${context} error:`, error);
    throw new Error(error.message || `${context} failed`);
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<void> {
    await this.checkRateLimit(`oauth_${provider}`, 'login');
    console.log(`Attempting to sign in with ${provider}`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getAuthRedirectUrl(),
        scopes: provider === 'github' ? 'repo read:user user:email' : undefined,
      },
    });

    if (error) {
      this.handleAuthError(error, 'OAuth login');
    }

    console.log('OAuth login initiated:', data);
  }

  async loginWithCredentials(credentials: AuthCredentials): Promise<void> {
    const identifier = credentials.email || credentials.phone || 'unknown';
    await this.checkRateLimit(identifier, 'login');
    
    const { email, phone, password } = credentials;
    const loginData = email 
      ? { email: normalizeEmail(email), password }
      : { phone: `+${cleanPhoneNumber(phone!)}`, password };

    const { data, error } = await supabase.auth.signInWithPassword(loginData);

    if (error) {
      this.handleAuthError(error, email ? 'Email login' : 'Phone login');
    }

    console.log(`${email ? 'Email' : 'Phone'} login successful:`, email || phone);
  }

  async signupWithCredentials(credentials: AuthCredentials): Promise<void> {
    const identifier = credentials.email || credentials.phone || 'unknown';
    await this.checkRateLimit(identifier, 'signup');
    
    const { email, phone, password, name } = credentials;
    const signupData = email 
      ? { 
          email: normalizeEmail(email), 
          password,
          options: createUserMetadata(name!)
        }
      : { 
          phone: `+${cleanPhoneNumber(phone!)}`, 
          password,
          options: createUserMetadata(name!)
        };

    const { data, error } = await supabase.auth.signUp(signupData);

    if (error) {
      this.handleAuthError(error, email ? 'Email signup' : 'Phone signup');
    }

    if (data.user && !data.session) {
      const message = email 
        ? 'Please check your email to confirm your account'
        : 'Please check your phone for a verification code';
      throw new Error(message);
    }

    console.log(`${email ? 'Email' : 'Phone'} signup successful:`, email || phone);
  }

  async logout(): Promise<void> {
    console.log('Signing out...');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      this.handleAuthError(error, 'Logout');
    }
    
    console.log('Successfully signed out');
  }
}
