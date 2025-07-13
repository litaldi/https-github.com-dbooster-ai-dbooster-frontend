
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordField } from '@/components/forms/PasswordField';
import { Mail, User } from 'lucide-react';

interface AuthFormFieldsProps {
  formData: {
    email: string;
    password: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
  };
  onInputChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  authMode: 'login' | 'signup' | 'reset';
  isLoading: boolean;
}

export function AuthFormFields({
  formData,
  onInputChange,
  errors,
  authMode,
  isLoading
}: AuthFormFieldsProps) {
  return (
    <div className="space-y-4">
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
              onChange={(e) => onInputChange('firstName', e.target.value)}
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
              onChange={(e) => onInputChange('lastName', e.target.value)}
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
          onChange={(e) => onInputChange('email', e.target.value)}
          disabled={isLoading}
          className={errors.email ? 'border-destructive' : ''}
          required
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(value) => onInputChange('password', value)}
        error={errors.password}
        required={true}
        autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
        showStrength={authMode === 'signup'}
      />

      {authMode === 'signup' && (
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword || ''}
          onChange={(value) => onInputChange('confirmPassword', value)}
          error={errors.confirmPassword}
          required={true}
          autoComplete="new-password"
        />
      )}
    </div>
  );
}
