
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedForm } from '@/components/ui/enhanced-form';
import { SocialAuth } from '@/components/auth/SocialAuth';
import { DemoModeButton } from '@/components/auth/DemoModeButton';
import { Separator } from '@/components/ui/separator';
import { FadeIn, PageTransition } from '@/components/ui/animations';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { COPY } from '@/components/ui/enhanced-copy';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
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

  const getFormFields = () => {
    const baseFields = [
      {
        name: 'email',
        type: 'email' as const,
        label: 'Email Address',
        placeholder: COPY.placeholders.email,
        required: true,
      },
      {
        name: 'password',
        type: 'password' as const,
        label: 'Password',
        placeholder: COPY.placeholders.password,
        required: true,
        helperText: authMode === 'signup' ? COPY.help.password : undefined,
      },
    ];

    if (authMode === 'signup') {
      return [
        {
          name: 'firstName',
          type: 'text' as const,
          label: 'First Name',
          placeholder: COPY.placeholders.firstName,
          required: true,
        },
        {
          name: 'lastName',
          type: 'text' as const,
          label: 'Last Name',
          placeholder: COPY.placeholders.lastName,
          required: true,
        },
        ...baseFields,
        {
          name: 'confirmPassword',
          type: 'password' as const,
          label: 'Confirm Password',
          placeholder: COPY.placeholders.confirmPassword,
          required: true,
          validation: (value: string, formData?: Record<string, string>) => {
            if (formData?.password && value !== formData.password) {
              return COPY.errors.passwordMismatch;
            }
            return null;
          },
        },
      ];
    }

    return baseFields;
  };

  const handleAuth = async (data: Record<string, string>) => {
    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const result = await secureLogin(data.email, data.password, {
          rememberMe: true
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
      const errorMessage = err instanceof Error ? err.message : COPY.errors.generic;
      enhancedToast.error({
        title: authMode === 'login' ? 'Sign in failed' : 'Account creation failed',
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFormConfig = () => {
    if (authMode === 'login') {
      return {
        title: 'Welcome back',
        description: 'Sign in to your account to continue optimizing',
        submitLabel: COPY.buttons.signIn,
      };
    } else {
      return {
        title: 'Get started today',
        description: 'Create your account and start optimizing queries',
        submitLabel: COPY.buttons.signUp,
      };
    }
  };

  const config = getFormConfig();

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
        <div className="w-full max-w-md space-y-6">
          <FadeIn>
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                {/* Mode Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="flex rounded-lg bg-muted p-1">
                    <EnhancedButton
                      variant={authMode === 'login' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setAuthMode('login')}
                      className="px-4"
                    >
                      Sign In
                    </EnhancedButton>
                    <EnhancedButton
                      variant={authMode === 'signup' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setAuthMode('signup')}
                      className="px-4"
                    >
                      Sign Up
                    </EnhancedButton>
                  </div>
                </div>

                <EnhancedForm
                  title={config.title}
                  description={config.description}
                  fields={getFormFields()}
                  onSubmit={handleAuth}
                  submitLabel={config.submitLabel}
                  isLoading={isLoading}
                  className="border-0 shadow-none"
                />
              </CardContent>
            </Card>
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
              <p>🚀 Trusted by 10,000+ developers worldwide</p>
              <p className="mt-1">🔒 SOC2 compliant • ⚡ Enterprise ready • 💬 24/7 support</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}
