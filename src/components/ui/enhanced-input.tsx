
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface EnhancedInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outline' | 'floating';
  isValid?: boolean;
  showValidation?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
}

export function EnhancedInput({
  label,
  error,
  startIcon,
  endIcon,
  variant = 'default',
  isValid,
  showValidation,
  maxLength,
  showCharCount,
  className,
  type,
  value,
  id,
  ...props
}: EnhancedInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword && showPassword ? 'text' : type;
  
  const inputVariants = {
    default: '',
    filled: 'bg-muted/50 border-0 focus:bg-background',
    outline: 'border-2',
    floating: 'peer placeholder-transparent'
  };

  return (
    <div className="space-y-2">
      {label && variant !== 'floating' && (
        <Label htmlFor={id} className={cn(error && "text-destructive")}>
          {label}
        </Label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}
        
        <Input
          id={id}
          type={actualType}
          value={value}
          className={cn(
            inputVariants[variant],
            startIcon && "pl-10",
            (endIcon || isPassword || showValidation) && "pr-10",
            error && "border-destructive",
            isValid && showValidation && "border-green-500",
            className
          )}
          {...props}
        />
        
        {variant === 'floating' && label && (
          <Label
            htmlFor={id}
            className={cn(
              "absolute left-3 -top-2.5 bg-background px-1 text-sm transition-all",
              "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base",
              "peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-sm",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {label}
          </Label>
        )}
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {showValidation && (
            <>
              {isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
              {error && <XCircle className="h-4 w-4 text-destructive" />}
            </>
          )}
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          
          {endIcon && !isPassword && !showValidation && endIcon}
        </div>
      </div>
      
      <div className="flex justify-between">
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        {showCharCount && maxLength && (
          <p className="text-sm text-muted-foreground ml-auto">
            {String(value || '').length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
