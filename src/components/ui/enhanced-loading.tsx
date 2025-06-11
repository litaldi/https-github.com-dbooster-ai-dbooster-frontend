
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'bars';
  className?: string;
  text?: string;
}

export function EnhancedLoading({ 
  size = 'md', 
  variant = 'spinner', 
  className,
  text 
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <div className={cn("rounded-full bg-current animate-pulse", 
          size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'
        )} style={{ animationDelay: '0ms' }} />
        <div className={cn("rounded-full bg-current animate-pulse", 
          size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'
        )} style={{ animationDelay: '150ms' }} />
        <div className={cn("rounded-full bg-current animate-pulse", 
          size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'
        )} style={{ animationDelay: '300ms' }} />
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className={cn("bg-current animate-pulse", 
        size === 'sm' ? 'h-2 w-1' : size === 'md' ? 'h-3 w-1' : 'h-4 w-1'
      )} style={{ animationDelay: '0ms' }} />
      <div className={cn("bg-current animate-pulse", 
        size === 'sm' ? 'h-2 w-1' : size === 'md' ? 'h-3 w-1' : 'h-4 w-1'
      )} style={{ animationDelay: '150ms' }} />
      <div className={cn("bg-current animate-pulse", 
        size === 'sm' ? 'h-2 w-1' : size === 'md' ? 'h-3 w-1' : 'h-4 w-1'
      )} style={{ animationDelay: '300ms' }} />
      {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}
