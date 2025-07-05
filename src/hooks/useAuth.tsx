
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { securityService } from '@/services/securityService';
import { cleanupAuthState } from '@/utils/authUtils';
import type { User, Session, AuthState } from '@/types';
import type { AuthError } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  secureLogin: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  secureSignup: (email: string, password: string, name: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
  });

  const updateAuthState = useCallback((session: Session | null) => {
    setAuthState(prev => ({
      ...prev,
      user: session?.user || null,
      session,
      loading: false,
      initialized: true,
    }));
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        updateAuthState(session as Session | null);
        
        if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            securityService.logAuthEvent('login', true, {
              userId: session.user.id,
              timestamp: new Date().toISOString(),
            });
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAuthState(session as Session | null);
    });

    return () => subscription.unsubscribe();
  }, [updateAuthState]);

  const signIn = useCallback(async (
    email: string, 
    password: string, 
    options: { rememberMe?: boolean } = {}
  ): Promise<{ error?: string }> => {
    try {
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        await securityService.logAuthEvent('login', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message,
        });
        return { error: error.message };
      }

      if (options.rememberMe) {
        localStorage.setItem('dbooster_remember_me', 'true');
        localStorage.setItem('dbooster_email', email);
      }

      return {};
    } catch (err) {
      const error = err as AuthError;
      return { error: error.message || 'An error occurred during sign in' };
    }
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    name: string,
    acceptedTerms: boolean
  ): Promise<{ error?: string }> => {
    if (!acceptedTerms) {
      return { error: 'You must accept the terms and conditions' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            full_name: name,
            name,
            accepted_terms: acceptedTerms,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        await securityService.logAuthEvent('signup', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message,
        });
        return { error: error.message };
      }

      await securityService.logAuthEvent('signup', true, {
        userId: data.user?.id,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        requiresVerification: !data.session,
      });

      return {};
    } catch (err) {
      const error = err as AuthError;
      return { error: error.message || 'An error occurred during sign up' };
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/';
    } catch (error) {
      // Continue with cleanup even if signOut fails
      window.location.href = '/';
    }
  }, []);

  const secureLogin = useCallback(async (
    email: string,
    password: string,
    options: { rememberMe?: boolean } = {}
  ): Promise<{ error?: string }> => {
    const result = await securityService.consolidatedAuthenticationSecurity.secureLogin(
      email,
      password,
      options
    );
    
    if (!result.success) {
      return { error: result.error };
    }
    
    return {};
  }, []);

  const secureSignup = useCallback(async (
    email: string,
    password: string,
    name: string,
    acceptedTerms: boolean
  ): Promise<{ error?: string }> => {
    const result = await securityService.consolidatedAuthenticationSecurity.secureSignup(
      email,
      password,
      { fullName: name, acceptedTerms }
    );
    
    if (!result.success) {
      return { error: result.error };
    }
    
    return {};
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    secureLogin,
    secureSignup,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
