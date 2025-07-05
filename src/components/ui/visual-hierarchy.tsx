
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  as?: 'section' | 'article' | 'aside' | 'div';
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

export function Section({ 
  children, 
  className, 
  spacing = 'md', 
  as: Component = 'section',
  ariaLabel,
  ariaLabelledBy
}: SectionProps) {
  const spacingClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16 lg:py-20',
    lg: 'py-16 md:py-20 lg:py-24',
    xl: 'py-20 md:py-24 lg:py-32'
  };

  return (
    <Component 
      className={cn(spacingClasses[spacing], className)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
    >
      {children}
    </Component>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'main' | 'article' | 'section';
}

export function Container({ 
  children, 
  className, 
  size = 'lg',
  as: Component = 'div'
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <Component className={cn(
      'container mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </Component>
  );
}

interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  id?: string;
}

export function Heading({ 
  children, 
  level, 
  size = 'lg', 
  className,
  id
}: HeadingProps) {
  const sizeClasses = {
    xs: 'text-lg md:text-xl',
    sm: 'text-xl md:text-2xl',
    md: 'text-2xl md:text-3xl',
    lg: 'text-3xl md:text-4xl',
    xl: 'text-4xl md:text-5xl',
    '2xl': 'text-4xl md:text-5xl lg:text-6xl',
    '3xl': 'text-5xl md:text-6xl lg:text-7xl'
  };

  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Component 
      id={id}
      className={cn(
        'font-bold tracking-tight scroll-mt-20',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  );
}

interface TextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  variant?: 'default' | 'muted' | 'accent';
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Text({ 
  children, 
  size = 'base', 
  variant = 'default', 
  className,
  as: Component = 'p'
}: TextProps) {
  const sizeClasses = {
    xs: 'text-xs md:text-sm',
    sm: 'text-sm md:text-base',
    base: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl'
  };

  const variantClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-primary'
  };

  return (
    <Component className={cn(
      sizeClasses[size],
      variantClasses[variant],
      'leading-relaxed',
      className
    )}>
      {children}
    </Component>
  );
}

// Enhanced list component with proper accessibility
interface ListProps {
  children: React.ReactNode;
  ordered?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function List({ children, ordered = false, className, ariaLabel }: ListProps) {
  const Component = ordered ? 'ol' : 'ul';
  
  return (
    <Component 
      className={cn('space-y-2', className)}
      aria-label={ariaLabel}
    >
      {children}
    </Component>
  );
}

interface ListItemProps {
  children: React.ReactNode;
  className?: string;
}

export function ListItem({ children, className }: ListItemProps) {
  return (
    <li className={cn('flex items-start gap-2', className)}>
      {children}
    </li>
  );
}
