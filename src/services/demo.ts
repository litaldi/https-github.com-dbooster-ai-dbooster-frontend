
import { User, Session } from '@supabase/supabase-js';

// Demo mode detection
export const isDemoMode = (): boolean => {
  return localStorage.getItem('demo_mode') === 'true' || 
         window.location.search.includes('demo=true');
};

// Demo user data
const DEMO_USER_DATA = {
  id: 'demo-user-id',
  aud: 'authenticated' as const,
  role: 'authenticated' as const,
  email: 'demo@dbooster.ai',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {
    provider: 'demo',
    providers: ['demo']
  },
  user_metadata: {
    full_name: 'Demo User',
    name: 'Demo User',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
  },
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const loginDemoUser = async (): Promise<{ user: User; session: Session }> => {
  const demoUser = DEMO_USER_DATA as User;
  const now = new Date().toISOString();
  const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours from now
  
  const demoSession: Session = {
    access_token: 'demo-access-token',
    refresh_token: 'demo-refresh-token',
    expires_in: 24 * 60 * 60,
    expires_at: expiresAt,
    token_type: 'bearer',
    user: demoUser
  };
  
  // Store demo session data
  localStorage.setItem('demo_mode', 'true');
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  localStorage.setItem('demo_session', JSON.stringify({
    ...demoSession,
    expires_at: Date.now() + 24 * 60 * 60 * 1000,
  }));
  
  return { user: demoUser, session: demoSession };
};

export const logoutDemoUser = (): void => {
  localStorage.removeItem('demo_mode');
  localStorage.removeItem('demo_user');
  localStorage.removeItem('demo_session');
};

export const getDemoSession = (): Session | null => {
  if (!isDemoMode()) return null;
  
  const sessionData = JSON.parse(localStorage.getItem('demo_session') || 'null');
  if (sessionData && sessionData.expires_at > Date.now()) {
    const demoUser = DEMO_USER_DATA as User;
    return {
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
      expires_in: sessionData.expires_in,
      expires_at: Math.floor(sessionData.expires_at / 1000),
      token_type: sessionData.token_type,
      user: demoUser
    };
  }
  return null;
};

// Re-export demo data utilities for backward compatibility
export { DEMO_USER_DATA as getDemoUser };
