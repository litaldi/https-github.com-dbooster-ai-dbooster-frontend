
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

export interface InteractiveButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  intensity?: 'subtle' | 'normal' | 'strong';
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ children, className, intensity = 'normal', ...props }, ref) => {
    const getAnimationProps = () => {
      switch (intensity) {
        case 'subtle':
          return {
            whileTap: { scale: 0.99 },
            whileHover: { scale: 1.01, y: -1 }
          };
        case 'strong':
          return {
            whileTap: { scale: 0.95 },
            whileHover: { scale: 1.05, y: -2 }
          };
        default:
          return {
            whileTap: { scale: 0.98 },
            whileHover: { scale: 1.02, y: -1 }
          };
      }
    };

    return (
      <motion.div 
        {...getAnimationProps()}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Button 
          ref={ref} 
          className={`${className} button-enhanced`} 
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';

export function FloatingElement({ 
  children, 
  className, 
  intensity = 'normal' 
}: { 
  children: React.ReactNode; 
  className?: string; 
  intensity?: 'subtle' | 'normal' | 'strong' 
}) {
  const getFloatClass = () => {
    switch (intensity) {
      case 'subtle': return 'float-subtle';
      case 'strong': return 'float-gentle';
      default: return 'float-gentle';
    }
  };

  return (
    <div className={`${getFloatClass()} ${className}`}>
      {children}
    </div>
  );
}

export function PulseElement({ 
  children, 
  className, 
  intensity = 'medium' 
}: { 
  children: React.ReactNode; 
  className?: string; 
  intensity?: 'low' | 'medium' | 'high' 
}) {
  const getScaleRange = () => {
    switch (intensity) {
      case 'low': return [1, 1.02, 1];
      case 'high': return [1, 1.08, 1];
      default: return [1, 1.05, 1];
    }
  };

  const getOpacityRange = () => {
    switch (intensity) {
      case 'low': return [1, 0.9, 1];
      case 'high': return [1, 0.6, 1];
      default: return [1, 0.8, 1];
    }
  };

  return (
    <motion.div
      animate={{
        scale: getScaleRange(),
        opacity: getOpacityRange(),
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ 
  children, 
  className,
  liftHeight = 4
}: { 
  children: React.ReactNode; 
  className?: string;
  liftHeight?: number;
}) {
  return (
    <motion.div
      whileHover={{ y: -liftHeight }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleOnHover({ 
  children, 
  className,
  scale = 1.05
}: { 
  children: React.ReactNode; 
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`hover-scale ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function TapFeedback({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={`tap-feedback ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SwipeableCard({ 
  children, 
  className,
  onSwipeLeft,
  onSwipeRight
}: { 
  children: React.ReactNode; 
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 && onSwipeRight) {
          onSwipeRight();
        } else if (info.offset.x < -100 && onSwipeLeft) {
          onSwipeLeft();
        }
      }}
      whileDrag={{ scale: 1.02, rotate: info => info.offset.x / 10 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
