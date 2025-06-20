
import React, { useState } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCheckbox } from '@/components/ui/enhanced-checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputField } from '@/components/forms/InputField';
import { PasswordField } from '@/components/forms/PasswordField';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { Mail, Lock, User, ArrowRight, Github, Chrome } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuthMode } from '@/types/auth';

interface EnhancedAuthFormProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

export function EnhancedAuthForm({
  authMode,
  onAuthModeChange,
  onSubmit,
  isLoading = false,
  className
}: EnhancedAuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Partial<AuthFormData> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (authMode === 'signup') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    await onSubmit(formData);
  };

  const updateField = (field: keyof AuthFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto', className)}>
      <CardHeader className="space-y-1 text-center">
        <ScaleIn delay={0.1}>
          <CardTitle className="text-2xl font-bold">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
        </ScaleIn>
        <FadeIn delay={0.2}>
          <p className="text-muted-foreground">
            {authMode === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Get started with your free account'
            }
          </p>
        </FadeIn>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Social Auth Buttons */}
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-2 gap-3">
            <EnhancedButton 
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              <Github className="h-4 w-4" />
              GitHub
            </EnhancedButton>
            <EnhancedButton 
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={isLoading}
            >
              <Chrome className="h-4 w-4" />
              Google
            </EnhancedButton>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={0.5}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  id="firstName"
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName || ''}
                  onChange={(value) => updateField('firstName', value)}
                  error={errors.firstName}
                  required
                  startIcon={<User className="h-4 w-4" />}
                  variant="filled"
                />
                <InputField
                  id="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName || ''}
                  onChange={(value) => updateField('lastName', value)}
                  error={errors.lastName}
                  required
                  variant="filled"
                />
              </div>
            )}

            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(value) => updateField('email', value)}
              error={errors.email}
              required
              autoComplete="email"
              startIcon={<Mail className="h-4 w-4" />}
              variant="filled"
            />

            <PasswordField
              id="password"
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => updateField('password', value)}
              error={errors.password}
              required
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              variant="filled"
            />

            {authMode === 'signup' && (
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword || ''}
                onChange={(value) => updateField('confirmPassword', value)}
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                variant="filled"
              />
            )}

            {authMode === 'login' && (
              <div className="flex items-center justify-between">
                <EnhancedCheckbox
                  id="rememberMe"
                  label="Remember me"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => updateField('rememberMe', !!checked)}
                />
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                  onClick={() => onAuthModeChange('reset')}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <EnhancedButton
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
              loadingText={authMode === 'login' ? 'Signing in...' : 'Creating account...'}
              disabled={isLoading}
            >
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnhancedButton>
          </form>
        </FadeIn>

        {/* Mode Toggle */}
        <FadeIn delay={0.6}>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => onAuthModeChange(authMode === 'login' ? 'signup' : 'login')}
              disabled={isLoading}
            >
              {authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </FadeIn>
      </CardContent>
    </Card>
  );
}
