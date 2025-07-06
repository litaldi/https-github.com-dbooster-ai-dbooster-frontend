
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function EnhancedSkeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md bg-gradient-to-r from-muted via-muted/50 to-muted',
        animate && 'animate-pulse',
        className
      )}
      style={{
        backgroundSize: animate ? '200% 100%' : '100% 100%',
        animation: animate ? 'shimmer 2s infinite linear' : undefined,
      }}
    />
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default',
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const variantClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      <Loader2 className="h-full w-full" />
    </motion.div>
  );
}

interface PageLoadingProps {
  message?: string;
  showLogo?: boolean;
}

export function PageLoading({ 
  message = 'Loading...', 
  showLogo = true 
}: PageLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {showLogo && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="p-4 bg-gradient-to-r from-primary to-blue-600 rounded-2xl shadow-xl"
              >
                <Zap className="h-8 w-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl blur-xl"
              />
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            DBooster
          </h2>
          <p className="text-muted-foreground">{message}</p>
          
          <div className="flex justify-center">
            <LoadingSpinner size="lg" variant="primary" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface ContentSkeletonProps {
  type?: 'card' | 'list' | 'table' | 'dashboard';
  count?: number;
  className?: string;
}

export function ContentSkeleton({ 
  type = 'card', 
  count = 1,
  className 
}: ContentSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="space-y-4 p-6 border rounded-lg">
            <EnhancedSkeleton className="h-4 w-3/4" />
            <EnhancedSkeleton className="h-3 w-full" />
            <EnhancedSkeleton className="h-3 w-2/3" />
            <div className="flex gap-2 pt-2">
              <EnhancedSkeleton className="h-8 w-20" />
              <EnhancedSkeleton className="h-8 w-24" />
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <EnhancedSkeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <EnhancedSkeleton className="h-4 w-full" />
                  <EnhancedSkeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'table':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 p-4 border-b">
              {Array.from({ length: 4 }).map((_, i) => (
                <EnhancedSkeleton key={i} className="h-4" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b">
                {Array.from({ length: 4 }).map((_, j) => (
                  <EnhancedSkeleton key={j} className="h-3" />
                ))}
              </div>
            ))}
          </div>
        );
      
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 border rounded-lg space-y-3">
                  <EnhancedSkeleton className="h-8 w-8 rounded-lg" />
                  <EnhancedSkeleton className="h-4 w-2/3" />
                  <EnhancedSkeleton className="h-6 w-1/2" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 border rounded-lg space-y-4">
                <EnhancedSkeleton className="h-5 w-1/3" />
                <EnhancedSkeleton className="h-64 w-full" />
              </div>
              <div className="p-6 border rounded-lg space-y-4">
                <EnhancedSkeleton className="h-5 w-1/3" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <EnhancedSkeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <EnhancedSkeleton className="h-3 w-full" />
                        <EnhancedSkeleton className="h-2 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <EnhancedSkeleton className="h-20 w-full" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {skeletons.map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  backdrop?: boolean;
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Loading...', 
  backdrop = true 
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            backdrop && 'bg-background/80 backdrop-blur-sm'
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-background border rounded-xl p-8 shadow-xl text-center space-y-4 max-w-sm mx-4"
          >
            <LoadingSpinner size="lg" variant="primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Add the shimmer keyframe to global CSS
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}
`;

// Inject the keyframes if not already present
if (typeof document !== 'undefined' && !document.querySelector('#shimmer-keyframes')) {
  const style = document.createElement('style');
  style.id = 'shimmer-keyframes';
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
