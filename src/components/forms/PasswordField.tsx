
import React from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
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
}

export function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
  className,
  variant = 'default'
}: PasswordFieldProps) {
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
        showPasswordToggle={true}
        isValid={!error && value.length > 0}
        showValidation={true}
      />
    </div>
  );
}
