
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: { message: string };
}

export class UnifiedAuthService {
  private static instance: UnifiedAuthService;

  static getInstance(): UnifiedAuthService {
    if (!UnifiedAuthService.instance) {
      UnifiedAuthService.instance = new UnifiedAuthService();
    }
    return UnifiedAuthService.instance;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      logger.info('Attempting sign in', { email }, 'UnifiedAuthService');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        logger.error('Sign in failed', error, 'UnifiedAuthService');
        return { error: { message: error.message } };
      }

      logger.info('Sign in successful', { userId: data.user?.id }, 'UnifiedAuthService');
      return { user: data.user, session: data.session };
    } catch (error: any) {
      logger.error('Sign in error', error, 'UnifiedAuthService');
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  async signUp(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      logger.info('Attempting sign up', { email: credentials.email }, 'UnifiedAuthService');
      
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name || '',
            name: credentials.name || ''
          }
        }
      });

      if (error) {
        logger.error('Sign up failed', error, 'UnifiedAuthService');
        return { error: { message: error.message } };
      }

      logger.info('Sign up successful', { userId: data.user?.id }, 'UnifiedAuthService');
      return { user: data.user, session: data.session };
    } catch (error: any) {
      logger.error('Sign up error', error, 'UnifiedAuthService');
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  async signOut(): Promise<{ error?: { message: string } }> {
    try {
      logger.info('Attempting sign out', {}, 'UnifiedAuthService');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('Sign out failed', error, 'UnifiedAuthService');
        return { error: { message: error.message } };
      }

      logger.info('Sign out successful', {}, 'UnifiedAuthService');
      return {};
    } catch (error: any) {
      logger.error('Sign out error', error, 'UnifiedAuthService');
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  }

  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      logger.error('Get session error', error, 'UnifiedAuthService');
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      logger.error('Get user error', error, 'UnifiedAuthService');
      return null;
    }
  }
}

export const unifiedAuthService = UnifiedAuthService.getInstance();
