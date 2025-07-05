
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Separator } from '@/components/ui/separator';
import { AuthFormHeader } from '@/components/auth/AuthFormHeader';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import type { AuthMode } from '@/types/auth';

interface LoginCardProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function LoginCard({ authMode, onAuthModeChange, onSubmit, isLoading }: LoginCardProps) {
  const cardConfig = {
    login: {
      title: 'Welcome back',
      description: 'Sign in to your account to continue optimizing'
    },
    signup: {
      title: 'Get started today',
      description: 'Create your account and start optimizing queries'
    },
    reset: {
      title: 'Reset password',
      description: 'Enter your email to receive a password reset link'
    }
  };

  const config = cardConfig[authMode] || cardConfig.login;

  return (
    <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm animate-scale-in">
      <CardHeader className="text-center space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold">
          {config.title}
        </CardTitle>
        <CardDescription className="text-sm">
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AuthFormHeader mode={authMode} onModeChange={onAuthModeChange} />
        
        <Separator className="my-4" />

        <section id="auth-form" role="tabpanel">
          <EnhancedAuthForm 
            authMode={authMode}
            onAuthModeChange={onAuthModeChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
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
      </CardContent>
    </Card>
  );
}
