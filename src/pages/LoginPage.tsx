
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { LoginCard } from '@/components/auth/LoginCard';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Shield, Users, CheckCircle2, Eye, TrendingUp, Database, DollarSign, ArrowLeft } from 'lucide-react';
import type { AuthMode } from '@/types/auth';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

  const handleAuth = async (data: any) => {
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
    <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/20">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Left side - Enhanced Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-600/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        
        <div className="max-w-md mx-auto space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
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
                <h1 className="text-3xl font-bold">
                  Optimize Your Database Performance with AI
                </h1>
                <p className="text-lg text-muted-foreground">
                  Reduce query response times by 73% and cut infrastructure costs by 60% with intelligent optimization.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6">
                <motion.div 
                  className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-500">73%</div>
                  <div className="text-sm text-muted-foreground">Avg Performance Boost</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 bg-card/50 backdrop-blur-sm rounded-xl border"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <DollarSign className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-500">60%</div>
                  <div className="text-sm text-muted-foreground">Cost Reduction</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Why developers choose DBooster:</h3>
              <div className="space-y-3">
                {trustIndicators.map((indicator, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-3 p-4 bg-card/30 backdrop-blur-sm rounded-lg border"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <indicator.icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium">{indicator.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                ⚡ 5-minute setup • No credit card required
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LoginCard
              authMode={authMode}
              onAuthModeChange={setAuthMode}
              onSubmit={handleAuth}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Enhanced Demo Access Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-2 border-dashed border-primary/30 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Eye className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">Try Demo Mode</CardTitle>
                </div>
                <CardDescription>
                  Experience DBooster with sample data - no signup required
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-card/50 rounded-lg border">
                    <Database className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <div className="font-bold text-lg text-green-500">15,234</div>
                    <div className="text-muted-foreground">Queries Optimized</div>
                  </div>
                  <div className="text-center p-3 bg-card/50 rounded-lg border">
                    <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <div className="font-bold text-lg text-blue-500">73%</div>
                    <div className="text-muted-foreground">Avg Improvement</div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-center text-xs text-muted-foreground space-y-3">
              <p className="font-medium">Trusted by 50,000+ developers worldwide</p>
              <p>SOC2 compliant • Enterprise ready • 24/7 support</p>
              
              <div className="flex items-center justify-center gap-4 text-xs pt-2">
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
