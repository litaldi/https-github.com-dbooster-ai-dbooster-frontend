
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from '@supabase/supabase-js';
import { RateLimiter } from '@/utils/rateLimiting';

const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export class EnhancedAuthService {
  private static instance: EnhancedAuthService;

  public static getInstance(): EnhancedAuthService {
    if (!EnhancedAuthService.instance) {
      EnhancedAuthService.instance = new EnhancedAuthService();
    }
    return EnhancedAuthService.instance;
  }

  async signIn(email: string, password: string) {
    try {
      rateLimiter.checkRateLimit(`signin_${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Enhanced auth sign in error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      rateLimiter.checkRateLimit(`signup_${email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Enhanced auth sign up error:', error);
      return { data: null, error: error as AuthError };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Enhanced auth sign out error:', error);
      return { error: error as AuthError };
    }
  }

  async resetPassword(email: string) {
    try {
      rateLimiter.checkRateLimit(`reset_${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Enhanced auth password reset error:', error);
      return { error: error as AuthError };
    }
  }
}

export const enhancedAuthService = EnhancedAuthService.getInstance();
