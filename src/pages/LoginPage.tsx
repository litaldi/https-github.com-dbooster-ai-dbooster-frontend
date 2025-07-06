
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Separator } from '@/components/ui/separator';
import { FadeIn, PageTransition } from '@/components/ui/animations';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Users, CheckCircle2, Eye, TrendingUp, Database, DollarSign } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  rememberMe?: boolean;
  acceptedTerms?: boolean;
}

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, loginDemo, user } = useAuth();

  // Redirect if already authenticated
  if (user) {
    navigate('/app', { replace: true });
    return null;
  }

  const handleAuth = async (data: AuthFormData) => {
    setIsLoading(true);

    try {
      let result;
      if (authMode === 'login') {
        result = await signIn(data.email, data.password, {
          rememberMe: data.rememberMe
        });
      } else if (authMode === 'signup') {
        const fullName = data.name || `${data.firstName || ''} ${data.lastName || ''}`.trim();
        result = await signUp(data.email, data.password, fullName, data.acceptedTerms || false);
      }
      
      if (result?.error) {
        enhancedToast.error({
          title: authMode === 'login' ? 'Sign in failed' : 'Account creation failed',
          description: result.error
        });
      } else {
        if (authMode === 'signup') {
          enhancedToast.info({
            title: 'Check your email',
            description: 'We sent you a verification link to complete your account setup.'
          });
        } else {
          navigate('/app', { replace: true });
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

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginDemo();
      navigate('/app');
    } catch (error) {
      console.error('Demo login error:', error);
      enhancedToast.error({
        title: 'Demo login failed',
        description: 'Please try again or contact support.'
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
      <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/20" dir="ltr">
        {/* Left side - Enhanced Branding & Features */}
        <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-600/10">
          <div className="max-w-md mx-auto space-y-8">
            <FadeIn>
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <div className="p-4 bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-lg">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      DBooster
                    </span>
                    <p className="text-sm text-muted-foreground font-medium">AI Database Optimizer</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold leading-tight text-foreground">
                    Optimize Your Database Performance with AI
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Reduce query response times by 73% and cut infrastructure costs by 60% with intelligent optimization.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">73%</div>
                    <div className="text-sm text-green-700">Avg Performance Boost</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">60%</div>
                    <div className="text-sm text-blue-700">Cost Reduction</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Why developers choose DBooster:</h3>
                <div className="space-y-3">
                  {trustIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-background/60 rounded-xl border border-border/50 backdrop-blur-sm">
                      <indicator.icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{indicator.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="text-center">
                <Badge variant="secondary" className="px-6 py-3 text-sm font-medium">
                  ⚡ 5-minute setup • No credit card required
                </Badge>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <FadeIn>
              <Card className="shadow-2xl border-0 bg-background/95 backdrop-blur-sm">
                <CardHeader className="text-center space-y-3 pb-6">
                  {/* Mobile logo */}
                  <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        DBooster
                      </span>
                      <p className="text-sm text-muted-foreground">AI Database Optimizer</p>
                    </div>
                  </div>
                  
                  <CardTitle className="text-3xl font-bold">
                    {authMode === 'login' ? 'Welcome back' : 'Get started today'}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
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
                        <span className="bg-background px-3 text-muted-foreground font-medium">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <SocialAuth />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Enhanced Demo Access Card */}
            <FadeIn delay={0.2}>
              <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-blue-50/50">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Eye className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">Try Demo Mode</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Experience DBooster with sample data - no signup required
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <Database className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-lg text-green-600">15,234</div>
                      <div className="text-muted-foreground">Queries Optimized</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <div className="font-bold text-lg text-blue-600">73%</div>
                      <div className="text-muted-foreground">Avg Improvement</div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 h-12 text-base font-medium"
                    size="lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    {isLoading ? 'Loading Demo...' : 'Launch Demo Dashboard'}
                  </Button>
                  
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <Badge variant="outline">No Credit Card</Badge>
                    <Badge variant="outline">Full Features</Badge>
                    <Badge variant="outline">Sample Data</Badge>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="text-center text-xs text-muted-foreground space-y-3">
                <p className="font-medium">Trusted by 50,000+ developers worldwide</p>
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
