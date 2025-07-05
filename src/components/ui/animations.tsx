
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Fade In Animation
const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export function FadeIn({ children, delay = 0, className, duration = 0.6 }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale Animation
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, className }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide In Animation
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  className 
}: SlideInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -50, y: 0 };
      case 'right': return { x: 50, y: 0 };
      case 'up': return { x: 0, y: 50 };
      case 'down': return { x: 0, y: -50 };
      default: return { x: 0, y: 50 };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({ 
  children, 
  className, 
  staggerDelay = 0.1 
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={fadeInVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Hover Scale Effect
interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  className?: string;
}

export function HoverScale({ 
  children, 
  scale = 1.05, 
  className 
}: HoverScaleProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      className={cn('cursor-pointer', className)}
    >
      {children}
    </motion.div>
  );
}

// Parallax Effect
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function Parallax({ children, offset = 50, className }: ParallaxProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: -offset }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
