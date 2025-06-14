
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface EnhancedCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function EnhancedCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className,
  error,
  required = false,
  size = 'md'
}: EnhancedCheckboxProps) {
  const hasError = !!error;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base', 
    lg: 'text-lg'
  };

  const checkboxSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(
            'mt-0.5 transition-colors',
            checkboxSizeClasses[size],
            hasError && 'border-destructive data-[state=checked]:bg-destructive'
          )}
          aria-describedby={cn(
            description && `${id}-description`,
            hasError && `${id}-error`
          )}
          aria-invalid={hasError}
          aria-required={required}
        />
        <div className="grid gap-1.5 leading-none flex-1">
          <Label
            htmlFor={id}
            className={cn(
              'font-medium leading-none cursor-pointer transition-colors',
              sizeClasses[size],
              hasError && 'text-destructive',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {label}
            {required && (
              <span className="text-destructive ml-1" aria-label="required">*</span>
            )}
          </Label>
          {description && (
            <p 
              id={`${id}-description`}
              className={cn(
                'text-muted-foreground leading-relaxed',
                size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs',
                disabled && 'opacity-50'
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      
      {hasError && (
        <p 
          id={`${id}-error`}
          className="text-sm text-destructive flex items-center gap-1 ml-6"
          role="alert"
          aria-live="polite"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
