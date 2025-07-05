
import type { AuthMode } from '@/types/auth';

interface AuthFormHeaderProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
}

export function AuthFormHeader({ mode, onModeChange }: AuthFormHeaderProps) {
  return (
    <div className="flex justify-center space-x-1 text-sm">
      {mode === 'login' ? (
        <p className="text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onModeChange('signup')}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      ) : mode === 'signup' ? (
        <p className="text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      ) : (
        <p className="text-muted-foreground">
          Remember your password?{' '}
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}
