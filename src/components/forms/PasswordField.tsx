
import React, { useState } from 'react';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordStrengthIndicator } from '@/components/security/PasswordStrengthIndicator';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { Lock } from 'lucide-react';
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
  variant = 'default',
  showStrength = false
}: PasswordFieldProps) {
  const { checkPasswordStrength } = useConsolidatedSecurity();
  const [strengthResult, setStrengthResult] = useState({
    score: 0,
    feedback: [],
    isValid: false
  });

  const handlePasswordChange = async (newValue: string) => {
    onChange(newValue);
    
    if (showStrength && newValue) {
      try {
        const result = await checkPasswordStrength(newValue);
        setStrengthResult(result);
      } catch (err) {
        console.error('Password strength check failed:', err);
      }
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <EnhancedInput
        id={id}
        type="password"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => handlePasswordChange(e.target.value)}
        onBlur={onBlur}
        error={error}
        required={required}
        autoComplete={autoComplete}
        variant={variant}
        startIcon={<Lock className="h-4 w-4" />}
        isValid={!error && value.length > 0}
        showValidation={true}
      />
      
      {showStrength && value && (
        <PasswordStrengthIndicator 
          password={value} 
          strengthResult={strengthResult} 
        />
      )}
    </div>
  );
}
