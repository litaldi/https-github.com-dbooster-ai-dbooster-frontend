
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Github, Chrome, User, Loader2 } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function SocialAuth() {
  const { login, loginDemo, isLoading } = useAuth();
  const [error, setError] = useState('');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setError('');
      setLoadingProvider(provider);
      await login(provider);
    } catch (error: any) {
      const errorMessage = error.message || `Failed to sign in with ${provider}`;
      setError(errorMessage);
      enhancedToast.error({
        title: "Authentication Failed",
        description: errorMessage,
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setError('');
      setLoadingProvider('demo');
      await loginDemo();
      enhancedToast.success({
        title: "Demo Mode Activated",
        description: "Welcome to the demo environment!",
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to start demo';
      setError(errorMessage);
      enhancedToast.error({
        title: "Demo Failed",
        description: errorMessage,
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  const isProviderLoading = (provider: string) => 
    isLoading || loadingProvider === provider;

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive" className="animate-fade-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading}
          className="w-full relative group hover:scale-[1.02] transition-transform"
        >
          {isProviderLoading('github') ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          )}
          Continue with GitHub
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          className="w-full relative group hover:scale-[1.02] transition-transform"
        >
          {isProviderLoading('google') ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Chrome className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          )}
          Continue with Google
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full relative group hover:scale-[1.02] transition-transform"
        >
          {isProviderLoading('demo') ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <User className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          )}
          Try Demo Mode
        </Button>
      </div>
    </div>
  );
}
