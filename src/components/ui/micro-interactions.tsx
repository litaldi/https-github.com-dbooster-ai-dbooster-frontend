
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MicroInteractionProps {
  children: ReactNode;
  className?: string;
}

export const InteractiveButton = ({ children, className = '' }: MicroInteractionProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.button>
);

export const PulseElement = ({ children, className = '' }: MicroInteractionProps) => (
  <motion.div
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverLift = ({ children, className = '' }: MicroInteractionProps) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.02 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ScaleOnHover = ({ children, className = '' }: MicroInteractionProps) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
);
