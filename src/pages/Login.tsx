
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Database, Eye, EyeOff, UserPlus, KeyRound } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { DemoModeButton } from '@/components/auth/DemoModeButton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DBooster
            </h1>
            <Badge variant="secondary" className="text-xs">
              AI-Powered Database Optimization
            </Badge>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
              Boost your database performance with AI-powered query optimization and intelligent insights
            </p>
          </div>
        </div>

        {/* Main Authentication Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">
              {authMode === 'login' ? 'Welcome back' : 'Get started today'}
            </CardTitle>
            <CardDescription className="text-sm">
              {authMode === 'login' 
                ? 'Sign in to your account to continue optimizing'
                : 'Create your account and start optimizing queries'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={authMode === 'login' ? 'default' : 'outline'}
                onClick={() => setAuthMode('login')}
                className="flex items-center gap-2 transition-all duration-200"
              >
                <KeyRound className="h-4 w-4" />
                Sign In
              </Button>
              <Button
                variant={authMode === 'signup' ? 'default' : 'outline'}
                onClick={() => setAuthMode('signup')}
                className="flex items-center gap-2 transition-all duration-200"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Authentication Form */}
            <AuthForm mode={authMode} onModeChange={setAuthMode} />

            {/* Social Authentication */}
            <div className="space-y-4">
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

              <SocialAuth />
            </div>
          </CardContent>
        </Card>

        {/* Demo Mode */}
        <DemoModeButton />

        {/* Guest Access */}
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground mb-3">
            Want to browse without signing up?
          </p>
          <Link to="/home">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              Continue as Guest
            </Button>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4 pt-4">
          <div className="flex justify-center space-x-4 text-sm">
            <Link 
              to="/terms" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/privacy" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 DBooster. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
