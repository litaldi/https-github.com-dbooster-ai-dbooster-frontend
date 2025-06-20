
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { EnhancedButton } from './enhanced-button';

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'subtle' | 'bounce';
  disabled?: boolean;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'gradient' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
}

export function InteractiveButton({ 
  children, 
  onClick, 
  className,
  variant = 'default',
  disabled = false,
  buttonVariant = 'default',
  size = 'default'
}: InteractiveButtonProps) {
  const variants = {
    default: {
      whileHover: { scale: 1.05, y: -2 },
      whileTap: { scale: 0.95 }
    },
    subtle: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    },
    bounce: {
      whileHover: { scale: 1.1, rotate: 5 },
      whileTap: { scale: 0.9 }
    }
  };

  return (
    <motion.div
      {...(disabled ? {} : variants[variant])}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <EnhancedButton
        variant={buttonVariant}
        size={size}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={cn(
          'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {children}
      </EnhancedButton>
    </motion.div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium' | 'strong';
}

export function FloatingElement({ 
  children, 
  className,
  intensity = 'medium'
}: FloatingElementProps) {
  const intensities = {
    subtle: { y: [-2, 2, -2], duration: 4 },
    medium: { y: [-5, 5, -5], duration: 3 },
    strong: { y: [-10, 10, -10], duration: 2 }
  };

  const config = intensities[intensity];

  return (
    <motion.div
      animate={{ y: config.y }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PulseElementProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function PulseElement({ 
  children, 
  className,
  intensity = 'medium'
}: PulseElementProps) {
  const intensities = {
    low: { scale: [1, 1.02, 1], duration: 3 },
    medium: { scale: [1, 1.05, 1], duration: 2 },
    high: { scale: [1, 1.1, 1], duration: 1.5 }
  };

  const config = intensities[intensity];

  return (
    <motion.div
      animate={{ scale: config.scale }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowEffect({ 
  children, 
  className,
  color = 'primary'
}: { 
  children: ReactNode; 
  className?: string;
  color?: string;
}) {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{
        boxShadow: `0 0 20px var(--${color})`,
        transition: { duration: 0.3 }
      }}
    >
      {children}
    </motion.div>
  );
}

// Enhanced card interaction
interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function InteractiveCard({
  children,
  className,
  onClick,
  disabled = false
}: InteractiveCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300',
        !disabled && 'cursor-pointer hover:shadow-lg',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={disabled ? {} : { 
        scale: 1.02,
        y: -4,
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
}
