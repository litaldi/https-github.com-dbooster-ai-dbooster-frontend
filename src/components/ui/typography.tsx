
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'lead' | 'large' | 'small' | 'muted' | 'caption';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'destructive';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  align?: 'left' | 'center' | 'right' | 'justify';
  animated?: boolean;
}

const variantStyles = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl',
  h2: 'scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl',
  h3: 'scroll-m-20 text-2xl font-bold tracking-tight lg:text-3xl',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight lg:text-xl',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight lg:text-lg',
  body: 'text-base leading-7',
  lead: 'text-xl text-muted-foreground leading-8',
  large: 'text-lg font-semibold leading-7',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
  caption: 'text-xs text-muted-foreground uppercase tracking-wider'
};

const colorStyles = {
  primary: 'text-primary',
  secondary: 'text-secondary-foreground', 
  muted: 'text-muted-foreground',
  accent: 'text-accent-foreground',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  destructive: 'text-destructive'
};

const weightStyles = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify'
};

export function Typography({ 
  children, 
  className, 
  variant = 'body', 
  color,
  weight,
  align = 'left',
  animated = false
}: TypographyProps) {
  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';
  
  const MotionComponent = animated ? motion.div : React.Fragment;
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    viewport: { once: true }
  } : {};

  const content = (
    <Component 
      className={cn(
        variantStyles[variant],
        color && colorStyles[color],
        weight && weightStyles[weight],
        alignStyles[align],
        className
      )}
    >
      {children}
    </Component>
  );

  if (animated) {
    return (
      <MotionComponent {...animationProps}>
        {content}
      </MotionComponent>
    );
  }

  return content;
}

export function PageTitle({ 
  children, 
  className,
  gradient = true,
  animated = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  gradient?: boolean;
  animated?: boolean;
}) {
  return (
    <Typography 
      variant="h1" 
      animated={animated}
      className={cn(
        'mb-6',
        gradient && 'bg-gradient-to-r from-primary via-primary to-purple-600 bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Typography>
  );
}

export function SectionTitle({ 
  children, 
  className,
  animated = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  animated?: boolean;
}) {
  return (
    <Typography 
      variant="h2" 
      animated={animated}
      className={cn('mb-6', className)}
    >
      {children}
    </Typography>
  );
}

export function SubsectionTitle({ 
  children, 
  className,
  animated = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  animated?: boolean;
}) {
  return (
    <Typography 
      variant="h3" 
      animated={animated}
      className={cn('mb-4', className)}
    >
      {children}
    </Typography>
  );
}

export function Lead({ 
  children, 
  className,
  animated = true 
}: { 
  children: React.ReactNode; 
  className?: string;
  animated?: boolean;
}) {
  return (
    <Typography 
      variant="lead" 
      animated={animated}
      className={cn('mb-6', className)}
    >
      {children}
    </Typography>
  );
}

export function Blockquote({ 
  children, 
  className,
  author 
}: { 
  children: React.ReactNode; 
  className?: string;
  author?: string;
}) {
  return (
    <blockquote className={cn(
      'border-l-4 border-primary pl-6 italic text-lg text-muted-foreground my-6',
      className
    )}>
      <div className="mb-2">{children}</div>
      {author && (
        <cite className="text-sm font-medium not-italic text-foreground">
          — {author}
        </cite>
      )}
    </blockquote>
  );
}

export function Code({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <code className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      className
    )}>
      {children}
    </code>
  );
}
