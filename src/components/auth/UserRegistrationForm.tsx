
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { useAuth } from '@/contexts/auth-context';
import { useEnhancedPasswordValidation } from '@/hooks/useEnhancedPasswordValidation';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { validateEmail, validateName } from '@/utils/validation';
import { UserPlus, Mail, User, Lock } from 'lucide-react';

interface UserRegistrationFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function UserRegistrationForm({ onSuccess, onSwitchToLogin }: UserRegistrationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();

  // Enhanced password validation
  const { validationResult, isValidating } = useEnhancedPasswordValidation(
    formData.password,
    {
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`.trim()
    }
  );

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    const firstNameError = validateName(formData.firstName);
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName);
    if (lastNameError) newErrors.lastName = lastNameError;

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Enhanced password validation
    if (validationResult && !validationResult.isValid) {
      newErrors.password = 'Please create a stronger password';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Wait for password validation to complete
    if (isValidating) return;
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
      const result = await signUp(formData.email, formData.password, fullName, formData.acceptedTerms);
      
      if (result.error) {
        enhancedToast.error({
          title: 'Registration failed',
          description: result.error
        });
      } else {
        enhancedToast.success({
          title: 'Registration successful!',
          description: 'Please check your email to verify your account.'
        });
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      enhancedToast.error({
        title: 'Registration failed',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserPlus className="h-5 w-5" />
          Create Account
        </CardTitle>
        <CardDescription>
          Join DBooster to start optimizing your database queries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={formData.firstName}
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
                value={formData.lastName}
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

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
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
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              className={errors.password ? 'border-destructive' : ''}
              required
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Enhanced Password Strength Indicator */}
          {formData.password && (
            <PasswordStrengthIndicator
              password={formData.password}
              validationResult={validationResult}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              disabled={isLoading}
              className={errors.confirmPassword ? 'border-destructive' : ''}
              required
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acceptedTerms"
              checked={formData.acceptedTerms}
              onCheckedChange={(checked) => handleInputChange('acceptedTerms', !!checked)}
            />
            <Label htmlFor="acceptedTerms" className="text-sm">
              I accept the{' '}
              <a href="/terms" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </Label>
          </div>
          {errors.acceptedTerms && (
            <p className="text-sm text-destructive">{errors.acceptedTerms}</p>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || isValidating || (validationResult && !validationResult.isValid)}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {onSwitchToLogin && (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-primary hover:underline"
                disabled={isLoading}
              >
                Sign in instead
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
