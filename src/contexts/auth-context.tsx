
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { productionLogger } from '@/utils/productionLogger';
import { loginDemoUser, logoutDemoUser, isDemoMode } from '@/services/demo';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  githubAccessToken: string | null;
  // Core methods
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  // Enhanced secure methods
  secureLogin: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: any }>;
  secureSignup: (email: string, password: string, name: string, acceptedTerms?: boolean) => Promise<{ error?: any }>;
  // Utility methods
  checkPasswordStrength: (password: string) => Promise<{ score: number; feedback: string[]; isValid: boolean }>;
  getSecurityMetrics: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);

  const isDemo = isDemoMode();

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.provider_token) {
            setGithubAccessToken(session.provider_token);
          }
          setIsLoading(false);
        }
      } catch (error) {
        productionLogger.error('Error getting initial session', error, 'AuthProvider');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          productionLogger.secureInfo(`Auth event: ${event}`, {
            success: !!session,
            userId: session?.user?.id,
            timestamp: new Date().toISOString()
          }, 'AuthProvider');

          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          if (session?.provider_token) {
            setGithubAccessToken(session.provider_token);
          }

          if (session?.user && isDemo) {
            productionLogger.warn('User authenticated while in demo mode', {}, 'AuthProvider');
          }
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isDemo]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setGithubAccessToken(null);
      
      productionLogger.secureInfo('User signed out successfully', {}, 'AuthProvider');
    } catch (error) {
      productionLogger.error('Sign out failed', error, 'AuthProvider');
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
          description: 'Thanks for exploring DBooster! Ready to try the full version?'
        });
        return;
      }
      
      await signOut();
      enhancedToast.success({
        title: 'Successfully signed out',
        description: 'Your session has been securely terminated.'
      });
    } catch (error) {
      productionLogger.error('Logout failed', error, 'AuthProvider');
      enhancedToast.error({
        title: 'Sign out failed',
        description: 'We encountered an issue signing you out. Please try again.'
      });
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      enhancedToast.success({
        title: 'Welcome back to DBooster!',
        description: 'Successfully signed in to your optimization workspace.'
      });
    } catch (error) {
      productionLogger.error('Login failed', error, 'AuthProvider');
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      enhancedToast.error({
        title: 'Sign in failed',
        description: errorMessage === 'Invalid login credentials' 
          ? 'Invalid email or password. Please check and try again.' 
          : errorMessage
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: name ? { full_name: name } : undefined
        }
      });
      
      if (error) throw error;
      
      enhancedToast.success({
        title: 'Account created successfully!',
        description: 'Please check your email to verify your account and complete setup.'
      });
    } catch (error) {
      productionLogger.error('Signup failed', error, 'AuthProvider');
      const errorMessage = error instanceof Error ? error.message : 'Account creation failed';
      enhancedToast.error({
        title: 'Account creation failed',
        description: errorMessage.includes('already registered') 
          ? 'An account with this email already exists. Try signing in instead.' 
          : errorMessage
      });
      throw error;
    }
  };

  const secureLogin = async (email: string, password: string, options: { rememberMe?: boolean } = {}) => {
    try {
      const result = await consolidatedAuthenticationSecurity.secureLogin(
        email,
        password,
        {
          rememberMe: options.rememberMe,
          deviceFingerprint: consolidatedAuthenticationSecurity.generateDeviceFingerprint()
        }
      );

      if (!result.success) {
        enhancedToast.error({
          title: "Authentication Failed",
          description: result.error || "Invalid credentials. Please check your email and password.",
        });
        return { error: result.error };
      }

      if (result.requiresVerification) {
        enhancedToast.info({
          title: "Email Verification Required",
          description: "Please check your email and click the verification link to complete sign in.",
        });
      } else {
        enhancedToast.success({
          title: "Welcome back to DBooster!",
          description: "Successfully signed in to your optimization workspace.",
        });
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      enhancedToast.error({
        title: "Sign In Failed",
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const secureSignup = async (email: string, password: string, name: string, acceptedTerms: boolean = false) => {
    try {
      const passwordValidation = await consolidatedAuthenticationSecurity.validateStrongPassword(password, email);
      
      if (!passwordValidation.isValid) {
        enhancedToast.error({
          title: "Password Requirements Not Met",
          description: passwordValidation.feedback.join('. ') + '. Please create a stronger password.',
        });
        return { error: "Password does not meet security requirements" };
      }

      const result = await consolidatedAuthenticationSecurity.secureSignup(
        email,
        password,
        {
          fullName: name,
          acceptedTerms
        }
      );

      if (!result.success) {
        enhancedToast.error({
          title: "Account Creation Failed",
          description: result.error || "Unable to create account. Please try again.",
        });
        return { error: result.error };
      }

      if (result.requiresVerification) {
        enhancedToast.success({
          title: "Account Created Successfully!",
          description: "Please check your email to verify your account and start optimizing.",
        });
      } else {
        enhancedToast.success({
          title: "Welcome to DBooster!",
          description: "Your account is ready. Let's start optimizing your database performance.",
        });
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Account creation failed';
      enhancedToast.error({
        title: "Account Creation Failed",
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const loginDemo = async () => {
    try {
      const { user: demoUser, session: demoSession } = await loginDemoUser();
      setUser(demoUser);
      setSession(demoSession);
      
      enhancedToast.success({
        title: 'Demo environment activated',
        description: 'Explore DBooster with enterprise sample data and real optimization scenarios.'
      });
    } catch (error) {
      productionLogger.error('Demo login failed', error, 'AuthProvider');
      enhancedToast.error({
        title: 'Demo mode unavailable',
        description: 'Unable to start demo mode. Please try again or sign up for a free account.'
      });
      throw error;
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
    return {
      authEvents: 0,
      securityAlerts: 0,
      lastSecurityCheck: new Date(),
      securityScore: 99.9
    };
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
      loginDemo,
      secureLogin,
      secureSignup,
      checkPasswordStrength,
      getSecurityMetrics
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
