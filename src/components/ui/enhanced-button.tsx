
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  ariaLabel?: string;
  fullWidth?: boolean;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    loading = false, 
    loadingText = "Loading...", 
    icon,
    tooltip,
    ariaLabel,
    fullWidth = false,
    className,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        ref={ref}
        className={cn(
          'transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2',
          fullWidth && 'w-full',
          loading && 'cursor-not-allowed',
          className
        )}
        disabled={isDisabled}
        aria-label={ariaLabel || (typeof children === 'string' ? children as string : undefined)}
        aria-describedby={tooltip ? `${props.id || 'button'}-tooltip` : undefined}
        title={tooltip}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton };
