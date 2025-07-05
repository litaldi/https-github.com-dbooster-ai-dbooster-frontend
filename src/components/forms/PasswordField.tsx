
import React, { useState, useEffect } from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordStrengthIndicator } from '@/components/security/PasswordStrengthIndicator';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
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
  const [strengthResult, setStrengthResult] = useState({
    score: 0,
    feedback: [] as string[],
    isValid: false
  });

  useEffect(() => {
    if (value && showStrength) {
      // Validate password strength asynchronously
      consolidatedAuthenticationSecurity.validateStrongPassword(value)
        .then(result => {
          setStrengthResult({
            score: result.score,
            feedback: result.feedback,
            isValid: result.isValid
          });
        })
        .catch(() => {
          setStrengthResult({
            score: 0,
            feedback: ['Unable to validate password strength'],
            isValid: false
          });
        });
    } else {
      setStrengthResult({
        score: 0,
        feedback: [],
        isValid: false
      });
    }
  }, [value, showStrength]);

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
