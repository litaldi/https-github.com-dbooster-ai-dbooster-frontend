
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AuthFormHeader } from './AuthFormHeader';
import { AuthFormFields } from './AuthFormFields';
import { AuthFormActions } from './AuthFormActions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

export function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else if (mode === 'signup') {
        await signup(formData.email, formData.password, formData.name);
      }
    } catch (error) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleModeChange = (newMode: AuthMode) => {
    // Only handle login and signup modes in this component
    if (newMode === 'login' || newMode === 'signup') {
      setMode(newMode);
      setErrors({});
    }
  };

  return (
    <div className="space-y-6">
      <AuthFormHeader mode={mode} onModeChange={handleModeChange} />
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthFormFields
          mode={mode === 'reset' ? 'login' : mode}
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
        />

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the errors above and try again.
            </AlertDescription>
          </Alert>
        )}

        <AuthFormActions
          mode={mode === 'reset' ? 'login' : mode}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onModeChange={handleModeChange}
        />
      </form>
    </div>
  );
}
