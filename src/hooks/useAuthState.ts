
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { monitoringService } from '@/services/monitoringService';
import { logger } from '@/utils/logger';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  githubAccessToken: string | null;
}

export function useAuthState() {
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
          logger.error('Error getting initial session', error, 'useAuthState');
          monitoringService.captureError({
            message: `Initial session error: ${error.message}`,
            component: 'useAuthState',
            action: 'getInitialSession'
          });
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        logger.error('Error in getInitialSession', error, 'useAuthState');
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.info('Auth state changed', { event, userEmail: session?.user?.email }, 'useAuthState');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          // Clear demo state when real auth happens
          if (session?.user && isDemo) {
            setIsDemo(false);
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

  return {
    user,
    session,
    isLoading,
    isDemo,
    githubAccessToken,
    setIsDemo,
    setGithubAccessToken
  };
}
