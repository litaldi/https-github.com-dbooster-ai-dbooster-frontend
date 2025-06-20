
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

interface AuthFormActionsProps {
  mode: AuthMode;
  isLoading: boolean;
  onToggleMode: () => void;
}

export function AuthFormActions({ mode, isLoading, onToggleMode }: AuthFormActionsProps) {
  const isLogin = mode === 'login';

  return (
    <div className="space-y-4">
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLogin ? 'Sign In' : 'Create Account'}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"
          }
        </button>
      </div>
    </div>
  );
}
