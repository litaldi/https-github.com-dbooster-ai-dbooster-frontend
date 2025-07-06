
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/ui/animations';
import { cn } from '@/lib/utils';
import { AuthHeader } from './AuthHeader';
import { AuthFormFields } from './AuthFormFields';
import { AuthFormActions } from './AuthFormActions';
import { AuthFormFooter } from './AuthFormFooter';
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

  const validateForm = (): boolean => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit(formData);
  };

  const updateField = (field: keyof AuthFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className={cn('w-full max-w-md mx-auto shadow-xl border-0', className)}>
      <AuthHeader authMode={authMode} />

      <CardContent className="space-y-6">
        <FadeIn delay={0.5}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthFormFields
              authMode={authMode}
              formData={formData}
              errors={errors}
              updateField={updateField}
            />

            <AuthFormActions
              authMode={authMode}
              formData={formData}
              isLoading={isLoading}
              updateField={updateField}
              onAuthModeChange={onAuthModeChange}
            />
          </form>
        </FadeIn>

        <AuthFormFooter
          authMode={authMode}
          isLoading={isLoading}
          onAuthModeChange={onAuthModeChange}
        />
      </CardContent>
    </Card>
  );
}
