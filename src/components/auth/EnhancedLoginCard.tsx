
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Separator } from '@/components/ui/separator';
import { AuthFormHeader } from '@/components/auth/AuthFormHeader';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Users, Building } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

interface EnhancedLoginCardProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
}

export function EnhancedLoginCard({ authMode, onAuthModeChange }: EnhancedLoginCardProps) {
  const cardConfig = {
    login: {
      title: 'Welcome back to DBQuery Optimizer',
      description: 'Continue optimizing your database performance with AI'
    },
    signup: {
      title: 'Transform Your Database Performance',
      description: 'Join enterprises reducing query response times by up to 73%'
    }
  };

  const config = cardConfig[authMode];

  return (
    <div className="space-y-6">
      {/* Enterprise Benefits Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-primary mx-auto" />
              <div className="text-2xl font-bold text-primary">73%</div>
              <div className="text-xs text-muted-foreground">Faster Queries</div>
            </div>
            <div className="space-y-2">
              <Building className="h-8 w-8 text-green-600 mx-auto" />
              <div className="text-2xl font-bold text-green-600">60%</div>
              <div className="text-xs text-muted-foreground">Cost Reduction</div>
            </div>
            <div className="space-y-2">
              <Users className="h-8 w-8 text-blue-600 mx-auto" />
              <div className="text-2xl font-bold text-blue-600">80%</div>
              <div className="text-xs text-muted-foreground">Tasks Automated</div>
            </div>
            <div className="space-y-2">
              <Shield className="h-8 w-8 text-purple-600 mx-auto" />
              <div className="text-sm font-bold text-purple-600">SOC2</div>
              <div className="text-xs text-muted-foreground">Enterprise Ready</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Login Card */}
      <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold">
            {config.title}
          </CardTitle>
          <CardDescription className="text-base">
            {config.description}
          </CardDescription>
          
          {/* Compliance Badges */}
          <div className="flex justify-center gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              SOC2 Compliant
            </Badge>
            <Badge variant="outline" className="text-xs">
              GDPR Ready
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <AuthFormHeader mode={authMode} onModeChange={onAuthModeChange} />
          
          <Separator className="my-4" />

          <section id="auth-form" role="tabpanel">
            <EnhancedAuthForm mode={authMode} onModeChange={onAuthModeChange} />
          </section>

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

          {/* Enterprise Demo Access */}
          <section className="space-y-3 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Want to see enterprise features first?
              </p>
              <div className="grid gap-2">
                <EnhancedButton 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/contact', '_blank')}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Request Enterprise Demo
                </EnhancedButton>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Security & Privacy Footer */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Your data is protected with enterprise-grade security
        </p>
        <div className="flex justify-center gap-4 text-xs">
          <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
          <a href="/accessibility" className="text-primary hover:underline">Accessibility</a>
        </div>
      </div>
    </div>
  );
}
