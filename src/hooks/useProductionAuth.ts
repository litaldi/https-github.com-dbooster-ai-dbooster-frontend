
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { monitoringService } from '@/services/monitoringService';
import { productionLogger } from '@/utils/productionLogger';
import { secureRateLimitService } from '@/services/secureRateLimitService';

export interface ProductionAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  githubAccessToken: string | null;
}

export function useProductionAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          productionLogger.error('Error getting initial session', error, 'useProductionAuth');
          monitoringService.captureError({
            message: `Initial session error: ${error.message}`,
            component: 'useProductionAuth',
            action: 'getInitialSession'
          });
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        productionLogger.error('Error in getInitialSession', error, 'useProductionAuth');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Log auth events securely
        productionLogger.secureInfo('Auth state changed', { 
          event, 
          hasUser: !!session?.user,
          userId: session?.user?.id 
        }, 'useProductionAuth');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          // Clear demo state when real auth happens
          if (session?.user && isDemo) {
            setIsDemo(false);
          }

          // Log successful authentication for security monitoring
          if (event === 'SIGNED_IN' && session?.user) {
            productionLogger.warn('User signed in', { 
              userId: session.user.id,
              email: session.user.email 
            }, 'useProductionAuth');
          }

          // Log sign out events
          if (event === 'SIGNED_OUT') {
            productionLogger.warn('User signed out', { 
              timestamp: new Date().toISOString() 
            }, 'useProductionAuth');
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

  // Secure login with rate limiting
  const secureLogin = async (email: string, password: string) => {
    const identifier = `login:${email}`;
    const rateLimitCheck = await secureRateLimitService.checkRateLimit(identifier, 'login');
    
    if (!rateLimitCheck.allowed) {
      productionLogger.warn('Login attempt blocked by rate limit', { 
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2") // Partially obscure email
      }, 'useProductionAuth');
      
      throw new Error(`Too many login attempts. Try again in ${rateLimitCheck.retryAfter} seconds.`);
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        productionLogger.warn('Login failed', { 
          error: error.message,
          email: email.replace(/(.{2}).*(@.*)/, "$1***$2")
        }, 'useProductionAuth');
        throw error;
      }

      productionLogger.warn('Login successful', { 
        userId: data.user?.id 
      }, 'useProductionAuth');

      return { data, error: null };
    } catch (error) {
      productionLogger.error('Login error', error, 'useProductionAuth');
      throw error;
    }
  };

  // Secure logout
  const secureLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        productionLogger.error('Logout failed', error, 'useProductionAuth');
        throw error;
      }

      productionLogger.warn('Logout successful', {}, 'useProductionAuth');
      return { error: null };
    } catch (error) {
      productionLogger.error('Logout error', error, 'useProductionAuth');
      throw error;
    }
  };

  return {
    user,
    session,
    isLoading,
    isDemo,
    githubAccessToken,
    setIsDemo,
    setGithubAccessToken,
    secureLogin,
    secureLogout
  };
}
