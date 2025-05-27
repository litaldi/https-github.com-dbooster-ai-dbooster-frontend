
import { Button } from '@/components/ui/button';

interface AuthFormFooterProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  rememberMe?: boolean;
  onRememberMeChange?: (checked: boolean) => void;
  onPasswordReset?: () => void;
}

export function AuthFormFooter({ 
  mode, 
  onModeChange, 
  rememberMe, 
  onRememberMeChange, 
  onPasswordReset 
}: AuthFormFooterProps) {
  return (
    <>
      {mode === 'login' && onRememberMeChange && onPasswordReset && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="remember" className="text-sm">Remember me</label>
          </div>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-sm"
            onClick={onPasswordReset}
          >
            Forgot password?
          </Button>
        </div>
      )}

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
        </span>{' '}
        <Button
          variant="link"
          className="p-0 h-auto font-semibold"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </Button>
      </div>
    </>
  );
}
