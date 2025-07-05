
import React from 'react';
import { motion } from 'framer-motion';

export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

const easeOutQuart = "easeOut";
const easeOutExpo = "easeOut";

export function FadeIn({ children, delay = 0, duration = 0.5, className }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay, 
        ease: easeOutQuart
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, delay = 0, duration = 0.6, className }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay, 
        ease: easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.3, className }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration, 
        delay, 
        ease: easeOutQuart
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ 
  children, 
  delay = 0, 
  duration = 0.4, 
  className, 
  direction = 'left' 
}: AnimationProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'right': return { x: 30 };
      case 'up': return { y: -30 };
      case 'down': return { y: 30 };
      default: return { x: -30 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration, 
        delay, 
        ease: easeOutQuart
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RotateIn({ children, delay = 0, duration = 0.5, className }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10, scale: 0.95 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ 
        duration, 
        delay, 
        ease: easeOutExpo
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function BlurIn({ children, delay = 0, duration = 0.6, className }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ 
        duration, 
        delay, 
        ease: easeOutQuart
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
