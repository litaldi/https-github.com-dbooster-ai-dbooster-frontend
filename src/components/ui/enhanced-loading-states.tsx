
import React from 'react';
import { Loader2, Database, Zap, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingElement, PulseElement } from '@/components/ui/micro-interactions';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'primary' | 'secondary' | 'muted';
}

export function LoadingSpinner({ size = 'md', className, color = 'primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    muted: 'text-muted-foreground'
  };

  return (
    <Loader2 className={cn(
      'animate-spin',
      sizeClasses[size],
      colorClasses[color],
      className
    )} />
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  message?: string;
  variant?: 'default' | 'database' | 'query' | 'analytics';
}

export function LoadingState({ 
  isLoading, 
  children, 
  fallback, 
  message = 'Loading...', 
  variant = 'default' 
}: LoadingStateProps) {
  if (!isLoading) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  const variantConfig = {
    default: { icon: Loader2, color: 'text-primary' },
    database: { icon: Database, color: 'text-blue-500' },
    query: { icon: Zap, color: 'text-yellow-500' },
    analytics: { icon: BarChart3, color: 'text-green-500' }
  };

  const { icon: Icon, color } = variantConfig[variant];

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="flex flex-col items-center space-y-4 max-w-sm text-center">
        <FloatingElement intensity="subtle">
          <PulseElement intensity="low">
            <div className={cn('p-3 rounded-full bg-muted/50', color)}>
              <Icon className="h-8 w-8 animate-spin" />
            </div>
          </PulseElement>
        </FloatingElement>
        <div className="space-y-2">
          <p className="text-base font-medium">{message}</p>
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'avatar' | 'card' | 'button' | 'metric';
  animate?: boolean;
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = 'default',
  animate = true,
  lines = 1
}: SkeletonProps) {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-lg',
    button: 'h-10 w-24 rounded-md',
    metric: 'h-8 w-16 rounded'
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md',
              animate && 'loading-shimmer',
              variants.text,
              i === lines - 1 ? 'w-1/2' : 'w-full',
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md',
        animate && 'loading-shimmer',
        variants[variant],
        className
      )}
      role="status"
      aria-label="Loading content"
    />
  );
}

export function SkeletonCard({ showImage = false, className }: { showImage?: boolean; className?: string }) {
  return (
    <div className={cn('p-6 space-y-4 bg-card rounded-lg border', className)}>
      {showImage && <Skeleton variant="card" className="h-32" />}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton variant="avatar" className="h-8 w-8" />
          <Skeleton variant="text" className="w-1/3" />
        </div>
        <Skeleton variant="text" lines={3} />
        <div className="flex space-x-2">
          <Skeleton variant="button" />
          <Skeleton variant="button" className="w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton variant="button" />
      </div>
      <div className="rounded-md border">
        <div className="border-b p-4">
          <div className="flex items-center space-x-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="border-b p-4 last:border-0">
            <div className="flex items-center space-x-4">
              {Array.from({ length: columns }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonMetrics({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton variant="metric" className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
