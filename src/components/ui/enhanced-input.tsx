
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Label } from './label';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from './button';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  showValidation?: boolean;
  isValid?: boolean;
  helperText?: string;
}

export const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    showPasswordToggle = false, 
    showValidation = false,
    isValid,
    helperText,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;
    const hasError = !!error;
    const showSuccess = showValidation && isValid && !hasError;

    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={props.id} 
            className={cn(
              'text-sm font-medium transition-colors',
              hasError && 'text-destructive',
              showSuccess && 'text-green-600'
            )}
          >
            {label}
            {props.required && <span className="text-destructive ml-1" aria-label="required">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            type={inputType}
            className={cn(
              'transition-all duration-200 pr-10',
              hasError && 'border-destructive focus-visible:ring-destructive',
              showSuccess && 'border-green-500 focus-visible:ring-green-500',
              isFocused && 'ring-2 ring-offset-2',
              showPasswordToggle && 'pr-20',
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={hasError}
            aria-describedby={cn(
              hasError && `${props.id}-error`,
              helperText && !hasError && `${props.id}-helper`
            )}
            {...props}
          />
          
          <div className="absolute right-0 top-0 h-full flex items-center">
            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </Button>
            )}

            {showValidation && !showPasswordToggle && (
              <div className="px-3">
                {showSuccess ? (
                  <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                ) : hasError ? (
                  <X className="h-4 w-4 text-destructive" aria-hidden="true" />
                ) : null}
              </div>
            )}
          </div>
        </div>
        
        {hasError && (
          <p 
            id={`${props.id}-error`}
            className="text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        
        {helperText && !hasError && (
          <p 
            id={`${props.id}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';
