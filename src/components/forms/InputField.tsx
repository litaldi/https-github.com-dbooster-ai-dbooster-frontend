
import React from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  variant?: 'default' | 'filled' | 'outline' | 'floating';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  maxLength?: number;
  showCharCount?: boolean;
}

export function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  autoComplete,
  className,
  variant = 'default',
  startIcon,
  endIcon,
  maxLength,
  showCharCount
}: InputFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <EnhancedInput
        id={id}
        type={type}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        error={error}
        required={required}
        autoComplete={autoComplete}
        variant={variant}
        startIcon={startIcon}
        endIcon={endIcon}
        maxLength={maxLength}
        showCharCount={showCharCount}
        isValid={!error && value.length > 0}
        showValidation={true}
      />
    </div>
  );
}
