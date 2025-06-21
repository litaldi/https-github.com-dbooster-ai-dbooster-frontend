
import React from 'react';
import { motion } from 'framer-motion';

export interface InteractiveAnimationProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
}

export function HoverScale({ children, className, intensity = 'normal' }: InteractiveAnimationProps) {
  const getScale = () => {
    switch (intensity) {
      case 'subtle': return 1.02;
      case 'strong': return 1.1;
      default: return 1.05;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: getScale() }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({ children, className, intensity = 'normal' }: InteractiveAnimationProps) {
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

export function Pulse({ children, className }: InteractiveAnimationProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1],
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
