
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StandardPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

export function StandardPageLayout({
  children,
  title,
  subtitle,
  description,
  className,
  maxWidth = 'xl',
  centered = false
}: StandardPageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'min-h-screen bg-background',
      className
    )}>
      <div className={cn(
        'container mx-auto px-4 py-12',
        maxWidthClasses[maxWidth],
        centered && 'text-center'
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            'bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'
          )}>
            {title}
          </h1>
          
          {subtitle && (
            <h2 className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
              {subtitle}
            </h2>
          )}
          
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
