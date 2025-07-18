
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { LoginCard } from '@/components/auth/LoginCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { AuthMode } from '@/types/auth';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signIn, signUp, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/app';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      let result;
      
      if (authMode === 'login') {
        result = await signIn(data.email, data.password, { 
          rememberMe: data.rememberMe 
        });
      } else if (authMode === 'signup') {
        result = await signUp(
          data.email, 
          data.password, 
          data.name || `${data.firstName} ${data.lastName}`.trim(),
          data.acceptedTerms
        );
      }

      if (result?.error) {
        toast.error(result.error);
      } else {
        const successMessage = authMode === 'login' 
          ? 'Welcome back!' 
          : 'Account created successfully!';
        toast.success(successMessage);
        navigate('/app');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Starting demo login from LoginPage...');
      await loginDemo();
      console.log('Demo login successful, navigating...');
      toast.success('Demo session started!');
      navigate('/app/dashboard-alt');
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Failed to start demo session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">DBooster</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              AI-Powered Database
              <span className="text-primary block">Optimization</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Automatically optimize your database queries with advanced AI analysis 
              and get real-time performance insights.
            </p>
          </div>

          {/* Demo Section */}
          <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Play className="h-3 w-3 mr-1" />
                  Live Demo
                </Badge>
                <Badge variant="outline" className="text-xs">
                  No signup required
                </Badge>
              </div>
              <h3 className="font-semibold mb-2">Try DBooster Now</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Experience our AI-powered optimization with sample data and see 
                real-time improvements in action.
              </p>
              <Button 
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isLoading ? 'Starting Demo...' : 'Launch Demo Dashboard'}
              </Button>
            </CardContent>
          </Card>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Real-time monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Automated optimization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>Performance analytics</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <LoginCard
              authMode={authMode}
              onAuthModeChange={setAuthMode}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
