
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { LoginCard } from '@/components/auth/LoginCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Zap, TrendingUp, Database, Shield } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, loginDemo } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      let result;
      if (authMode === 'login') {
        result = await signIn(data.email, data.password, { rememberMe: data.rememberMe });
      } else {
        result = await signUp(data.email, data.password, data.name, data.acceptedTerms);
      }
      
      if (result?.error) {
        console.error('Auth error:', result.error);
      } else {
        navigate('/app');
      }
    } catch (error) {
      console.error('Unexpected auth error:', error);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-blue-600 to-purple-700 p-12 text-white flex-col justify-center">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DBooster</h1>
              <p className="text-blue-100">AI Database Optimizer</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Optimize Your Database Performance with AI
          </h2>
          
          <p className="text-xl text-blue-100 mb-8">
            Reduce query response times by up to 73% and cut infrastructure costs by 60% with our intelligent optimization platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-300" />
              <span>73% average query improvement</span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-300" />
              <span>60% cost reduction</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-300" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          <LoginCard
            authMode={authMode}
            onAuthModeChange={setAuthMode}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          
          {/* Demo Access Card */}
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Try Demo Mode</CardTitle>
              </div>
              <CardDescription>
                Experience DBooster with sample data - no signup required
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">1,247</div>
                  <div className="text-muted-foreground">Queries Optimized</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">73%</div>
                  <div className="text-muted-foreground">Avg Improvement</div>
                </div>
              </div>
              
              <Button 
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                size="lg"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isLoading ? 'Loading Demo...' : 'Launch Demo Dashboard'}
              </Button>
              
              <div className="flex flex-wrap justify-center gap-1 text-xs">
                <Badge variant="outline">No Credit Card</Badge>
                <Badge variant="outline">Full Features</Badge>
                <Badge variant="outline">Sample Data</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
