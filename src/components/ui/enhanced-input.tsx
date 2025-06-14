
import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Label } from './label';
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';
import { Button } from './button';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  showValidation?: boolean;
  isValid?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showClear?: boolean;
  loading?: boolean;
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    showPasswordToggle = false, 
    showValidation = false,
    isValid,
    helperText,
    leftIcon,
    rightIcon,
    onClear,
    showClear = false,
    loading = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;
    const hasError = !!error;
    const showSuccess = showValidation && isValid && !hasError && !loading;
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const handleClear = () => {
      if (onClear) {
        onClear();
      } else if (props.onChange) {
        // Create a synthetic event for clearing
        const syntheticEvent = {
          target: { value: '' },
          currentTarget: { value: '' }
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={inputId} 
            className={cn(
              'text-sm font-medium transition-colors',
              hasError && 'text-destructive',
              showSuccess && 'text-green-600',
              isFocused && 'text-primary'
            )}
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1" aria-label="required">*</span>
            )}
          </Label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <Input
            id={inputId}
            type={inputType}
            className={cn(
              'transition-all duration-200',
              leftIcon && 'pl-10',
              (showPasswordToggle || rightIcon || showClear || showValidation) && 'pr-10',
              hasError && 'border-destructive focus-visible:ring-destructive',
              showSuccess && 'border-green-500 focus-visible:ring-green-500',
              isFocused && 'ring-2 ring-offset-2',
              loading && 'opacity-50',
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
              hasError && `${inputId}-error`,
              helperText && !hasError && `${inputId}-helper`
            )}
            disabled={loading || props.disabled}
            {...props}
          />
          
          <div className="absolute right-0 top-0 h-full flex items-center">
            {showClear && props.value && !loading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                onClick={handleClear}
                aria-label="Clear input"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-full px-3 hover:bg-transparent text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            )}

            {rightIcon && !showPasswordToggle && !showClear && !showValidation && (
              <div className="px-3 text-muted-foreground">
                {rightIcon}
              </div>
            )}

            {showValidation && !showPasswordToggle && !rightIcon && (
              <div className="px-3">
                {loading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-muted border-t-primary rounded-full" />
                ) : showSuccess ? (
                  <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                ) : hasError ? (
                  <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                ) : null}
              </div>
            )}
          </div>
        </div>
        
        {hasError && (
          <p 
            id={`${inputId}-error`}
            className="text-sm text-destructive flex items-center gap-1"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </p>
        )}
        
        {helperText && !hasError && (
          <p 
            id={`${inputId}-helper`}
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
