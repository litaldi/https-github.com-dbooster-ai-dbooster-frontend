
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isDemoMode, getDemoSession, logoutDemoUser } from '@/services/demo';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  githubAccessToken: string | null;
  isDemo: boolean;
}

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check for demo mode first
    if (isDemoMode()) {
      const demoSession = getDemoSession();
      if (demoSession) {
        setUser(demoSession.user);
        setSession(demoSession);
        setIsDemo(true);
        setIsLoading(false);
        return;
      } else {
        // Demo session expired, clear demo data
        logoutDemoUser();
      }
    }

    // Set up auth state listener for regular auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsDemo(false);
        
        // Extract GitHub access token if available
        if (session?.provider_token && session.user?.app_metadata?.provider === 'github') {
          setGithubAccessToken(session.provider_token);
          console.log('GitHub access token obtained');
        } else {
          setGithubAccessToken(null);
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user);
          console.log('Provider:', session.user.app_metadata?.provider);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setGithubAccessToken(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setIsDemo(false);
          
          // Check for GitHub token in existing session
          if (session?.provider_token && session.user?.app_metadata?.provider === 'github') {
            setGithubAccessToken(session.provider_token);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isDemoMode()) {
      getInitialSession();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateAuthState = (newUser: User | null, newSession: Session | null, demoMode: boolean = false) => {
    setUser(newUser);
    setSession(newSession);
    setIsDemo(demoMode);
    if (!demoMode) {
      setGithubAccessToken(null);
    }
  };

  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setIsDemo(false);
    setGithubAccessToken(null);
  };

  return {
    user,
    session,
    isLoading,
    githubAccessToken,
    isDemo,
    setIsLoading,
    updateAuthState,
    clearAuthState
  };
}
