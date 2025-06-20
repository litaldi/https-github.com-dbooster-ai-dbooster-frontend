
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { Separator } from '@/components/ui/separator';
import { AuthFormHeader } from '@/components/auth/AuthFormHeader';

interface LoginCardProps {
  isLogin: boolean;
  onAuthModeChange: (isLogin: boolean) => void;
}

export function LoginCard({ isLogin, onAuthModeChange }: LoginCardProps) {
  const cardConfig = {
    true: {
      title: 'Welcome back',
      description: 'Sign in to your account to continue optimizing'
    },
    false: {
      title: 'Get started today',
      description: 'Create your account and start optimizing queries'
    }
  };

  const config = cardConfig[isLogin.toString() as 'true' | 'false'];

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
        <Separator className="my-4" />

        <section id="auth-form" role="tabpanel">
          <EnhancedAuthForm isLogin={isLogin} onToggleMode={() => onAuthModeChange(!isLogin)} />
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
