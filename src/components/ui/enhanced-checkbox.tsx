
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EnhancedCheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function EnhancedCheckbox({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  required = false,
  className
}: EnhancedCheckboxProps) {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        required={required}
        className="mt-0.5"
      />
      <div className="space-y-1">
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            disabled && "opacity-70"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
