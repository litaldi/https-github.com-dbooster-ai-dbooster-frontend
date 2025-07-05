
import { Button } from '@/components/ui/button';
import type { AuthMode } from '@/types/auth';

interface AuthFormHeaderProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthFormHeader({ mode, onModeChange }: AuthFormHeaderProps) {
  return (
    <div className="flex justify-center space-x-1 mb-6">
      <Button
        type="button"
        variant={mode === 'login' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('login')}
        className="px-6"
      >
        Sign In
      </Button>
      <Button
        type="button"
        variant={mode === 'signup' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('signup')}
        className="px-6"
      >
        Sign Up
      </Button>
    </div>
  );
}
