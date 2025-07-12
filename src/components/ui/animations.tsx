
import React from 'react';
import { motion } from 'framer-motion';

interface AnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, className, delay = 0, duration = 0.5 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className, delay = 0, duration = 0.4 }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, className, direction = 'left', delay = 0, duration = 0.4 }: AnimationProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -30, opacity: 0 };
      case 'right': return { x: 30, opacity: 0 };
      case 'up': return { y: -30, opacity: 0 };
      case 'down': return { y: 30, opacity: 0 };
      default: return { x: -30, opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, delay = 0 }: AnimationProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, delay = 0 }: AnimationProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Interactive animations
export function HoverScale({ children, className, intensity = 'normal' }: AnimationProps & { intensity?: 'subtle' | 'normal' | 'strong' }) {
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
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger aliases for backward compatibility
export const StaggerContainer = Stagger;
export const StaggerChild = StaggerItem;
