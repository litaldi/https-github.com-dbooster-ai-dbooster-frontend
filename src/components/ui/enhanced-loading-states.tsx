
import React from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PulseElement } from '@/components/ui/micro-interactions';

interface LoadingStateProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'branded' | 'database' | 'analytics';
  isLoading?: boolean;
  message?: string;
  children?: React.ReactNode;
}

export function LoadingSpinner({ className, size = 'md', variant = 'default' }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const variants = {
    default: 'text-primary',
    minimal: 'text-muted-foreground',
    branded: 'text-blue-600',
    database: 'text-green-600',
    analytics: 'text-purple-600'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin',
        sizeClasses[size],
        variants[variant],
        className
      )} 
    />
  );
}

export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-lg border bg-card", className)}>
      <div className="flex items-center justify-center space-x-2">
        <LoadingSpinner />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <PulseElement intensity="low">
      <div className={cn("bg-muted rounded animate-pulse", className)} />
    </PulseElement>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-lg border bg-card space-y-4", className)}>
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </div>
      <LoadingSkeleton className="h-32 w-full" />
      <div className="flex justify-between">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function LoadingState({ 
  isLoading, 
  message = "Loading...", 
  variant = 'default',
  className,
  children 
}: LoadingStateProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
      <LoadingSpinner size="lg" variant={variant} />
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

export function ErrorState({ 
  message = "Something went wrong", 
  onRetry,
  className 
}: { 
  message?: string; 
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6 text-center", className)}>
      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
      <p className="text-sm text-muted-foreground mb-3">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="text-sm text-primary hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function SuccessState({ 
  message = "Success!", 
  className 
}: { 
  message?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center p-4 text-center", className)}>
      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
      <span className="text-sm text-green-600">{message}</span>
    </div>
  );
}
