
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { DemoModeButton } from '@/components/auth/DemoModeButton';
import { Separator } from '@/components/ui/separator';
import { FadeIn, PageTransition } from '@/components/ui/animations';
import { enhancedToast } from '@/components/ui/enhanced-toast';
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

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
        <div className="w-full max-w-md space-y-6">
          <FadeIn>
            <EnhancedAuthForm
              authMode={authMode}
              onAuthModeChange={setAuthMode}
              onSubmit={handleAuth}
              isLoading={isLoading}
            />
          </FadeIn>

          <FadeIn delay={0.2}>
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
              
              <div className="text-center">
                <DemoModeButton />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="text-center text-xs text-muted-foreground">
              <p>Trusted by 10,000+ developers worldwide</p>
              <p className="mt-1">SOC2 compliant • Enterprise ready • 24/7 support</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
