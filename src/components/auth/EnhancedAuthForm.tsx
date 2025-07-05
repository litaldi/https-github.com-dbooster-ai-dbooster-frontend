
import React, { useState } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { EnhancedCheckbox } from '@/components/ui/enhanced-checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputField } from '@/components/forms/InputField';
import { PasswordField } from '@/components/forms/PasswordField';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { Mail, Lock, User, ArrowRight, Shield, Zap } from 'lucide-react';
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
    
    const newErrors: Partial<AuthFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Work email is required for enterprise access';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required to secure your account';
    } else if (authMode === 'signup' && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters for enterprise security';
    }
    
    if (authMode === 'signup') {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = 'First name helps us personalize your experience';
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = 'Last name is required for your professional profile';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords must match exactly';
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

  const cardTitle = authMode === 'login' 
    ? 'Welcome back to DBooster' 
    : 'Start your enterprise trial';
    
  const cardDescription = authMode === 'login'
    ? 'Sign in to access your database optimization workspace'
    : 'Join thousands of teams reducing database costs by 60%';

  return (
    <Card className={cn('w-full max-w-md mx-auto shadow-xl border-0', className)}>
      <CardHeader className="space-y-1 text-center pb-6">
        <ScaleIn delay={0.1}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-primary">DBooster</span>
          </div>
        </ScaleIn>
        
        <ScaleIn delay={0.2}>
          <CardTitle className="text-2xl font-bold">
            {cardTitle}
          </CardTitle>
        </ScaleIn>
        
        <FadeIn delay={0.3}>
          <p className="text-muted-foreground text-sm">
            {cardDescription}
          </p>
        </FadeIn>

        {authMode === 'signup' && (
          <FadeIn delay={0.4}>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>SOC2 Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>2min Setup</span>
              </div>
            </div>
          </FadeIn>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
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
              label="Work Email"
              type="email"
              placeholder="you@company.com"
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
              placeholder={authMode === 'login' ? 'Enter your password' : 'Create a secure password'}
              value={formData.password}
              onChange={(value) => updateField('password', value)}
              error={errors.password}
              required
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              variant="filled"
              showStrength={authMode === 'signup'}
            />

            {authMode === 'signup' && (
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm your secure password"
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
                  label="Keep me signed in"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => updateField('rememberMe', !!checked)}
                />
                <button
                  type="button"
                  className="text-sm text-primary hover:underline font-medium"
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
              loadingText={authMode === 'login' ? 'Signing you in...' : 'Creating your account...'}
              disabled={isLoading}
            >
              {authMode === 'login' ? 'Sign in to DBooster' : 'Start free enterprise trial'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnhancedButton>
          </form>
        </FadeIn>

        <FadeIn delay={0.6}>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {authMode === 'login' ? "New to DBooster? " : 'Already optimizing with us? '}
            </span>
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => onAuthModeChange(authMode === 'login' ? 'signup' : 'login')}
              disabled={isLoading}
            >
              {authMode === 'login' ? 'Start your free trial' : 'Sign in to your account'}
            </button>
          </div>
        </FadeIn>

        {authMode === 'signup' && (
          <FadeIn delay={0.7}>
            <div className="text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </div>
          </FadeIn>
        )}
      </CardContent>
    </Card>
  );
}
