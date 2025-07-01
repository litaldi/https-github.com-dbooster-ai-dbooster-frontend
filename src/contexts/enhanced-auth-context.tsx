import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { authenticationSecurity } from '@/services/security/authenticationSecurity';
import { comprehensiveInputValidation } from '@/services/security/comprehensiveInputValidation';
import { enhancedSecurityMonitoring } from '@/services/security/enhancedSecurityMonitoring';
import { enhancedAuthenticationSecurity } from '@/services/security/enhancedAuthenticationSecurity';
import { productionLogger } from '@/utils/productionLogger';

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

// Demo user data
const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  user_metadata: { full_name: 'Demo User' },
  app_metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated'
};

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);

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

  const secureLogin = async (email: string, password: string, options: { rememberMe?: boolean } = {}) => {
    try {
      // Use enhanced authentication security
      const result = await enhancedAuthenticationSecurity.performSecureLogin(
        email,
        password,
        {
          rememberMe: options.rememberMe,
          deviceFingerprint: authenticationSecurity.generateDeviceFingerprint()
        }
      );

      if (!result.success) {
        enhancedToast.error({
          title: "Login Failed",
          description: result.error || "Authentication failed",
        });
        return { error: result.error };
      }

      if (result.requiresVerification) {
        enhancedToast.info({
          title: "Verification Required",
          description: "Please check your email to verify your account.",
        });
      } else {
        enhancedToast.success({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      enhancedToast.error({
        title: "Login Failed",
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const secureSignup = async (email: string, password: string, name: string, acceptedTerms: boolean = false) => {
    try {
      // Validate password strength using enhanced security
      const passwordValidation = await enhancedAuthenticationSecurity.validateStrongPassword(password, email);
      
      if (!passwordValidation.isValid) {
        enhancedToast.error({
          title: "Password Requirements Not Met",
          description: passwordValidation.feedback.join('. '),
        });
        return { error: "Password does not meet security requirements" };
      }

      // Validate and sanitize inputs
      const emailValidation = comprehensiveInputValidation.validateInput(email, 'email');
      const nameValidation = comprehensiveInputValidation.validateInput(name, 'general');
      
      if (!emailValidation.isValid) {
        throw new Error('Invalid email format');
      }
      
      if (!nameValidation.isValid) {
        throw new Error('Invalid name format');
      }

      const result = await authenticationSecurity.secureSignup(
        emailValidation.sanitized,
        password,
        {
          fullName: nameValidation.sanitized,
          acceptedTerms
        }
      );

      if (!result.success) {
        enhancedToast.error({
          title: "Signup Failed",
          description: result.error || "Account creation failed",
        });
        return { error: result.error };
      }

      if (result.requiresVerification) {
        enhancedToast.success({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        enhancedToast.success({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      }
      
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      enhancedToast.error({
        title: "Signup Failed",
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const loginDemo = async () => {
    setIsDemo(true);
    setUser(DEMO_USER as User);
    setSession({
      access_token: 'demo-token',
      refresh_token: 'demo-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: DEMO_USER as User
    } as Session);

    enhancedToast.success({
      title: "Demo Mode Activated",
      description: "Welcome to the demo environment!",
    });
  };

  const logout = async () => {
    if (isDemo) {
      setIsDemo(false);
      setUser(null);
      setSession(null);
      enhancedToast.info({
        title: "Demo session ended",
        description: "Thanks for trying the demo!"
      });
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      enhancedToast.error({
        title: "Logout Failed",
        description: error.message,
      });
      throw error;
    }

    enhancedToast.success({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const checkPasswordStrength = async (password: string) => {
    const result = await enhancedAuthenticationSecurity.validateStrongPassword(password);
    return {
      score: result.score,
      feedback: result.feedback,
      isValid: result.isValid
    };
  };

  const getSecurityMetrics = async () => {
    return await enhancedSecurityMonitoring.getSecurityMetrics();
  };

  return (
    <EnhancedAuthContext.Provider value={{
      user,
      session,
      isLoading,
      isDemo,
      secureLogin: async (email: string, password: string, options: { rememberMe?: boolean } = {}) => {
        try {
          // Use enhanced authentication security
          const result = await enhancedAuthenticationSecurity.performSecureLogin(
            email,
            password,
            {
              rememberMe: options.rememberMe,
              deviceFingerprint: authenticationSecurity.generateDeviceFingerprint()
            }
          );

          if (!result.success) {
            enhancedToast.error({
              title: "Login Failed",
              description: result.error || "Authentication failed",
            });
            return { error: result.error };
          }

          if (result.requiresVerification) {
            enhancedToast.info({
              title: "Verification Required",
              description: "Please check your email to verify your account.",
            });
          } else {
            enhancedToast.success({
              title: "Welcome back!",
              description: "You have been successfully signed in.",
            });
          }
          
          return {};
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          enhancedToast.error({
            title: "Login Failed",
            description: errorMessage,
          });
          return { error: errorMessage };
        }
      },
      secureSignup: async (email: string, password: string, name: string, acceptedTerms: boolean = false) => {
        try {
          // Validate password strength using enhanced security
          const passwordValidation = await enhancedAuthenticationSecurity.validateStrongPassword(password, email);
          
          if (!passwordValidation.isValid) {
            enhancedToast.error({
              title: "Password Requirements Not Met",
              description: passwordValidation.feedback.join('. '),
            });
            return { error: "Password does not meet security requirements" };
          }

          // Validate and sanitize inputs
          const emailValidation = comprehensiveInputValidation.validateInput(email, 'email');
          const nameValidation = comprehensiveInputValidation.validateInput(name, 'general');
          
          if (!emailValidation.isValid) {
            throw new Error('Invalid email format');
          }
          
          if (!nameValidation.isValid) {
            throw new Error('Invalid name format');
          }

          const result = await authenticationSecurity.secureSignup(
            emailValidation.sanitized,
            password,
            {
              fullName: nameValidation.sanitized,
              acceptedTerms
            }
          );

          if (!result.success) {
            enhancedToast.error({
              title: "Signup Failed",
              description: result.error || "Account creation failed",
            });
            return { error: result.error };
          }

          if (result.requiresVerification) {
            enhancedToast.success({
              title: "Account Created!",
              description: "Please check your email to verify your account.",
            });
          } else {
            enhancedToast.success({
              title: "Welcome!",
              description: "Your account has been created successfully.",
            });
          }
          
          return {};
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          enhancedToast.error({
            title: "Signup Failed",
            description: errorMessage,
          });
          return { error: errorMessage };
        }
      },
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
