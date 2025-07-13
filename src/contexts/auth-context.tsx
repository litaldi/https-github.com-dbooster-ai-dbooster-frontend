
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isDemo: boolean;
  githubAccessToken: string | null;
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          productionLogger.error('Error getting initial session', error, 'AuthContext');
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        productionLogger.error('Error in getInitialSession', error, 'AuthContext');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        productionLogger.info('Auth state changed', { event }, 'AuthContext');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      const result = await consolidatedAuthenticationSecurity.secureLogin(email, password, options);
      if (!result.success) {
        return { error: result.error };
      }
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      return { error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, acceptedTerms: boolean) => {
    try {
      const result = await consolidatedAuthenticationSecurity.secureSignup(email, password, {
        fullName,
        acceptedTerms
      });
      if (!result.success) {
        return { error: result.error };
      }
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        productionLogger.error('Error signing out', error, 'AuthContext');
        throw error;
      }
      setIsDemo(false);
      setGithubAccessToken(null);
    } catch (error) {
      productionLogger.error('Sign out failed', error, 'AuthContext');
      throw error;
    }
  };

  const logout = signOut; // Alias for consistency

  const loginDemo = async () => {
    try {
      setIsDemo(true);
      setUser({
        id: 'demo-user',
        email: 'demo@example.com',
        user_metadata: { full_name: 'Demo User' }
      } as User);
      setSession({
        access_token: 'demo-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'demo-refresh',
        user: {
          id: 'demo-user',
          email: 'demo@example.com'
        }
      } as Session);
    } catch (error) {
      productionLogger.error('Demo login failed', error, 'AuthContext');
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isDemo,
    githubAccessToken,
    signIn,
    signUp,
    signOut,
    logout,
    loginDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
