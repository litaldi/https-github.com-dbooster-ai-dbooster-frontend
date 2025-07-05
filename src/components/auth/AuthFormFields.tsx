
import React from 'react';
import { Mail, User } from 'lucide-react';
import { InputField } from '@/components/forms/InputField';
import { PasswordField } from '@/components/forms/PasswordField';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

interface AuthFormFieldsProps {
  authMode: AuthMode;
  formData: AuthFormData;
  errors: Partial<AuthFormData>;
  updateField: (field: keyof AuthFormData, value: string | boolean) => void;
}

export function AuthFormFields({ authMode, formData, errors, updateField }: AuthFormFieldsProps) {
  return (
    <>
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
    </>
  );
}
