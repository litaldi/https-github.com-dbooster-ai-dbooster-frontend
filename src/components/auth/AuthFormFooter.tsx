
import React from 'react';
import { FadeIn } from '@/components/ui/animations';
import type { AuthMode } from '@/types/auth';

interface AuthFormFooterProps {
  authMode: AuthMode;
  isLoading: boolean;
  onAuthModeChange: (mode: AuthMode) => void;
}

export function AuthFormFooter({ authMode, isLoading, onAuthModeChange }: AuthFormFooterProps) {
  return (
    <>
      <FadeIn delay={0.6}>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {authMode === 'login' ? "New to DBooster? " : 'Already optimizing with us? '}
          </span>
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={() => onAuthModeChange(authMode === 'login' ? 'signup' : 'login')}
            disabled={isLoading}
          >
            {authMode === 'login' ? 'Start your free trial' : 'Sign in to your account'}
          </button>
        </div>
      </FadeIn>

      {authMode === 'signup' && (
        <FadeIn delay={0.7}>
          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          </div>
        </FadeIn>
      )}
    </>
  );
}
