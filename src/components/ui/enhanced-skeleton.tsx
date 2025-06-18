
import { cn } from '@/lib/utils';

interface EnhancedSkeletonProps {
  className?: string;
  variant?: 'default' | 'text' | 'avatar' | 'card' | 'button';
  animate?: boolean;
}

export function EnhancedSkeleton({ 
  className, 
  variant = 'default',
  animate = true 
}: EnhancedSkeletonProps) {
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full rounded-lg',
    button: 'h-10 w-24 rounded-md'
  };

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-muted via-muted/50 to-muted rounded-md',
        animate && 'animate-pulse',
        variants[variant],
        className
      )}
      role="status"
      aria-label="Loading content"
    />
  );
}

export function ContentSkeleton() {
  return (
    <div className="space-y-4 p-6" role="status" aria-label="Loading page content">
      <EnhancedSkeleton variant="text" className="w-1/2" />
      <EnhancedSkeleton variant="text" className="w-3/4" />
      <EnhancedSkeleton variant="card" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <EnhancedSkeleton variant="avatar" />
            <EnhancedSkeleton variant="text" />
            <EnhancedSkeleton variant="button" />
          </div>
        ))}
      </div>
    </div>
  );
}
