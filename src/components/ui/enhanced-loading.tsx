import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'brand';
  text?: string;
  className?: string;
}

export function EnhancedLoading({ 
  size = 'md', 
  variant = 'spinner',
  text,
  className 
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const containerClasses = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn(
        'flex items-center justify-center',
        containerClasses[size],
        className
      )}>
        <Loader2 className={cn(
          'animate-spin text-primary',
          sizeClasses[size]
        )} />
        {text && (
          <span className="text-muted-foreground font-medium">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn(
        'flex items-center justify-center',
        containerClasses[size],
        className
      )}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn(
                'bg-primary rounded-full',
                size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'
              )}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {text && (
          <span className="text-muted-foreground font-medium ml-3">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn(
        'flex items-center justify-center',
        containerClasses[size],
        className
      )}>
        <motion.div
          className={cn(
            'bg-primary rounded-full',
            sizeClasses[size]
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <span className="text-muted-foreground font-medium">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'brand') {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center space-y-4',
        className
      )}>
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Brain className={cn(
            'text-primary',
            size === 'sm' ? 'h-8 w-8' : size === 'md' ? 'h-12 w-12' : 'h-16 w-16'
          )} />
        </motion.div>
        
        {text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className={cn(
              'text-muted-foreground font-medium',
              containerClasses[size].split(' ')[1]
            )}>
              {text}
            </p>
            <div className="flex justify-center mt-2">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-1 w-1 bg-primary rounded-full"
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return null;
}

// Skeleton loading components
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded animate-pulse w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-3 bg-muted rounded animate-pulse",
            i === lines - 1 ? "w-4/6" : "w-full"
          )}
        />
      ))}
    </div>
  );
}