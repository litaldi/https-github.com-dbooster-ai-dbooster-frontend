
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';
import { cleanupAuthState } from '@/utils/authUtils';
import { productionLogger } from '@/utils/productionLogger';
import type { User, Session, AuthState } from '@/types';
import type { AuthError } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  isDemo: boolean;
  githubAccessToken?: string;
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

  const [isDemo, setIsDemo] = useState(false);
  const [githubAccessToken, setGithubAccessToken] = useState<string | undefined>();

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
    // Check for existing demo mode
    const demoUser = localStorage.getItem('demo_user');
    if (demoUser) {
      try {
        const user = JSON.parse(demoUser);
        if (user.email === 'demo@dbooster.ai') {
          setIsDemo(true);
          setAuthState({
            user: user as User,
            session: { user: user } as Session,
            loading: false,
            initialized: true,
          });
          return;
        }
      } catch (error) {
        localStorage.removeItem('demo_user');
        productionLogger.warn('Invalid demo user data cleared', {}, 'AuthContext');
      }
    }

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
      const emailValidation = await unifiedSecurityService.validateInput(email, 'email');
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
      const emailValidation = await unifiedSecurityService.validateInput(email, 'email');
      const nameValidation = await unifiedSecurityService.validateInput(name, 'general');
      
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
      setIsDemo(false);
      localStorage.removeItem('demo_user');
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/';
    } catch (error) {
      productionLogger.error('Sign out error', error, 'AuthContext');
      window.location.href = '/';
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await signOut();
  }, [signOut]);

  const loginDemo = useCallback(async (): Promise<void> => {
    try {
      const mockUser = {
        id: 'demo-user-id',
        email: 'demo@dbooster.ai',
        user_metadata: { 
          full_name: 'Demo User',
          name: 'Demo User'
        }
      };
      
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      
      setIsDemo(true);
      setAuthState({
        user: mockUser as User,
        session: { user: mockUser } as Session,
        loading: false,
        initialized: true,
      });
      
      productionLogger.info('Demo mode activated', {}, 'AuthContext');
    } catch (error) {
      productionLogger.error('Demo login failed', error, 'AuthContext');
    }
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    loginDemo,
    logout,
    isDemo,
    githubAccessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
