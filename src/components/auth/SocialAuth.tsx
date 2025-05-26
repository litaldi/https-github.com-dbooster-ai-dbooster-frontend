
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Github, Loader2, AlertCircle, TestTube } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function SocialAuth() {
  const { login, loginDemo, isLoading } = useAuth();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setSocialLoading(provider);
    setError(null);
    
    try {
      await login(provider);
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      setError(error.message || `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleDemoLogin = async () => {
    setSocialLoading('demo');
    setError(null);
    
    try {
      await loginDemo();
    } catch (error: any) {
      console.error('Demo login error:', error);
      setError(error.message || 'Failed to start demo mode. Please try again.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Demo Mode Option */}
      <div className="space-y-3">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={handleDemoLogin}
          disabled={isLoading || socialLoading !== null}
          aria-label="Try Demo Mode"
        >
          {socialLoading === 'demo' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <TestTube className="w-4 h-4 mr-2" />
          )}
          {socialLoading === 'demo' ? 'Starting Demo...' : 'Try Demo Mode'}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Explore with preloaded demo data • No signup required
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={() => handleSocialLogin('github')}
        disabled={isLoading || socialLoading !== null}
        aria-label="Sign in with GitHub"
        variant="outline"
      >
        {socialLoading === 'github' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Github className="w-4 h-4 mr-2" />
        )}
        {socialLoading === 'github' ? 'Connecting to GitHub...' : 'Continue with GitHub'}
      </Button>
      
      <Button
        className="w-full"
        variant="outline"
        onClick={() => handleSocialLogin('google')}
        disabled={isLoading || socialLoading !== null}
        aria-label="Sign in with Google"
      >
        {socialLoading === 'google' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {socialLoading === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
      </Button>
    </div>
  );
}
