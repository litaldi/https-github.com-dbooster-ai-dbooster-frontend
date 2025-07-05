
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  touchTarget?: boolean;
}

export function EnhancedButton({
  children,
  loading = false,
  loadingText = 'Loading...',
  ariaLabel,
  ariaDescribedBy,
  touchTarget = true,
  className,
  disabled,
  ...props
}: EnhancedButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        // Enhanced focus indicators for accessibility
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'transition-all duration-200 ease-in-out',
        // Touch target optimization (minimum 44px)
        touchTarget && 'min-h-[44px] min-w-[44px]',
        // High contrast support
        'contrast-more:border-2 contrast-more:border-current',
        className
      )}
    >
      {loading && (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText}</span>
        </>
      )}
      {children}
    </Button>
  );
}
