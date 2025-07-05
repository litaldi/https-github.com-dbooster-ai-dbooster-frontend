
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
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
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
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Pulse({ children, className, intensity = 'normal' }: InteractiveAnimationProps) {
  const getPulseRange = () => {
    switch (intensity) {
      case 'subtle': return [1, 1.02, 1];
      case 'strong': return [1, 1.08, 1];
      default: return [1, 1.05, 1];
    }
  };

  return (
    <motion.div
      animate={{
        scale: getPulseRange(),
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInOut({ 
  children, 
  className, 
  direction = 'left',
  isVisible = true 
}: InteractiveAnimationProps & { 
  direction?: 'left' | 'right' | 'up' | 'down';
  isVisible?: boolean;
}) {
  const getVariants = () => {
    const distance = 20;
    switch (direction) {
      case 'right': return { hidden: { x: distance }, visible: { x: 0 } };
      case 'up': return { hidden: { y: -distance }, visible: { y: 0 } };
      case 'down': return { hidden: { y: distance }, visible: { y: 0 } };
      default: return { hidden: { x: -distance }, visible: { x: 0 } };
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, ...getVariants().hidden },
        visible: { opacity: 1, ...getVariants().visible }
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GestureInteractive({ 
  children, 
  className,
  onSwipeLeft,
  onSwipeRight 
}: InteractiveAnimationProps & {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100 && onSwipeRight) {
          onSwipeRight();
        } else if (info.offset.x < -100 && onSwipeLeft) {
          onSwipeLeft();
        }
      }}
      whileDrag={{ scale: 1.02 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
