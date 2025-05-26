
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Database } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Separator } from '@/components/ui/separator';

export default function Login() {
  const { user } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Clear any previous errors when component mounts
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      // Remove error from URL without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">DBooster</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your database queries with AI-powered insights
          </p>
        </div>

        {/* Main Authentication Form */}
        <AuthForm mode={authMode} onModeChange={setAuthMode} />

        {/* Social Authentication */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Alternative options
              </span>
            </div>
          </div>

          <SocialAuth />
        </div>

        {/* Terms and Privacy */}
        <div className="text-center text-sm text-muted-foreground">
          By continuing, you agree to our{' '}
          <a 
            href="#" 
            className="underline hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Handle terms click
              }
            }}
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a 
            href="#" 
            className="underline hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                // Handle privacy click
              }
            }}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
