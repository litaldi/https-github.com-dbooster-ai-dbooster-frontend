
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { unifiedAuthService } from '@/services/unifiedAuthService';
import { getDemoUser, loginDemoUser, logoutDemoUser, isDemoMode } from '@/services/demo';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (userData: { email: string; password: string; name?: string }) => Promise<{ error?: { message: string } }>;
  loginDemo: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Check for demo mode first
    if (isDemoMode()) {
      const demoUser = getDemoUser();
      if (mounted) {
        setUser(demoUser);
        setSession(null);
        setIsDemo(true);
        setIsLoading(false);
      }
      return;
    }

    // Set up auth state listener for real auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed', { event, hasUser: !!session?.user }, 'SimpleAuthProvider');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsDemo(false);
          setIsLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Error getting initial session', error, 'SimpleAuthProvider');
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsDemo(false);
          setIsLoading(false);
        }
      } catch (error) {
        logger.error('Error in getInitialSession', error, 'SimpleAuthProvider');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await unifiedAuthService.signIn(email, password);
    return result.error ? { error: result.error } : {};
  };

  const signUp = async (userData: { email: string; password: string; name?: string }) => {
    const result = await unifiedAuthService.signUp(userData);
    return result.error ? { error: result.error } : {};
  };

  const loginDemo = async () => {
    try {
      const { user: demoUser } = await loginDemoUser();
      setUser(demoUser);
      setSession(null);
      setIsDemo(true);
      logger.info('Demo login successful', {}, 'SimpleAuthProvider');
    } catch (error) {
      logger.error('Demo login failed', error, 'SimpleAuthProvider');
      throw error;
    }
  };

  const signOut = async () => {
    if (isDemo) {
      logoutDemoUser();
      setUser(null);
      setSession(null);
      setIsDemo(false);
    } else {
      await unifiedAuthService.signOut();
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isDemo,
    signIn,
    signUp,
    loginDemo,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
