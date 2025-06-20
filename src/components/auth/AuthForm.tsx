
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFields } from './AuthFormFields';
import { AuthFormActions } from './AuthFormActions';
import { SocialAuth } from './SocialAuth';
import { DemoModeButton } from './DemoModeButton';
import { useToast } from '@/hooks/use-toast';
import type { AuthMode, AuthFormData, LoginType } from '@/types/auth';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loginType, setLoginType] = useState<LoginType>('email');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    phone: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useSimpleAuth();
  const { toast } = useToast();

  const handleFormDataChange = (data: Partial<AuthFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'login') {
        const identifier = loginType === 'email' ? formData.email : formData.phone;
        const result = await signIn(identifier, formData.password);
        
        if (result.error) {
          toast({
            title: 'Sign in failed',
            description: result.error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have been signed in successfully.'
          });
        }
      } else {
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name
        };
        
        const result = await signUp(userData);
        
        if (result.error) {
          toast({
            title: 'Sign up failed',
            description: result.error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Account created!',
            description: 'Welcome! Your account has been created successfully.'
          });
        }
      }
    } catch (error: any) {
      toast({
        title: mode === 'login' ? 'Sign in failed' : 'Sign up failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <AuthFormHeader 
          mode={mode} 
          onModeChange={setMode} 
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialAuth />
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthFormFields
            mode={mode}
            loginType={loginType}
            onLoginTypeChange={setLoginType}
            formData={formData}
            onChange={handleFormDataChange}
            errors={errors}
          />
          
          <AuthFormActions
            mode={mode}
            isLoading={isLoading}
            onToggleMode={toggleMode}
          />
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or try demo
            </span>
          </div>
        </div>
        
        <DemoModeButton />
      </CardContent>
    </Card>
  );
}
