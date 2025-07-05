
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.5, className }: AnimationProps) {
  return (
    <div 
      className={cn("animate-fade-in", className)}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.3, className }: AnimationProps) {
  return (
    <div 
      className={cn("animate-scale-in", className)}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
}

export function SlideIn({ children, delay = 0, duration = 0.4, className }: AnimationProps) {
  return (
    <div 
      className={cn("animate-slide-in-right", className)}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      {children}
    </div>
  );
}

// Page transition wrapper
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}

// Export all animation components from the modular system without duplicates
export * from './animations/basic-animations';
export * from './animations/interactive-animations';
export { 
  StaggerContainer, 
  StaggerItem,
  FastStaggerContainer,
  FastStaggerItem
} from './animations/stagger-animations';
