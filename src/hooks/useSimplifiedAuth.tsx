
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';
import { cleanupAuthState } from '@/utils/authUtils';
import type { User, Session } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loginDemo: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session as Session | null);
        setUser(session?.user as User | null);
        setLoading(false);
        
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
      setSession(session as Session | null);
      setUser(session?.user as User | null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
        unifiedSecurityService.logSecurityEvent('login', false, {
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
    } catch (err: any) {
      return { error: err.message || 'An error occurred during sign in' };
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
        unifiedSecurityService.logSecurityEvent('signup', false, {
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
          error: error.message,
        });
        return { error: error.message };
      }

      unifiedSecurityService.logSecurityEvent('signup', true, {
        userId: data.user?.id,
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        requiresVerification: !data.session,
      });

      return {};
    } catch (err: any) {
      return { error: err.message || 'An error occurred during sign up' };
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/';
    } catch (error) {
      window.location.href = '/';
    }
  }, []);

  const loginDemo = useCallback(async (): Promise<void> => {
    // Demo login logic - simplified
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@dbooster.com',
        password: 'demo123456'
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  }, []);

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    loginDemo,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
