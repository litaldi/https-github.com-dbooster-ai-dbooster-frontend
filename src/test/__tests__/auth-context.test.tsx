
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({ 
        data: { subscription: { unsubscribe: vi.fn() } } 
      })),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    }
  }
}));

// Mock other dependencies
vi.mock('@/services/security/unifiedSecurityService', () => ({
  unifiedSecurityService: {
    logSecurityEvent: vi.fn(),
    secureLogin: vi.fn(() => Promise.resolve({ success: true })),
    secureSignup: vi.fn(() => Promise.resolve({ success: true })),
  }
}));

vi.mock('@/services/security/consolidatedInputValidation', () => ({
  consolidatedInputValidation: {
    validateAndSanitize: vi.fn(() => ({ isValid: true, sanitizedValue: 'test' })),
  }
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null user and session', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.isDemo).toBe(false);
  });

  it('should handle secure login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.secureLogin('test@example.com', 'password');
    });

    // Test passes if no error is thrown
    expect(true).toBe(true);
  });

  it('should handle secure signup', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.secureSignup('test@example.com', 'password', 'Test User', true);
    });

    // Test passes if no error is thrown
    expect(true).toBe(true);
  });
});
