
import React from 'react';
import { Loader2, Database, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}

export function PageLoading({ 
  className, 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default' 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('flex flex-col items-center justify-center min-h-[400px] space-y-4', className)}>
        <div className="relative">
          <Database className="h-12 w-12 text-muted-foreground" />
          <Loader2 className="h-6 w-6 animate-spin absolute -top-1 -right-1 text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">Loading DBooster</h3>
          <p className="text-sm text-muted-foreground">Preparing your database optimization experience...</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4 p-8', className)}>
      <div className="relative">
        <Zap className="h-8 w-8 text-primary" />
        <Loader2 className={cn('animate-spin absolute -top-1 -right-1', sizeClasses[size])} />
      </div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function ComponentLoading({ className, size = 'sm', text }: LoadingStateProps) {
  return (
    <div className={cn('flex items-center justify-center space-x-2 p-2', className)}>
      <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-4 w-4' : 'h-6 w-6')} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="bg-muted rounded-lg p-4 space-y-3">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-muted-foreground/20 rounded"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className }: { 
  rows?: number; 
  columns?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted-foreground/20 rounded flex-1"></div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-3 bg-muted-foreground/10 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}
