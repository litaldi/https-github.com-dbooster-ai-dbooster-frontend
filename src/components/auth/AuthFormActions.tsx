
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthFormActionsProps {
  mode: 'login' | 'signup';
  isLoading: boolean;
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  onModeChange: (mode: 'login' | 'signup') => void;
}

export function AuthFormActions({
  mode,
  isLoading,
  rememberMe,
  onRememberMeChange,
  onModeChange
}: AuthFormActionsProps) {
  const { toast } = useToast();

  return (
    <>
      {/* Remember Me & Forgot Password */}
      {mode === 'login' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => onRememberMeChange(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => {
              toast({
                title: "Feature Coming Soon",
                description: "Password reset functionality will be available soon.",
              });
            }}
            className="px-0 text-blue-600 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Forgot password?
          </Button>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
            {mode === 'login' ? 'Signing in...' : 'Creating account...'}
          </>
        ) : (
          <>
            {mode === 'login' ? (
              <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
            ) : (
              <UserPlus className="w-4 h-4 mr-2" aria-hidden="true" />
            )}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </>
        )}
      </Button>

      {/* Mode Switch */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        </span>
        <Button
          type="button"
          variant="link"
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="px-0 text-blue-600 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </Button>
      </div>
    </>
  );
}
