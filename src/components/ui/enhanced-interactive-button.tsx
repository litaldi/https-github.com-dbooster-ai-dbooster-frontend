
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const enhancedButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
        destructive:
          'bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
        outline:
          'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:scale-105 active:scale-95',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md',
        ghost: 
          'hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95',
        link: 
          'text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-95',
        gradient:
          'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
        glass:
          'bg-background/20 backdrop-blur-md border border-white/20 text-foreground hover:bg-background/30 hover:scale-105 active:scale-95',
        success:
          'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-12 rounded-lg px-8 text-base font-semibold',
        xl: 'h-14 rounded-xl px-10 text-lg font-bold',
        icon: 'h-10 w-10',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      loading: false,
    },
  }
);

export interface EnhancedInteractiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ripple?: boolean;
}

const EnhancedInteractiveButton = React.forwardRef<
  HTMLButtonElement,
  EnhancedInteractiveButtonProps
>(({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  loading = false,
  leftIcon,
  rightIcon,
  ripple = true,
  children,
  onClick,
  ...props 
}, ref) => {
  const [rippleArray, setRippleArray] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const rippleIdRef = React.useRef(0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) return;

    if (ripple && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = rippleIdRef.current++;

      setRippleArray((prev) => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRippleArray((prev) => prev.filter((ripple) => ripple.id !== id));
      }, 600);
    }

    onClick?.(event);
  };

  if (asChild) {
    return (
      <Slot
        className={cn(enhancedButtonVariants({ variant, size, loading, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <motion.button
      className={cn(enhancedButtonVariants({ variant, size, loading, className }))}
      ref={ref}
      onClick={handleClick}
      disabled={loading}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {ripple && rippleArray.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ width: 0, height: 0, x: '-50%', y: '-50%' }}
          animate={{ width: 100, height: 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-current/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      
      <div className="flex items-center gap-2">
        {leftIcon && !loading && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            {leftIcon}
          </motion.span>
        )}
        
        <motion.span
          className={cn(loading && 'invisible')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.span>
        
        {rightIcon && !loading && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            {rightIcon}
          </motion.span>
        )}
      </div>
    </motion.button>
  );
});

EnhancedInteractiveButton.displayName = 'EnhancedInteractiveButton';

export { EnhancedInteractiveButton, enhancedButtonVariants };
