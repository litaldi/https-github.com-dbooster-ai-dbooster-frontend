
import { useState } from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  showStrength?: boolean;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Enter your password',
  error,
  autoComplete = 'current-password',
  showStrength = false
}: PasswordFieldProps) {
  return (
    <div>
      <EnhancedInput
        id={id}
        type="password"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
        showPasswordToggle={true}
        autoComplete={autoComplete}
        required
      />
      <PasswordStrengthIndicator password={value} show={showStrength} />
    </div>
  );
}
