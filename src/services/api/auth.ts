
/**
 * Authentication API Endpoints
 */

import { supabase } from '@/integrations/supabase/client';

export const AUTH_ENDPOINTS = {
  // Supabase Auth
  signUp: () => supabase.auth.signUp,
  signIn: () => supabase.auth.signInWithPassword,
  signOut: () => supabase.auth.signOut,
  resetPassword: () => supabase.auth.resetPasswordForEmail,
  getSession: () => supabase.auth.getSession,
  getUser: () => supabase.auth.getUser,
  
  // API Paths
  paths: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  }
} as const;
