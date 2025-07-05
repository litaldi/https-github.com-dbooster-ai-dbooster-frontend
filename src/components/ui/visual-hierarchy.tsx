
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Section component for consistent spacing
const sectionVariants = cva('w-full', {
  variants: {
    spacing: {
      none: 'py-0',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-20',
      '2xl': 'py-24',
    },
  },
  defaultVariants: {
    spacing: 'md',
  },
});

interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'div' | 'main' | 'article';
}

export function Section({ 
  className, 
  spacing, 
  as: Component = 'section',
  ...props 
}: SectionProps) {
  return (
    <Component
      className={cn(sectionVariants({ spacing }), className)}
      {...props}
    />
  );
}

// Container component for consistent max-width and centering
const containerVariants = cva('mx-auto px-4 sm:px-6 lg:px-8', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-screen-xl',
      full: 'max-w-none',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});

interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export function Container({ className, size, ...props }: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  );
}

// Heading component with consistent typography
const headingVariants = cva('font-bold tracking-tight', {
  variants: {
    level: {
      1: 'scroll-m-20',
      2: 'scroll-m-20',
      3: 'scroll-m-20',
      4: 'scroll-m-20',
      5: 'scroll-m-20',
      6: 'scroll-m-20',
    },
    size: {
      '4xl': 'text-4xl sm:text-5xl lg:text-6xl',
      '3xl': 'text-3xl sm:text-4xl lg:text-5xl',
      '2xl': 'text-2xl sm:text-3xl lg:text-4xl',
      xl: 'text-xl sm:text-2xl lg:text-3xl',
      lg: 'text-lg sm:text-xl lg:text-2xl',
      base: 'text-base sm:text-lg',
    },
  },
  defaultVariants: {
    level: 1,
    size: '2xl',
  },
});

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ 
  className, 
  level = 1, 
  size, 
  children,
  ...props 
}: HeadingProps) {
  const Component = `h${level}` as const;
  
  return (
    <Component
      className={cn(headingVariants({ level, size }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

// Text component for consistent body text
const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      subtle: 'text-muted-foreground/80',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    size: 'base',
    variant: 'default',
    weight: 'normal',
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

export function Text({ 
  className, 
  size, 
  variant, 
  weight,
  as: Component = 'p',
  ...props 
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ size, variant, weight }), className)}
      {...props}
    />
  );
}
