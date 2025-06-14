
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EnhancedCheckboxProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function EnhancedCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
  description,
  disabled = false,
  className
}: EnhancedCheckboxProps) {
  return (
    <div className={cn('flex items-start space-x-3', className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-0.5"
        aria-describedby={description ? `${id}-description` : undefined}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </Label>
        {description && (
          <p 
            id={`${id}-description`}
            className="text-xs text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
