
import { Link } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AuthFormFooterProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  onPasswordReset: () => void;
}

export function AuthFormFooter({
  mode,
  onModeChange,
  rememberMe,
  onRememberMeChange,
  onPasswordReset
}: AuthFormFooterProps) {
  return (
    <div className="space-y-4">
      {mode === 'login' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={onRememberMeChange}
            />
            <Label 
              htmlFor="remember-me" 
              className="text-sm font-normal cursor-pointer"
            >
              Remember me
            </Label>
          </div>
          <button
            type="button"
            onClick={onPasswordReset}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            Forgot password?
          </button>
        </div>
      )}

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
        </span>{' '}
        <button
          type="button"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </div>

      {mode === 'signup' && (
        <p className="text-xs text-muted-foreground text-center">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      )}
    </div>
  );
}
