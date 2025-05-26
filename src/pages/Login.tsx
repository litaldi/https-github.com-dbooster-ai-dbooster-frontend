
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Github, AlertCircle } from 'lucide-react';

export default function Login() {
  const { user, login, isLoading } = useAuth();
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear any error when component mounts
  useEffect(() => {
    setError(null);
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (provider: 'github' | 'google') => {
    setLoginLoading(true);
    setError(null);
    
    try {
      await login(provider);
      // Note: The actual redirect will be handled by Supabase OAuth flow
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || `Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">DBooster</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your database queries with AI-powered insights
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue optimizing your database performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              variant="outline"
              onClick={() => handleLogin('github')}
              disabled={isLoading || loginLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              {loginLoading ? 'Signing in...' : 'Continue with GitHub'}
            </Button>
            
            <Button
              className="w-full"
              onClick={() => handleLogin('google')}
              disabled={isLoading || loginLoading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
              {loginLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-primary">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-primary">
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
