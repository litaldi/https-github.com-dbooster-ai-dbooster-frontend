
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { enhancedRateLimiting } from '@/services/security/enhancedRateLimiting';

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        productionLogger.info('Auth state changed', { event }, 'AuthContext');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer additional operations to prevent deadlocks
        if (session?.user) {
          setTimeout(() => {
            // Any additional user data fetching can go here
          }, 0);
        }
      }
    );

    // THEN check for existing session
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

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      // Check rate limiting
      const rateLimitResult = enhancedRateLimiting.checkRateLimit('login', email);
      if (!rateLimitResult.allowed) {
        return { error: rateLimitResult.reason || 'Too many login attempts. Please try again later.' };
      }

      const result = await consolidatedAuthenticationSecurity.secureLogin(email, password, options);
      if (!result.success) {
        // Record failed attempt for rate limiting
        enhancedRateLimiting.recordAttempt('login', email);
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
      // Check rate limiting
      const rateLimitResult = enhancedRateLimiting.checkRateLimit('signup', email);
      if (!rateLimitResult.allowed) {
        return { error: rateLimitResult.reason || 'Too many signup attempts. Please try again later.' };
      }

      const result = await consolidatedAuthenticationSecurity.secureSignup(email, password, {
        fullName,
        acceptedTerms
      });
      if (!result.success) {
        // Record failed attempt for rate limiting
        enhancedRateLimiting.recordAttempt('signup', email);
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
      if (isDemo) {
        // Simple demo cleanup
        setIsDemo(false);
        setUser(null);
        setSession(null);
      } else {
        const { error } = await supabase.auth.signOut();
        if (error) {
          productionLogger.error('Error signing out', error, 'AuthContext');
          throw error;
        }
      }
      
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
      
      // Create a simple demo session without complex security
      const demoSessionId = crypto.randomUUID();
      const demoToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), 
        byte => byte.toString(16).padStart(2, '0')).join('');
      
      // Create a properly typed demo user object
      const demoUser: User = {
        id: demoSessionId,
        email: 'demo@dbooster.com',
        user_metadata: { 
          full_name: 'Demo User',
          name: 'Demo User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        role: 'authenticated',
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        confirmation_sent_at: new Date().toISOString()
      };

      // Create demo session object
      const demoSessionObj: Session = {
        access_token: demoToken,
        refresh_token: 'demo-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor((Date.now() + 3600000) / 1000),
        token_type: 'bearer',
        user: demoUser
      };

      setUser(demoUser);
      setSession(demoSessionObj);
      setLoading(false);

      productionLogger.info('Simple demo session created', {
        sessionId: demoSessionId.substring(0, 8)
      });
    } catch (error) {
      productionLogger.error('Demo login failed', error, 'AuthContext');
      throw error;
    }
  };

  const value: AuthContextType = {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
