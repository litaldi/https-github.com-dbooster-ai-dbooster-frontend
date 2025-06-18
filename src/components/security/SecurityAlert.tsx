
import { AlertTriangle, Shield, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SecurityAlertProps {
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function SecurityAlert({ 
  type, 
  title, 
  description, 
  onDismiss, 
  actionLabel, 
  onAction 
}: SecurityAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <Shield className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Lock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {description}
        {(onAction || onDismiss) && (
          <div className="flex gap-2 mt-3">
            {onAction && actionLabel && (
              <Button size="sm" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
            {onDismiss && (
              <Button size="sm" variant="outline" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
