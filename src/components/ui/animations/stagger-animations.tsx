
import React from 'react';
import { motion } from 'framer-motion';

export interface StaggerProps {
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
      ease: "easeOut",
    },
  },
};

const fastItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
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
        ...itemVariants.visible.transition,
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

export function FastStaggerContainer({ children, className }: StaggerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FastStaggerItem({ children, className }: StaggerProps) {
  return (
    <motion.div variants={fastItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Legacy aliases for backward compatibility
export const StaggerChildren = StaggerContainer;
export const StaggerChild = StaggerItem;
