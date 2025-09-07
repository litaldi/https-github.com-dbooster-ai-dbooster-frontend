import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  animation?: 'scale' | 'slide' | 'glow' | 'none';
  ripple?: boolean;
}

const buttonVariants = {
  scale: {
    scale: 1.05,
  },
  slide: {
    x: 2,
  },
  glow: {
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
  },
  none: {},
};

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    className, 
    loading = false, 
    loadingText,
    animation = 'scale',
    ripple = false,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.div
        whileHover={!isDisabled ? buttonVariants[animation] : undefined}
        whileTap={!isDisabled ? { scale: 0.95 } : undefined}
        className="relative inline-block"
      >
        <Button
          ref={ref}
          className={cn(
            "relative overflow-hidden transition-all duration-200",
            loading && "cursor-not-allowed",
            ripple && "hover:bg-gradient-to-r hover:from-primary hover:to-blue-600",
            className
          )}
          disabled={isDisabled}
          {...props}
        >
          {/* Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {loadingText && <span>{loadingText}</span>}
            </motion.div>
          )}
          
          {/* Normal content */}
          {!loading && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.div>
          )}

          {/* Ripple effect */}
          {ripple && !isDisabled && (
            <motion.div
              className="absolute inset-0 bg-white opacity-0 rounded-md"
              whileHover={{ opacity: 0.1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </Button>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

// Preset button variants for common use cases
export function PrimaryActionButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton
      animation="scale"
      ripple
      className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
      {...props}
    >
      {children}
    </EnhancedButton>
  );
}

export function SecondaryActionButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton
      animation="slide"
      variant="outline"
      className="border-2 hover:border-primary hover:bg-primary/5 transition-all duration-300"
      {...props}
    >
      {children}
    </EnhancedButton>
  );
}

export function GlowButton({ children, ...props }: EnhancedButtonProps) {
  return (
    <EnhancedButton
      animation="glow"
      className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:shadow-2xl transition-all duration-500"
      {...props}
    >
      {children}
    </EnhancedButton>
  );
}