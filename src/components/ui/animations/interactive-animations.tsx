
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface InteractiveAnimationProps {
  children: ReactNode;
  className?: string;
}

export const HoverScale = ({ children, className = '' }: InteractiveAnimationProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FloatingElement = ({ children, className = '' }: InteractiveAnimationProps) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Pulse = ({ children, className = '' }: InteractiveAnimationProps) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideInOut = ({ children, className = '' }: InteractiveAnimationProps) => (
  <motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 100, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const GestureInteractive = ({ children, className = '' }: InteractiveAnimationProps) => (
  <motion.div
    whileHover={{ scale: 1.02, rotate: 1 }}
    whileTap={{ scale: 0.98 }}
    drag
    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    className={className}
  >
    {children}
  </motion.div>
);
