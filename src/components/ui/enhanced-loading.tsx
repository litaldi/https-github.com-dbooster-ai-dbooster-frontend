
import { cn } from '@/lib/utils';
import { Loader2, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EnhancedLoadingProps {
  variant?: 'default' | 'full-screen' | 'overlay' | 'inline' | 'skeleton';
  text?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showProgress?: boolean;
  progress?: number;
  timeout?: number;
  onTimeout?: () => void;
  showNetworkStatus?: boolean;
}

export function EnhancedLoading({ 
  variant = 'default', 
  text = 'Loading...', 
  size = 'md',
  className,
  showProgress = false,
  progress = 0,
  timeout,
  onTimeout,
  showNetworkStatus = true
}: EnhancedLoadingProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasTimedOut, setHasTimedOut] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  useEffect(() => {
    if (!showNetworkStatus) return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showNetworkStatus]);

  useEffect(() => {
    if (timeout && timeout > 0) {
      const timer = setTimeout(() => {
        setHasTimedOut(true);
        onTimeout?.();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  if (hasTimedOut) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 animate-fade-in">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">Request timed out</p>
          <p className="text-xs text-muted-foreground">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  const spinnerElement = (
    <div className="relative">
      <Loader2 
        className={cn('animate-spin text-primary', sizeClasses[size])} 
        aria-hidden="true"
      />
      {showNetworkStatus && !isOnline && (
        <WifiOff className="absolute -top-1 -right-1 h-3 w-3 text-destructive animate-pulse" />
      )}
    </div>
  );

  const progressBar = showProgress && (
    <div className="w-full max-w-xs bg-secondary rounded-full h-2 overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        aria-label={`Loading progress: ${progress}%`}
      />
    </div>
  );

  const loadingContent = (
    <div className="flex flex-col items-center gap-3">
      {spinnerElement}
      <div className="text-center space-y-2">
        <span className="text-sm text-muted-foreground font-medium" role="status" aria-live="polite">
          {showNetworkStatus && !isOnline ? 'Connecting...' : text}
        </span>
        {showNetworkStatus && !isOnline && (
          <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
            <WifiOff className="h-3 w-3" />
            No internet connection
          </div>
        )}
        {progressBar}
        {showProgress && (
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        )}
      </div>
    </div>
  );

  if (variant === 'skeleton') {
    return (
      <div className={cn('animate-pulse space-y-3', className)}>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
      </div>
    );
  }

  if (variant === 'full-screen') {
    return (
      <div className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-background/80 backdrop-blur-sm',
        'transition-opacity duration-200',
        className
      )}>
        <div className="bg-card border rounded-lg p-6 shadow-lg animate-scale-in">
          {loadingContent}
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={cn(
        'absolute inset-0 z-10 flex items-center justify-center',
        'bg-background/80 backdrop-blur-sm rounded-lg',
        'transition-opacity duration-200',
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
