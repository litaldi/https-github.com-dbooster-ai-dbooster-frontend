
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedLoadingProps {
  variant?: 'default' | 'full-screen' | 'overlay' | 'inline';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EnhancedLoading({ 
  variant = 'default', 
  text = 'Loading...', 
  size = 'md',
  className 
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const spinnerElement = (
    <Loader2 
      className={cn('animate-spin', sizeClasses[size])} 
      aria-hidden="true"
    />
  );

  const loadingContent = (
    <div className="flex flex-col items-center gap-3">
      {spinnerElement}
      <span className="text-sm text-muted-foreground" role="status" aria-live="polite">
        {text}
      </span>
    </div>
  );

  if (variant === 'full-screen') {
    return (
      <div className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className
      )}>
        {loadingContent}
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={cn(
        'absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg',
        className
      )}>
        {loadingContent}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {spinnerElement}
        <span className="text-sm text-muted-foreground">{text}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center p-8', className)}>
      {loadingContent}
    </div>
  );
}
