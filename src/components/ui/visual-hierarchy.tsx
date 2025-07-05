
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  background?: 'default' | 'muted' | 'accent' | 'gradient';
  animated?: boolean;
}

export function Section({ 
  children, 
  className, 
  spacing = 'md', 
  background = 'default',
  animated = false 
}: SectionProps) {
  const spacingClasses = {
    xs: 'py-4',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24',
    '2xl': 'py-32'
  };

  const backgroundClasses = {
    default: '',
    muted: 'bg-muted/30',
    accent: 'bg-accent/5',
    gradient: 'bg-gradient-to-b from-background via-muted/20 to-background'
  };

  const Component = animated ? motion.section : 'section';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    viewport: { once: true, margin: "-50px" }
  } : {};

  return (
    <Component 
      className={cn(
        spacingClasses[spacing], 
        backgroundClasses[background],
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centered?: boolean;
}

export function Container({ 
  children, 
  className, 
  size = 'lg',
  centered = true 
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'w-full px-4 sm:px-6 lg:px-8',
      centered && 'mx-auto',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}

interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  className?: string;
  gradient?: boolean;
  animated?: boolean;
}

export function Heading({ 
  children, 
  level, 
  size, 
  weight,
  className,
  gradient = false,
  animated = false 
}: HeadingProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  const sizeClasses = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
    '3xl': 'text-4xl lg:text-5xl',
    '4xl': 'text-5xl lg:text-6xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  const defaultSizes = {
    1: '4xl',
    2: '3xl',
    3: '2xl',
    4: 'xl',
    5: 'lg',
    6: 'md'
  } as const;

  const defaultWeights = {
    1: 'extrabold',
    2: 'bold',
    3: 'bold',
    4: 'semibold',
    5: 'medium',
    6: 'medium'
  } as const;

  const appliedSize = size || defaultSizes[level];
  const appliedWeight = weight || defaultWeights[level];

  const MotionComponent = animated ? motion.div : React.Fragment;
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    viewport: { once: true }
  } : {};

  const headingContent = (
    <Component 
      className={cn(
        sizeClasses[appliedSize], 
        weightClasses[appliedWeight],
        'tracking-tight leading-tight',
        gradient && 'bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Component>
  );

  if (animated) {
    return (
      <MotionComponent {...animationProps}>
        {headingContent}
      </MotionComponent>
    );
  }

  return headingContent;
}

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'accent' | 'success' | 'warning' | 'destructive';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  animated?: boolean;
}

export function Text({ 
  children, 
  size = 'base', 
  variant = 'default', 
  weight = 'normal',
  className,
  animated = false 
}: TextProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const variantClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-accent-foreground',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    destructive: 'text-destructive'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const Component = animated ? motion.p : 'p';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 10 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    viewport: { once: true }
  } : {};

  return (
    <Component 
      className={cn(
        sizeClasses[size], 
        variantClasses[variant], 
        weightClasses[weight],
        'leading-relaxed',
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dashed' | 'dotted';
}

export function Divider({ 
  className, 
  orientation = 'horizontal',
  variant = 'default' 
}: DividerProps) {
  const orientationClasses = {
    horizontal: 'w-full h-px',
    vertical: 'h-full w-px'
  };

  const variantClasses = {
    default: 'bg-border',
    dashed: 'border-t border-dashed border-border bg-transparent',
    dotted: 'border-t border-dotted border-border bg-transparent'
  };

  return (
    <div 
      className={cn(
        orientationClasses[orientation],
        variantClasses[variant],
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

export function Spacer({ size = 'md' }: { size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  return <div className={sizeClasses[size]} aria-hidden="true" />;
}
