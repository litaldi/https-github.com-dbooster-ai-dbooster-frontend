
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AuthFormFields } from '@/components/auth/AuthFormFields';
import { validateEmail, validateName, passwordValidator } from '@/utils/validation';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  rememberMe?: boolean;
  acceptedTerms?: boolean;
}

interface EnhancedAuthFormProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading?: boolean;
}

export function EnhancedAuthForm({
  authMode,
  onAuthModeChange,
  onSubmit,
  isLoading = false
}: EnhancedAuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    name: '',
    rememberMe: false,
    acceptedTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = passwordValidator(formData.password);
    if (passwordError) newErrors.password = passwordError;

    // Signup-specific validation
    if (authMode === 'signup') {
      if (formData.firstName) {
        const firstNameError = validateName(formData.firstName);
        if (firstNameError) newErrors.firstName = firstNameError;
      }
      
      if (formData.lastName) {
        const lastNameError = validateName(formData.lastName);
        if (lastNameError) newErrors.lastName = lastNameError;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.acceptedTerms) {
        newErrors.acceptedTerms = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormFields
          formData={formData}
          onInputChange={handleInputChange}
          errors={errors}
          authMode={authMode}
          isLoading={isLoading}
        />

        {authMode === 'login' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
            />
            <Label htmlFor="rememberMe" className="text-sm">
              Remember me
            </Label>
          </div>
        )}

        {authMode === 'signup' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptedTerms"
              checked={formData.acceptedTerms}
              onCheckedChange={(checked) => handleInputChange('acceptedTerms', checked)}
            />
            <Label htmlFor="acceptedTerms" className="text-sm">
              I accept the terms and conditions
            </Label>
            {errors.acceptedTerms && (
              <p className="text-sm text-destructive">{errors.acceptedTerms}</p>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading 
            ? 'Loading...' 
            : authMode === 'login' 
              ? 'Sign In' 
              : authMode === 'signup'
                ? 'Create Account'
                : 'Reset Password'
          }
        </Button>
      </form>

      <div className="text-center">
        {authMode === 'login' ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onAuthModeChange('signup')}
              className="text-sm text-primary hover:underline"
            >
              Don't have an account? Sign up
            </button>
            <br />
            <button
              type="button"
              onClick={() => onAuthModeChange('reset')}
              className="text-sm text-muted-foreground hover:underline"
            >
              Forgot your password?
            </button>
          </div>
        ) : authMode === 'signup' ? (
          <button
            type="button"
            onClick={() => onAuthModeChange('login')}
            className="text-sm text-primary hover:underline"
          >
            Already have an account? Sign in
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAuthModeChange('login')}
            className="text-sm text-primary hover:underline"
          >
            Back to sign in
          </button>
        )}
      </div>
    </div>
  );
}
