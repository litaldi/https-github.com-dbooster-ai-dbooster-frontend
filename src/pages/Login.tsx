
import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { Database, KeyRound, UserPlus } from 'lucide-react';
import { AuthForm } from '@/components/auth/AuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { DemoModeButton } from '@/components/auth/DemoModeButton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';

export default function Login() {
  const { user, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Clear any previous errors when component mounts
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      // Remove error from URL without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Simulate page load for smooth entrance
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isPageLoading) {
    return <EnhancedLoading variant="full-screen" text="Loading authentication..." />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  // Animated blob background
  function AnimatedBg() {
    return (
      <div 
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none -z-10"
      >
        <svg 
          viewBox="0 0 600 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full opacity-20 animate-fade-in"
          style={{ position: "absolute", top: '-5%', left: '-10%' }}
        >
          <defs>
            <radialGradient id="bluePurple" cx="60%" cy="35%" r="0.65">
              <stop offset="0%" stopColor="#6872F8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B075FC" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="350" cy="250" rx="240" ry="200" fill="url(#bluePurple)" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <AnimatedBg />
      <main className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Brand Header with improved accessibility */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg hover-scale">
            <Database className="w-8 h-8 text-white" aria-hidden="true" />
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
        </header>

        {/* Main Authentication Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-scale-in">
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
            {/* Mode Toggle with improved accessibility */}
            <div className="grid grid-cols-2 gap-3" role="tablist" aria-label="Authentication mode">
              <Button
                variant={authMode === 'login' ? 'default' : 'outline'}
                onClick={() => setAuthMode('login')}
                className="flex items-center gap-2 transition-all duration-200 hover-scale"
                role="tab"
                aria-selected={authMode === 'login'}
                aria-controls="auth-form"
              >
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Sign In
              </Button>
              <Button
                variant={authMode === 'signup' ? 'default' : 'outline'}
                onClick={() => setAuthMode('signup')}
                className="flex items-center gap-2 transition-all duration-200 hover-scale"
                role="tab"
                aria-selected={authMode === 'signup'}
                aria-controls="auth-form"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Sign Up
              </Button>
            </div>

            <Separator className="my-4" />

            {/* Authentication Form */}
            <section id="auth-form" role="tabpanel">
              <AuthForm mode={authMode} onModeChange={setAuthMode} />
            </section>

            {/* Social Authentication */}
            <section className="space-y-4">
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
            </section>
          </CardContent>
        </Card>

        {/* Demo Mode */}
        <DemoModeButton />

        {/* Guest Access with improved accessibility */}
        <section className="text-center pt-2">
          <p className="text-xs text-muted-foreground mb-3">
            Want to browse without signing up?
          </p>
          <Link to="/home">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 story-link focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Continue as Guest
            </Button>
          </Link>
        </section>

        {/* Footer Links with improved accessibility */}
        <footer className="text-center space-y-4 pt-4">
          <nav aria-label="Legal links">
            <div className="flex justify-center space-x-4 text-sm">
              <Link 
                to="/terms" 
                className="text-muted-foreground hover:text-foreground transition-colors story-link focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Terms of Service
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">•</span>
              <Link 
                to="/privacy" 
                className="text-muted-foreground hover:text-foreground transition-colors story-link focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Privacy Policy
              </Link>
            </div>
          </nav>
          <p className="text-xs text-muted-foreground">
            © 2024 DBooster. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
