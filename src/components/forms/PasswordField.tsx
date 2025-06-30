
import React from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordStrengthIndicator } from '@/components/security/PasswordStrengthIndicator';
import { authenticationSecurity } from '@/services/security/authenticationSecurity';
import { cn } from '@/lib/utils';

interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  variant?: 'default' | 'filled' | 'outline' | 'floating';
  showStrength?: boolean;
  showPasswordToggle?: boolean;
}

export function PasswordField({
  id,
  label,
  placeholder = 'Enter your password',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete = 'current-password',
  className,
  variant = 'default',
  showStrength = false,
  showPasswordToggle = true
}: PasswordFieldProps) {
  const strengthResult = authenticationSecurity.validatePasswordStrength(value);

  return (
    <div className={cn('space-y-2', className)}>
      <EnhancedInput
        id={id}
        type="password"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={error}
        required={required}
        autoComplete={autoComplete}
        variant={variant}
        showPasswordToggle={showPasswordToggle}
        isValid={!error && value.length > 0}
        showValidation={true}
      />
      {showStrength && (
        <PasswordStrengthIndicator 
          password={value} 
          strengthResult={strengthResult}
        />
      )}
    </div>
  );
}
