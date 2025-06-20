
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AppStatusProps {
  className?: string;
}

export function AppStatus({ className }: AppStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setErrorMessage(event.message);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (!isOnline) {
    return (
      <Alert className={cn('fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto', className)}>
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You're currently offline. Some features may not work properly.
        </AlertDescription>
      </Alert>
    );
  }

  if (hasError && errorMessage) {
    return (
      <Alert variant="destructive" className={cn('fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto', className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Badge 
      variant={isOnline ? 'default' : 'destructive'}
      className={cn('flex items-center gap-1', className)}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          Online
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Offline
        </>
      )}
    </Badge>
  );
}

export function SystemHealth() {
  const [status, setStatus] = useState<'healthy' | 'degraded' | 'down'>('healthy');

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'w-2 h-2 rounded-full',
        status === 'healthy' ? 'bg-green-500' : 
        status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
      )} />
      <span className="text-xs text-muted-foreground">
        System {status}
      </span>
    </div>
  );
}
