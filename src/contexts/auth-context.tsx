
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { cleanupAuthState } from '@/utils/authUtils';
import { productionLogger } from '@/utils/productionLogger';
import type { User, Session, AuthState } from '@/types';
import type { AuthError } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  secureLogin: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  secureSignup: (email: string, password: string, name: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  // Legacy compatibility properties
  logout: () => Promise<void>;
  isDemo: boolean;
  loginDemo: () => Promise<void>;
  githubAccessToken: string | null;
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        updateAuthState(session as Session | null);
        
        if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            unifiedSecurityService.logSecurityEvent('login', true, {
              userId: session.user.id,
              timestamp: new Date().toISOString(),
            });
          }, 0);
        }
      }
    );

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
      // Validate inputs before processing
      const emailValidation = consolidatedInputValidation.validateAndSanitize(email, 'email');
      if (!emailValidation.isValid) {
        return { error: 'Invalid email format' };
      }

      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailValidation.sanitizedValue || email,
        password,
      });

      if (error) {
        await unifiedSecurityService.logSecurityEvent('login', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message,
        });
        return { error: error.message };
      }

      if (options.rememberMe) {
        localStorage.setItem('dbooster_remember_me', 'true');
        localStorage.setItem('dbooster_email', emailValidation.sanitizedValue || email);
      }

      return {};
    } catch (err) {
      const error = err as AuthError;
      productionLogger.error('Authentication error', error, 'AuthContext');
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
      // Validate inputs
      const emailValidation = consolidatedInputValidation.validateAndSanitize(email, 'email');
      const nameValidation = consolidatedInputValidation.validateAndSanitize(name, 'general');
      
      if (!emailValidation.isValid) {
        return { error: 'Invalid email format' };
      }
      
      if (!nameValidation.isValid) {
        return { error: 'Invalid name format' };
      }

      const { data, error } = await supabase.auth.signUp({
        email: emailValidation.sanitizedValue || email,
        password,
        options: {
          data: { 
            full_name: nameValidation.sanitizedValue || name,
            name: nameValidation.sanitizedValue || name,
            accepted_terms: acceptedTerms,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        await unifiedSecurityService.logSecurityEvent('signup', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message,
        });
        return { error: error.message };
      }

      await unifiedSecurityService.logSecurityEvent('signup', true, {
        userId: data.user?.id,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        requiresVerification: !data.session,
      });

      return {};
    } catch (err) {
      const error = err as AuthError;
      productionLogger.error('Registration error', error, 'AuthContext');
      return { error: error.message || 'An error occurred during sign up' };
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/';
    } catch (error) {
      productionLogger.error('Sign out error', error, 'AuthContext');
      window.location.href = '/';
    }
  }, []);

  const secureLogin = useCallback(async (
    email: string,
    password: string,
    options: { rememberMe?: boolean } = {}
  ): Promise<{ error?: string }> => {
    const result = await unifiedSecurityService.secureLogin(email, password, options);
    
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
    const result = await unifiedSecurityService.secureSignup(email, password, { 
      fullName: name, 
      acceptedTerms 
    });
    
    if (!result.success) {
      return { error: result.error };
    }
    
    return {};
  }, []);

  // Legacy compatibility methods
  const logout = useCallback(async (): Promise<void> => {
    return signOut();
  }, [signOut]);

  const loginDemo = useCallback(async (): Promise<void> => {
    // Demo login is now disabled for security
    productionLogger.warn('Demo login attempt blocked', {}, 'AuthContext');
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    secureLogin,
    secureSignup,
    // Legacy compatibility
    logout,
    isDemo: false, // Always false now for security
    loginDemo,
    githubAccessToken: null, // Not implemented
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
