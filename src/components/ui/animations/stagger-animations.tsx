
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const fastContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const StaggerContainer = ({ children, className = '' }: StaggerProps) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '' }: StaggerProps) => (
  <motion.div
    variants={itemVariants}
    className={className}
  >
    {children}
  </motion.div>
);

export const FastStaggerContainer = ({ children, className = '' }: StaggerProps) => (
  <motion.div
    variants={fastContainerVariants}
    initial="hidden"
    animate="visible"
    className={className}
  >
    {children}
  </motion.div>
);

export const FastStaggerItem = ({ children, className = '' }: StaggerProps) => (
  <motion.div
    variants={itemVariants}
    className={className}
  >
    {children}
  </motion.div>
);
