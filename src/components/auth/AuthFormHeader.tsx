
import { Button } from '@/components/ui/button';
import { KeyRound, UserPlus } from 'lucide-react';

interface AuthFormHeaderProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthFormHeader({ mode, onModeChange }: AuthFormHeaderProps) {
  return (
    <div className="grid grid-cols-2 gap-3" role="tablist" aria-label="Authentication mode">
      <Button
        variant={mode === 'login' ? 'default' : 'outline'}
        onClick={() => onModeChange('login')}
        className="flex items-center gap-2 transition-all duration-200 hover-scale focus-visible:ring-2 focus-visible:ring-blue-500"
        role="tab"
        aria-selected={mode === 'login'}
        aria-controls="auth-form"
      >
        <KeyRound className="h-4 w-4" aria-hidden="true" />
        Sign In
      </Button>
      <Button
        variant={mode === 'signup' ? 'default' : 'outline'}
        onClick={() => onModeChange('signup')}
        className="flex items-center gap-2 transition-all duration-200 hover-scale focus-visible:ring-2 focus-visible:ring-blue-500"
        role="tab"
        aria-selected={mode === 'signup'}
        aria-controls="auth-form"
      >
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Sign Up
      </Button>
    </div>
  );
}
