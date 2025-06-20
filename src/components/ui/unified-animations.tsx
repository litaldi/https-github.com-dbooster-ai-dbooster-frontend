
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimationProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  className?: string;
}

export function Animation({ 
  children, 
  type = 'fade',
  direction = 'up',
  duration = 'normal',
  delay = 0,
  className 
}: AnimationProps) {
  const animationClasses = {
    fade: 'animate-fade-in',
    slide: `animate-slide-in-${direction}`,
    scale: 'animate-scale-in',
    bounce: 'animate-bounce'
  };

  const durationClasses = {
    fast: 'duration-200',
    normal: 'duration-300',
    slow: 'duration-500'
  };

  return (
    <div 
      className={cn(
        animationClasses[type],
        durationClasses[duration],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggeredAnimation({ 
  children, 
  staggerDelay = 100,
  className 
}: StaggeredAnimationProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Animation
          key={index}
          delay={index * staggerDelay}
          className="opacity-0 animate-fade-in"
        >
          {child}
        </Animation>
      ))}
    </div>
  );
}

export const animationVariants = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin'
};
