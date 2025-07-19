
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { DemoAccessCard } from '@/components/auth/DemoAccessCard';
import { Button } from '@/components/ui/button';
import { Brain, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate('/app');
  };

  if (user) {
    return null; // Prevent flash while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <motion.div 
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>

          {/* Right side - Auth forms */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex justify-center">
              <AuthTabs
                onSuccess={handleSuccess}
                isLoading={isLoading}
                onLoadingChange={setIsLoading}
              />
            </div>

            <div className="flex justify-center">
              <DemoAccessCard
                isLoading={isLoading}
                onLoadingChange={setIsLoading}
              />
            </div>

            <div className="text-center text-xs text-muted-foreground space-y-2">
              <p>Trusted by 50,000+ developers worldwide</p>
              <div className="flex items-center justify-center gap-4">
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
