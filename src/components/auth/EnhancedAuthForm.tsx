
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { productionLogger } from '@/utils/productionLogger';
import { Eye, EyeOff, AlertCircle, Mail, Lock, User } from 'lucide-react';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

interface EnhancedAuthFormProps {
  authMode: AuthMode;
  onAuthModeChange: (mode: AuthMode) => void;
  onSubmit: (data: AuthFormData) => Promise<void>;
  isLoading: boolean;
}

export function EnhancedAuthForm({ 
  authMode, 
  onAuthModeChange, 
  onSubmit, 
  isLoading 
}: EnhancedAuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateField = useCallback(async (name: string, value: string): Promise<string | null> => {
    try {
      let context = 'general';
      if (name === 'email') context = 'email';
      
      const result = consolidatedInputValidation.validateAndSanitize(value, context);
      
      if (!result.isValid) {
        return result.errors.join(', ');
      }

      // Additional validation rules
      if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }

      if (name === 'password' && value.length < 8) {
        return 'Password must be at least 8 characters long';
      }

      if (name === 'confirmPassword' && value !== formData.password) {
        return 'Passwords do not match';
      }

      if ((name === 'firstName' || name === 'lastName') && value.trim().length < 2) {
        return 'Name must be at least 2 characters long';
      }

      return null;
    } catch (error) {
      productionLogger.error('Field validation error', error, 'AuthForm');
      return 'Validation error occurred';
    }
  }, [formData.password]);

  const handleInputChange = useCallback(async (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear previous error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Validate field
    const error = await validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;

    const newErrors: Record<string, string> = {};
    const newValidationErrors: string[] = [];

    // Validate all fields
    for (const [field, value] of Object.entries(formData)) {
      if (typeof value === 'string' && value.trim()) {
        const error = await validateField(field, value);
        if (error) {
          newErrors[field] = error;
          newValidationErrors.push(`${field}: ${error}`);
        }
      }
    }

    // Required field validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      newValidationErrors.push('Email is required');
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      newValidationErrors.push('Password is required');
    }

    if (authMode === 'signup') {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
        newValidationErrors.push('First name is required');
      }
      
      if (!formData.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
        newValidationErrors.push('Last name is required');
      }
      
      if (!formData.confirmPassword?.trim()) {
        newErrors.confirmPassword = 'Please confirm your password';
        newValidationErrors.push('Password confirmation is required');
      }
    }

    setErrors(newErrors);
    setValidationErrors(newValidationErrors);

    if (Object.keys(newErrors).length > 0) {
      productionLogger.warn('Form validation failed', { errors: newValidationErrors }, 'AuthForm');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      productionLogger.error('Form submission error', error, 'AuthForm');
    }
  }, [formData, authMode, isLoading, onSubmit, validateField]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors:
            <ul className="mt-2 list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {authMode === 'signup' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={isLoading}
              className={errors.firstName ? 'border-destructive' : ''}
              required
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={isLoading}
              className={errors.lastName ? 'border-destructive' : ''}
              required
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          disabled={isLoading}
          className={errors.email ? 'border-destructive' : ''}
          required
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            disabled={isLoading}
            className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      {authMode === 'signup' && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword || ''}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              disabled={isLoading}
              className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>
      )}

      {authMode === 'login' && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, rememberMe: !!checked }))
            }
            disabled={isLoading}
          />
          <Label 
            htmlFor="rememberMe"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
      </Button>

      <div className="text-center">
        <Button
          type="button"
          variant="link"
          onClick={() => onAuthModeChange(authMode === 'login' ? 'signup' : 'login')}
          disabled={isLoading}
          className="text-sm"
        >
          {authMode === 'login' 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Sign in"
          }
        </Button>
      </div>
    </form>
  );
}
