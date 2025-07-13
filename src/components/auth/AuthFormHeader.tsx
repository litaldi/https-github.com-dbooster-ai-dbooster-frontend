
import React from 'react';
import type { AuthMode } from '@/types/auth';

interface AuthFormHeaderProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthFormHeader({ mode, onModeChange }: AuthFormHeaderProps) {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center space-x-1 bg-muted rounded-lg p-1">
        <button
          type="button"
          onClick={() => onModeChange('login')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            mode === 'login'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => onModeChange('signup')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            mode === 'signup'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
