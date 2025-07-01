
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { enhancedSecurityMonitoring } from '@/services/security/enhancedSecurityMonitoring';
import { productionLogger } from '@/utils/productionLogger';
import { useEnhancedAuthOperations } from '@/hooks/useEnhancedAuthOperations';
import { DemoUserService } from '@/services/auth/demoUserService';
import { PasswordValidationService } from '@/services/auth/passwordValidationService';
import { SecurityMetricsService } from '@/services/auth/securityMetricsService';

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

          // Monitor auth events for security
          await enhancedSecurityMonitoring.analyzeSecurityEvent({
            type: `auth_${event}`,
            data: {
              success: !!session,
              userId: session?.user?.id,
              timestamp: new Date().toISOString()
            },
            userId: session?.user?.id,
            userAgent: navigator.userAgent
          });
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
    const { user: demoUser, session: demoSession } = DemoUserService.createDemoSession();
    setIsDemo(true);
    setUser(demoUser);
    setSession(demoSession);
    DemoUserService.showDemoWelcomeMessage();
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
    return await PasswordValidationService.checkPasswordStrength(password);
  };

  const getSecurityMetrics = async () => {
    return await SecurityMetricsService.getSecurityMetrics();
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
