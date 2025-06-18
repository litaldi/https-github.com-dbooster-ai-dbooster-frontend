
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Section({ children, spacing = 'md', className }: SectionProps) {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function Container({ children, size = 'lg', className }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </div>
  );
}

interface HeadingProps {
  children: ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

export function Heading({ 
  children, 
  level, 
  size, 
  weight = 'bold', 
  align = 'left', 
  className,
  as 
}: HeadingProps) {
  const Component = as || `h${level}` as keyof JSX.IntrinsicElements;
  
  // Default sizes based on heading level
  const defaultSizes = {
    1: '3xl',
    2: '2xl',
    3: 'xl',
    4: 'lg',
    5: 'md',
    6: 'sm'
  };

  const actualSize = size || defaultSizes[level];
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl lg:text-5xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <Component 
      className={cn(
        sizeClasses[actualSize],
        weightClasses[weight],
        alignClasses[align],
        'leading-tight tracking-tight',
        className
      )}
    >
      {children}
    </Component>
  );
}

interface TextProps {
  children: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  variant?: 'default' | 'muted' | 'subtle' | 'accent';
  align?: 'left' | 'center' | 'right';
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export function Text({ 
  children, 
  size = 'md', 
  weight = 'normal', 
  variant = 'default',
  align = 'left',
  className,
  as = 'p'
}: TextProps) {
  const Component = as;
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const variantClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    subtle: 'text-muted-foreground/80',
    accent: 'text-primary'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <Component 
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        variantClasses[variant],
        alignClasses[align],
        'leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
}

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Spacer({ size = 'md', className }: SpacerProps) {
  const sizeClasses = {
    xs: 'h-2',
    sm: 'h-4',
    md: 'h-6',
    lg: 'h-8',
    xl: 'h-12',
    '2xl': 'h-16'
  };

  return <div className={cn(sizeClasses[size], className)} />;
}

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'dashed' | 'dotted';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Divider({ 
  orientation = 'horizontal', 
  variant = 'default',
  spacing = 'md',
  className 
}: DividerProps) {
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'my-4' : 'mx-4',
    md: orientation === 'horizontal' ? 'my-6' : 'mx-6',
    lg: orientation === 'horizontal' ? 'my-8' : 'mx-8'
  };

  const variantClasses = {
    default: 'border-border',
    dashed: 'border-border border-dashed',
    dotted: 'border-border border-dotted'
  };

  const orientationClasses = {
    horizontal: 'border-t w-full',
    vertical: 'border-l h-full'
  };

  return (
    <div 
      className={cn(
        spacingClasses[spacing],
        variantClasses[variant],
        orientationClasses[orientation],
        className
      )}
    />
  );
}
