
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlobalLoadingProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function GlobalLoading({ isLoading, message = 'Loading...', className }: GlobalLoadingProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-[9999] flex items-center justify-center',
      'bg-background/80 backdrop-blur-sm',
      className
    )}>
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-card shadow-lg border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </div>
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({ message = 'Loading page...', className }: PageLoadingProps) {
  return (
    <div className={cn(
      'flex items-center justify-center min-h-[400px] w-full',
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

export function ButtonLoading({ 
  isLoading, 
  children, 
  loadingText = 'Loading...', 
  className 
}: ButtonLoadingProps) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : children}
    </span>
  );
}
