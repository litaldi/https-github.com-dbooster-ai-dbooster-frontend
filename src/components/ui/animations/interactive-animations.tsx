
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverScaleProps {
  children: ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({ children, scale = 1.02, className }: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </motion.div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

export function FloatingElement({ children, duration = 3, className }: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface PulseProps {
  children: ReactNode;
  scale?: [number, number];
  duration?: number;
  className?: string;
}

export function Pulse({ children, scale = [1, 1.05], duration = 2, className }: PulseProps) {
  return (
    <motion.div
      animate={{
        scale,
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
