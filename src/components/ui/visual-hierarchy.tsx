
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({ children, className, spacing = 'md' }: SectionProps) {
  const spacingClasses = {
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16'
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ children, className, size = 'lg' }: ContainerProps) {
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

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg';
}

export function Grid({ children, className, cols = 1, gap = 'md' }: GridProps) {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12'
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div className={cn('grid', colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

interface StackProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end';
}

export function Stack({ 
  children, 
  className, 
  direction = 'vertical', 
  spacing = 'md',
  align = 'start'
}: StackProps) {
  const directionClasses = direction === 'vertical' ? 'flex-col' : 'flex-row';
  
  const spacingClasses = {
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  };

  return (
    <div className={cn(
      'flex',
      directionClasses,
      spacingClasses[spacing],
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  );
}

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Heading({ children, level = 1, size, className }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const defaultSizes = {
    1: 'text-4xl font-bold tracking-tight lg:text-5xl',
    2: 'text-3xl font-semibold tracking-tight',
    3: 'text-2xl font-semibold tracking-tight',
    4: 'text-xl font-semibold tracking-tight',
    5: 'text-lg font-semibold tracking-tight',
    6: 'text-base font-semibold tracking-tight'
  };

  const customSizes = {
    sm: 'text-sm font-semibold tracking-tight',
    md: 'text-base font-semibold tracking-tight',
    lg: 'text-lg font-semibold tracking-tight',
    xl: 'text-xl font-semibold tracking-tight',
    '2xl': 'text-2xl font-semibold tracking-tight'
  };

  const finalClassName = size ? customSizes[size] : defaultSizes[level];

  return (
    <Tag className={cn(finalClassName, className)}>
      {children}
    </Tag>
  );
}

interface TextProps {
  children: React.ReactNode;
  variant?: 'body' | 'small' | 'large' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Text({ children, variant = 'body', size, className }: TextProps) {
  const variantClasses = {
    body: 'text-base leading-7',
    small: 'text-sm leading-6',
    large: 'text-lg leading-8',
    muted: 'text-sm text-muted-foreground leading-6'
  };

  const sizeClasses = {
    sm: 'text-sm leading-6',
    md: 'text-base leading-7',
    lg: 'text-lg leading-8',
    xl: 'text-xl leading-9'
  };

  const finalClassName = size ? sizeClasses[size] : variantClasses[variant];

  return (
    <p className={cn(finalClassName, className)}>
      {children}
    </p>
  );
}
