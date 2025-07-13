
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { enhancedToast } from '@/components/ui/enhanced-toast';

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
  const [isDemo] = useState(true);
  const [githubAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, options: { rememberMe?: boolean } = {}) => {
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
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const logout = async () => {
    await signOut();
  };

  const loginDemo = async () => {
    try {
      // Demo login logic - set demo user state
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@dbooster.dev',
        user_metadata: {
          full_name: 'Demo User',
          name: 'Demo User'
        }
      } as User;

      const demoSession = {
        user: demoUser,
        access_token: 'demo-token',
        refresh_token: 'demo-refresh'
      } as Session;

      setUser(demoUser);
      setSession(demoSession);
      
      enhancedToast.success({
        title: 'Demo Mode Activated',
        description: 'You can now explore DBooster with sample data.'
      });
    } catch (error) {
      console.error('Demo login error:', error);
      enhancedToast.error({
        title: 'Demo Login Failed',
        description: 'Unable to start demo mode. Please try again.'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isDemo,
        githubAccessToken,
        signIn,
        signUp,
        signOut,
        logout,
        loginDemo,
      }}
    >
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
