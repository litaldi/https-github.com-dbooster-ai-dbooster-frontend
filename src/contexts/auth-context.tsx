
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { productionLogger } from '@/utils/productionLogger';
import { loginDemoUser, logoutDemoUser, isDemoMode } from '@/services/demo';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  githubAccessToken: string | null;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const { validateSession, secureLogin, secureSignup } = useConsolidatedSecurity();

  // Check if we're in demo mode
  const isDemo = isDemoMode();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        productionLogger.secureInfo('Auth state changed', { event }, 'AuthContext');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Extract GitHub access token if available
        if (session?.provider_token && session?.provider_refresh_token) {
          setGithubAccessToken(session.provider_token);
        }
        
        // Validate session security when user signs in
        if (event === 'SIGNED_IN' && session) {
          setTimeout(async () => {
            try {
              await validateSession();
            } catch (error) {
              productionLogger.error('Session validation failed', error, 'AuthContext');
            }
          }, 0);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.provider_token) {
        setGithubAccessToken(session.provider_token);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [validateSession]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
      setGithubAccessToken(null);
      
      productionLogger.secureInfo('User signed out successfully', {}, 'AuthContext');
    } catch (error) {
      productionLogger.error('Sign out failed', error, 'AuthContext');
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (isDemo) {
        logoutDemoUser();
        setUser(null);
        setSession(null);
        enhancedToast.info({
          title: 'Demo session ended',
          description: 'Thanks for trying DBooster!'
        });
        return;
      }
      
      await signOut();
      enhancedToast.success({
        title: 'Signed out',
        description: 'You have been signed out successfully.'
      });
    } catch (error) {
      productionLogger.error('Logout failed', error, 'AuthContext');
      enhancedToast.error({
        title: 'Sign out failed',
        description: 'An error occurred while signing out.'
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const success = await secureLogin(email, password);
      if (!success) {
        throw new Error('Login failed');
      }
    } catch (error) {
      productionLogger.error('Login failed', error, 'AuthContext');
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const success = await secureSignup(email, password, name);
      if (!success) {
        throw new Error('Signup failed');
      }
    } catch (error) {
      productionLogger.error('Signup failed', error, 'AuthContext');
      throw error;
    }
  };

  const loginDemo = async () => {
    try {
      const { user: demoUser, session: demoSession } = await loginDemoUser();
      setUser(demoUser);
      setSession(demoSession);
      
      enhancedToast.success({
        title: 'Demo mode activated',
        description: 'You can now explore DBooster with sample data.'
      });
    } catch (error) {
      productionLogger.error('Demo login failed', error, 'AuthContext');
      enhancedToast.error({
        title: 'Demo mode failed',
        description: 'Failed to start demo mode.'
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      isDemo,
      githubAccessToken,
      signOut, 
      logout,
      login,
      signup,
      loginDemo
    }}>
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
