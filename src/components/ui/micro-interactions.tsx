
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'subtle' | 'bounce';
  disabled?: boolean;
}

export function InteractiveButton({ 
  children, 
  onClick, 
  className,
  variant = 'default',
  disabled = false
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
    <motion.button
      className={cn(
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...(disabled ? {} : variants[variant])}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
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
