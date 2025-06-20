
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus, LogIn } from 'lucide-react';

interface AuthFormActionsProps {
  mode: 'login' | 'signup';
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthFormActions({ mode, isLoading, onSubmit, onModeChange }: AuthFormActionsProps) {
  return (
    <>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        size="lg"
        onClick={onSubmit}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {mode === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          <>
            {mode === 'login' ? (
              <LogIn className="w-4 h-4 mr-2" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" />
            )}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </>
        )}
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        </span>
        <Button
          type="button"
          variant="link"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="px-0"
          disabled={isLoading}
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </Button>
      </div>
    </>
  );
}
