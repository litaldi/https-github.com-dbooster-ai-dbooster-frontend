
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
