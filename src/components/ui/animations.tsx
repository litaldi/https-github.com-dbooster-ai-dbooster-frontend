
import React from 'react';
import { motion } from 'framer-motion';

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
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
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, className }: AnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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

// Stagger animation components
interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export function StaggerContainer({ 
  children, 
  className, 
  staggerDelay = 0.1,
  delay = 0 
}: StaggerProps) {
  const customVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, duration = 0.4 }: StaggerProps) {
  const customVariants = {
    ...itemVariants,
    visible: {
      ...itemVariants.visible,
      transition: {
        duration,
      },
    },
  };

  return (
    <motion.div variants={customVariants} className={className}>
      {children}
    </motion.div>
  );
}
