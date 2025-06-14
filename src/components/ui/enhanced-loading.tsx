
import { Loader2, Database, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedLoadingProps {
  variant?: 'default' | 'full-screen' | 'inline' | 'button';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  showIcon?: boolean;
}

export function EnhancedLoading({ 
  variant = 'default', 
  size = 'md',
  text,
  className,
  showIcon = true
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const LoadingIcon = ({ className: iconClassName }: { className?: string }) => (
    <div className="relative">
      <Database className={cn(iconClassName, 'animate-pulse opacity-60')} />
      <Zap className={cn(iconClassName, 'absolute inset-0 animate-spin')} />
    </div>
  );

  if (variant === 'full-screen') {
    return (
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
          className
        )}
        role="status"
        aria-live="polite"
        aria-label="Loading content"
      >
        <div className="flex flex-col items-center space-y-4">
          {showIcon ? (
            <LoadingIcon className={sizeClasses.lg} />
          ) : (
            <Loader2 className={cn(sizeClasses.lg, "animate-spin")} />
          )}
          <p className="text-muted-foreground text-sm font-medium">
            {text || 'Optimizing your database...'}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Loader2 className={cn(sizeClasses[size], "animate-spin")} />
        {text && <span className="text-sm">{text}</span>}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-center py-8",
        variant === 'inline' && 'py-4',
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="flex flex-col items-center space-y-3">
        {showIcon ? (
          <LoadingIcon className={sizeClasses[size]} />
        ) : (
          <Loader2 className={cn(sizeClasses[size], "animate-spin")} />
        )}
        {text && (
          <p className="text-muted-foreground text-sm font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
