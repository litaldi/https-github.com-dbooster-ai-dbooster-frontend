
import { supabase } from '@/integrations/supabase/client';
import { RateLimiter } from '@/utils/rateLimiting';

export class AuthMethods {
  private rateLimiter: RateLimiter;

  constructor(rateLimiter: RateLimiter) {
    this.rateLimiter = rateLimiter;
  }

  async loginWithOAuth(provider: 'github' | 'google'): Promise<void> {
    this.rateLimiter.checkRateLimit();
    console.log(`Attempting to sign in with ${provider}`);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/`,
        scopes: provider === 'github' ? 'repo read:user user:email' : undefined,
      },
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    console.log('OAuth login initiated:', data);
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    this.rateLimiter.checkRateLimit();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.error('Email login error:', error);
      throw new Error(error.message || 'Invalid email or password');
    }

    console.log('Email login successful:', data.user?.email);
  }

  async loginWithPhone(phone: string, password: string): Promise<void> {
    this.rateLimiter.checkRateLimit();
    
    // Clean phone number (remove spaces, dashes, parentheses)
    const cleanPhone = phone.replace(/\D/g, '');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: `+${cleanPhone}`,
      password,
    });

    if (error) {
      console.error('Phone login error:', error);
      throw new Error(error.message || 'Invalid phone number or password');
    }

    console.log('Phone login successful:', data.user?.phone);
  }

  async signupWithEmail(email: string, password: string, name: string): Promise<void> {
    this.rateLimiter.checkRateLimit();
    
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: name.trim(),
          name: name.trim(),
        }
      }
    });

    if (error) {
      console.error('Email signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }

    if (data.user && !data.session) {
      throw new Error('Please check your email to confirm your account');
    }

    console.log('Email signup successful:', data.user?.email);
  }

  async signupWithPhone(phone: string, password: string, name: string): Promise<void> {
    this.rateLimiter.checkRateLimit();
    
    // Clean phone number (remove spaces, dashes, parentheses)
    const cleanPhone = phone.replace(/\D/g, '');
    
    const { data, error } = await supabase.auth.signUp({
      phone: `+${cleanPhone}`,
      password,
      options: {
        data: {
          full_name: name.trim(),
          name: name.trim(),
        }
      }
    });

    if (error) {
      console.error('Phone signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }

    if (data.user && !data.session) {
      throw new Error('Please check your phone for a verification code');
    }

    console.log('Phone signup successful:', data.user?.phone);
  }

  async logout(): Promise<void> {
    console.log('Signing out...');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
    
    console.log('Successfully signed out');
  }
}
