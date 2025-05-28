
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  className?: string;
}

export function EnhancedLoading({ 
  size = 'md', 
  variant = 'spinner', 
  text, 
  className 
}: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-primary animate-pulse",
                size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'
              )}
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className={cn(
          "rounded-full bg-primary animate-pulse",
          sizeClasses[size]
        )} />
        {text && <span className="text-sm text-muted-foreground animate-pulse">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}
