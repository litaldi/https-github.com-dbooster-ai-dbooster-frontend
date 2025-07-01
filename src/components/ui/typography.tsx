
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'subtitle';
  color?: 'primary' | 'secondary' | 'muted' | 'accent';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}

const variantStyles = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
  h2: 'text-3xl md:text-4xl font-bold tracking-tight',
  h3: 'text-2xl md:text-3xl font-semibold tracking-tight',
  h4: 'text-xl md:text-2xl font-semibold tracking-tight',
  h5: 'text-lg md:text-xl font-medium tracking-tight',
  h6: 'text-base md:text-lg font-medium tracking-tight',
  body: 'text-base leading-relaxed',
  caption: 'text-sm text-muted-foreground',
  subtitle: 'text-lg text-muted-foreground leading-relaxed'
};

const colorStyles = {
  primary: 'text-foreground',
  secondary: 'text-secondary-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-accent-foreground'
};

const weightStyles = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
};

export function Typography({ 
  children, 
  className, 
  variant = 'body', 
  color = 'primary',
  weight
}: TypographyProps) {
  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';
  
  return (
    <Component 
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weight && weightStyles[weight],
        className
      )}
    >
      {children}
    </Component>
  );
}

export function PageTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Typography 
      variant="h1" 
      className={cn(
        'mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent',
        className
      )}
    >
      {children}
    </Typography>
  );
}

export function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Typography 
      variant="h2" 
      className={cn('mb-6', className)}
    >
      {children}
    </Typography>
  );
}

export function SubsectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Typography 
      variant="h3" 
      className={cn('mb-4', className)}
    >
      {children}
    </Typography>
  );
}
