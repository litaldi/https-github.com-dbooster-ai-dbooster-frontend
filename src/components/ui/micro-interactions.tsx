
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

export interface InteractiveButtonProps extends React.ComponentProps<typeof Button> {
  children: React.ReactNode;
}

export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
        <Button ref={ref} className={className} {...props}>
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
  const getFloatDistance = () => {
    switch (intensity) {
      case 'subtle': return 5;
      case 'strong': return 15;
      default: return 10;
    }
  };

  return (
    <motion.div
      animate={{
        y: [0, -getFloatDistance(), 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
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
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
