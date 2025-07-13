
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, LogIn } from 'lucide-react';

interface AuthToggleProps {
  authMode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthToggle({ authMode, onModeChange }: AuthToggleProps) {
  return (
    <div className="flex rounded-lg border bg-muted p-1">
      <Button
        variant={authMode === 'login' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('login')}
        className="flex-1"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
      <Button
        variant={authMode === 'signup' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('signup')}
        className="flex-1"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Sign Up
      </Button>
    </div>
  );
}
