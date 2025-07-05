
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { productionLogger } from '@/utils/productionLogger';
import { useEnhancedAuthOperations } from '@/hooks/useEnhancedAuthOperations';
import { loginDemoUser, logoutDemoUser, isDemoMode } from '@/services/demo';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  secureLogin: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: any }>;
  secureSignup: (email: string, password: string, name: string, acceptedTerms?: boolean) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
  checkPasswordStrength: (password: string) => Promise<{ score: number; feedback: string[]; isValid: boolean }>;
  getSecurityMetrics: () => Promise<any>;
  githubAccessToken: string | null;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);

  const { secureLogin, secureSignup, logout: performLogout } = useEnhancedAuthOperations();

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        productionLogger.error('Error getting initial session', error, 'EnhancedAuthProvider');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          if (session?.user && isDemo) {
            setIsDemo(false);
          }

          // Log auth events for security monitoring
          productionLogger.secureInfo(`Auth event: ${event}`, {
            success: !!session,
            userId: session?.user?.id,
            timestamp: new Date().toISOString()
          }, 'EnhancedAuthProvider');
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isDemo]);

  const loginDemo = async () => {
    const { user: demoUser, session: demoSession } = await loginDemoUser();
    setIsDemo(true);
    setUser(demoUser);
    setSession(demoSession);
    enhancedToast.success({
      title: 'Demo mode activated',
      description: 'You can now explore DBooster with sample data.'
    });
  };

  const logout = async () => {
    await performLogout(isDemo);
    if (isDemo) {
      setIsDemo(false);
      setUser(null);
      setSession(null);
    }
  };

  const checkPasswordStrength = async (password: string) => {
    const result = await consolidatedAuthenticationSecurity.validateStrongPassword(password);
    return {
      score: result.score,
      feedback: result.feedback,
      isValid: result.isValid
    };
  };

  const getSecurityMetrics = async () => {
    // Basic security metrics
    return {
      authEvents: 0,
      securityAlerts: 0,
      lastSecurityCheck: new Date()
    };
  };

  return (
    <EnhancedAuthContext.Provider value={{
      user,
      session,
      isLoading,
      isDemo,
      secureLogin,
      secureSignup,
      logout,
      loginDemo,
      checkPasswordStrength,
      getSecurityMetrics,
      githubAccessToken
    }}>
      {children}
    </EnhancedAuthContext.Provider>
  );
}

export function useEnhancedAuth() {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
}
