
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isDemoMode, getDemoSession, logoutDemoUser } from '@/services/demo';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    console.log('useAuthState: Initializing auth state...');
    
    // Check for demo mode first
    if (isDemoMode()) {
      console.log('useAuthState: Demo mode detected');
      const demoSession = getDemoSession();
      if (demoSession) {
        console.log('useAuthState: Valid demo session found');
        setUser(demoSession.user);
        setSession(demoSession);
        setIsDemo(true);
        setIsLoading(false);
        return;
      } else {
        console.log('useAuthState: Demo session expired, clearing demo data');
        logoutDemoUser();
      }
    }

    // Set up auth state listener for regular auth
    console.log('useAuthState: Setting up Supabase auth listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuthState: Auth event received:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsDemo(false);
        
        // Extract GitHub access token if available
        if (session?.provider_token && session.user?.app_metadata?.provider === 'github') {
          setGithubAccessToken(session.provider_token);
          console.log('useAuthState: GitHub access token obtained');
        } else {
          setGithubAccessToken(null);
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('useAuthState: User signed in:', session.user.email);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('useAuthState: User signed out');
          setGithubAccessToken(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      try {
        console.log('useAuthState: Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('useAuthState: Error getting session:', error);
        } else {
          console.log('useAuthState: Initial session check complete', session?.user?.email || 'no session');
          setSession(session);
          setUser(session?.user ?? null);
          setIsDemo(false);
          
          // Check for GitHub token in existing session
          if (session?.provider_token && session.user?.app_metadata?.provider === 'github') {
            setGithubAccessToken(session.provider_token);
          }
        }
      } catch (error) {
        console.error('useAuthState: Error in getSession:', error);
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
    console.log('useAuthState: Updating auth state', { 
      userEmail: newUser?.email, 
      hasSession: !!newSession, 
      demoMode 
    });
    setUser(newUser);
    setSession(newSession);
    setIsDemo(demoMode);
    if (!demoMode) {
      setGithubAccessToken(null);
    }
  };

  const clearAuthState = () => {
    console.log('useAuthState: Clearing auth state');
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
