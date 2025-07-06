
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Separator } from '@/components/ui/separator';
import { FadeIn, PageTransition } from '@/components/ui/animations';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Users, CheckCircle2 } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

export default function Login() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { secureLogin, secureSignup, user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    navigate('/app', { replace: true });
    return null;
  }

  const handleAuth = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const result = await secureLogin(data.email, data.password, {
          rememberMe: data.rememberMe
        });
        
        if (!result.error) {
          navigate('/app', { replace: true });
        }
      } else if (authMode === 'signup') {
        if (!data.firstName || !data.lastName) {
          throw new Error('First name and last name are required for your professional profile');
        }
        
        const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
        const result = await secureSignup(data.email, data.password, fullName, true);
        
        if (!result.error) {
          enhancedToast.info({
            title: 'Check your email',
            description: 'We sent you a verification link to complete your account setup.'
          });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      enhancedToast.error({
        title: authMode === 'login' ? 'Sign in failed' : 'Account creation failed',
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trustIndicators = [
    { icon: Users, text: '50,000+ developers trust DBooster' },
    { icon: Shield, text: 'SOC2 certified & enterprise ready' },
    { icon: CheckCircle2, text: 'Free forever plan available' }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/30" dir="ltr">
        {/* Left side - Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-gradient-to-br from-primary/5 to-blue-500/10">
          <div className="max-w-md mx-auto space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    DBooster
                  </span>
                  <p className="text-sm text-muted-foreground">AI Database Optimizer</p>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold leading-tight">
                Optimize Your Database Performance with AI
              </h1>
              <p className="text-lg text-muted-foreground">
                Reduce query response times by 73% and cut infrastructure costs by 60% with intelligent optimization.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Why developers choose DBooster:</h3>
              <div className="space-y-3">
                {trustIndicators.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
                    <indicator.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm">{indicator.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Badge variant="secondary" className="px-4 py-2">
                ⚡ 5-minute setup • No credit card required
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            <FadeIn>
              <Card className="shadow-xl border-0 bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-2 pb-6">
                  {/* Mobile logo */}
                  <div className="lg:hidden flex items-center justify-center space-x-2 mb-4">
                    <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      DBooster
                    </span>
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">
                    {authMode === 'login' ? 'Welcome back' : 'Get started today'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {authMode === 'login' 
                      ? 'Sign in to your account to continue optimizing' 
                      : 'Create your account and start optimizing queries in minutes'
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <EnhancedAuthForm 
                    authMode={authMode}
                    onAuthModeChange={setAuthMode}
                    onSubmit={handleAuth}
                    isLoading={isLoading}
                  />

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
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="text-center text-xs text-muted-foreground space-y-2">
                <p>Trusted by 50,000+ developers worldwide</p>
                <p>SOC2 compliant • Enterprise ready • 24/7 support</p>
                
                <div className="flex items-center justify-center gap-4 text-xs pt-2">
                  <a href="/terms" className="hover:text-foreground transition-colors hover:underline">
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a href="/privacy" className="hover:text-foreground transition-colors hover:underline">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
