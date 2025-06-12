
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

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={props.id} className={cn(error && 'text-destructive')}>
            {label}
          </Label>
        )}
        <div className="relative">
          <Input
            type={inputType}
            className={cn(
              'transition-all duration-200',
              error && 'border-destructive focus-visible:ring-destructive',
              isValid && 'border-green-500 focus-visible:ring-green-500',
              isFocused && 'ring-2 ring-ring ring-offset-2',
              showPasswordToggle && 'pr-10',
              showValidation && 'pr-10',
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
            {...props}
          />
          
          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}

          {showValidation && isValid !== undefined && (
            <div className="absolute right-0 top-0 h-full flex items-center px-3">
              {isValid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';
