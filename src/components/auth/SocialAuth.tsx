
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Github, Chrome, User } from 'lucide-react';

export function SocialAuth() {
  const { login, loginDemo, isLoading } = useAuth();
  const [error, setError] = useState('');

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setError('');
      await login(provider);
    } catch (error: any) {
      setError(error.message || `Failed to sign in with ${provider}`);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setError('');
      await loginDemo();
    } catch (error: any) {
      setError(error.message || 'Failed to start demo');
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading}
          className="w-full"
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="w-full"
        >
          <Chrome className="mr-2 h-4 w-4" />
          Continue with Google
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full"
        >
          <User className="mr-2 h-4 w-4" />
          Try Demo Mode
        </Button>
      </div>
    </div>
  );
}
