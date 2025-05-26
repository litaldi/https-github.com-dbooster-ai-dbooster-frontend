
import { User, Session } from '@supabase/supabase-js';

export const getDemoUser = (): User => {
  const now = new Date().toISOString();
  return {
    id: 'demo-user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'demo@dbooster.ai',
    email_confirmed_at: now,
    phone: '',
    confirmed_at: now,
    last_sign_in_at: now,
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
    created_at: now,
    updated_at: now
  };
};

export const loginDemoUser = async (): Promise<{ user: User; session: Session }> => {
  const demoUser = getDemoUser();
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
  
  localStorage.setItem('demo_user', JSON.stringify(demoUser));
  localStorage.setItem('demo_session', JSON.stringify({
    ...demoSession,
    expires_at: Date.now() + 24 * 60 * 60 * 1000, // Store as timestamp for easy comparison
  }));
  
  return { user: demoUser, session: demoSession };
};

export const logoutDemoUser = (): void => {
  localStorage.removeItem('demo_user');
  localStorage.removeItem('demo_session');
};

export const getDemoSession = (): Session | null => {
  const sessionData = JSON.parse(localStorage.getItem('demo_session') || 'null');
  if (sessionData && sessionData.expires_at > Date.now()) {
    const demoUser = getDemoUser();
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
