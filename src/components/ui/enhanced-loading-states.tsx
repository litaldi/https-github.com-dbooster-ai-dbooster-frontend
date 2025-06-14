
import { Loader2, Database, Zap, BarChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  variant?: 'default' | 'database' | 'analysis' | 'reports';
}

export function LoadingState({ 
  message = 'Loading...', 
  className,
  variant = 'default' 
}: LoadingStateProps) {
  const getIcon = () => {
    switch (variant) {
      case 'database':
        return <Database className="h-8 w-8 text-blue-600 animate-pulse" />;
      case 'analysis':
        return <Zap className="h-8 w-8 text-yellow-600 animate-pulse" />;
      case 'reports':
        return <BarChart className="h-8 w-8 text-green-600 animate-pulse" />;
      default:
        return <Loader2 className="h-8 w-8 animate-spin text-blue-600" />;
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      {getIcon()}
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
