
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginTypeSelector } from './LoginTypeSelector';
import { PasswordField } from './PasswordField';
import type { AuthMode, AuthFormData, LoginType } from '@/types/auth';

interface AuthFormFieldsProps {
  mode: AuthMode;
  loginType: LoginType;
  onLoginTypeChange: (type: LoginType) => void;
  formData: AuthFormData;
  onChange: (data: Partial<AuthFormData>) => void;
  errors: Partial<Record<keyof AuthFormData, string>>;
}

export function AuthFormFields({
  mode,
  loginType,
  onLoginTypeChange,
  formData,
  onChange,
  errors
}: AuthFormFieldsProps) {
  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    onChange({ [field]: value });
  };

  const isSignup = mode === 'register';

  return (
    <div className="space-y-4">
      {mode === 'login' && (
        <LoginTypeSelector
          loginType={loginType}
          onTypeChange={onLoginTypeChange}
        />
      )}

      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>
      )}

      {(mode === 'register' || loginType === 'email') && (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      )}

      {mode === 'login' && loginType === 'phone' && (
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>
      )}

      <PasswordField
        value={formData.password}
        onChange={(value) => handleInputChange('password', value)}
        error={errors.password}
        label="Password"
        placeholder="Enter your password"
      />

      {isSignup && (
        <PasswordField
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          error={errors.confirmPassword}
          label="Confirm Password"
          placeholder="Confirm your password"
        />
      )}
    </div>
  );
}
