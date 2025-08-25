import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  ArrowLeft, 
  Wifi,
  Database,
  Shield,
  Bug,
  Clock,
  HelpCircle
} from 'lucide-react';

// Enhanced Error Types
export interface ErrorInfo {
  type: 'network' | 'database' | 'permission' | 'validation' | 'timeout' | 'generic';
  title: string;
  message: string;
  code?: string | number;
  details?: string;
  recoverable?: boolean;
  timestamp?: Date;
}

// Error Boundary with Enhanced UX
export interface EnhancedErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId?: string;
}

export class EnhancedErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  EnhancedErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<any> }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): EnhancedErrorBoundaryState {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service
    console.error('Enhanced Error Boundary caught an error:', {
      error,
      errorInfo,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          errorId={this.state.errorId}
        />
      );
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  onRetry?: () => void;
  errorId?: string;
}

function DefaultErrorFallback({ error, onRetry, errorId }: ErrorFallbackProps) {
  const [isReporting, setIsReporting] = React.useState(false);
  const [reported, setReported] = React.useState(false);

  const handleReport = async () => {
    setIsReporting(true);
    // Simulate error reporting
    await new Promise(resolve => setTimeout(resolve, 1000));
    setReported(true);
    setIsReporting(false);
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-destructive/10 rounded-full">
            <Bug className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Our team has been notified.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-muted/50 rounded-lg text-left">
            <p className="text-sm font-mono text-muted-foreground">
              {error.message}
            </p>
            {errorId && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {errorId}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>

        {!reported && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReport}
            disabled={isReporting}
            className="text-xs"
          >
            {isReporting ? 'Reporting...' : 'Report this issue'}
          </Button>
        )}

        {reported && (
          <p className="text-xs text-muted-foreground">
            ✓ Thank you for reporting this issue
          </p>
        )}
      </div>
    </div>
  );
}

// Contextual Error Display Component
export interface ContextualErrorProps {
  error: ErrorInfo;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ContextualError({ error, onRetry, onDismiss, className }: ContextualErrorProps) {
  const getErrorIcon = (type: ErrorInfo['type']) => {
    switch (type) {
      case 'network': return Wifi;
      case 'database': return Database;
      case 'permission': return Shield;
      case 'timeout': return Clock;
      default: return AlertTriangle;
    }
  };

  const getErrorColor = (type: ErrorInfo['type']) => {
    switch (type) {
      case 'network': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'database': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'permission': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'validation': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'timeout': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      default: return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const ErrorIcon = getErrorIcon(error.type);
  const colorClasses = getErrorColor(error.type);

  return (
    <div className={cn(
      'rounded-lg border p-4',
      colorClasses,
      className
    )}>
      <div className="flex items-start gap-3">
        <ErrorIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold text-foreground">
              {error.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {error.message}
            </p>
          </div>

          {error.details && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                Technical details
              </summary>
              <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-x-auto">
                {error.details}
              </pre>
            </details>
          )}

          {error.code && (
            <p className="text-xs text-muted-foreground">
              Error Code: {error.code}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            {error.recoverable && onRetry && (
              <Button size="sm" variant="outline" onClick={onRetry}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
            
            {onDismiss && (
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Dismiss
              </Button>
            )}
            
            <Button size="sm" variant="ghost" className="ml-auto">
              <HelpCircle className="h-3 w-3 mr-1" />
              Get Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form Error Display
export interface FormErrorProps {
  errors: Record<string, string>;
  className?: string;
}

export function FormError({ errors, className }: FormErrorProps) {
  const errorEntries = Object.entries(errors);
  
  if (errorEntries.length === 0) return null;

  return (
    <div className={cn(
      'p-4 bg-destructive/10 border border-destructive/20 rounded-lg',
      className
    )}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-destructive mb-2">
            Please fix the following errors:
          </h3>
          <ul className="space-y-1">
            {errorEntries.map(([field, message]) => (
              <li key={field} className="text-sm text-muted-foreground">
                <span className="font-medium capitalize">
                  {field.replace(/([A-Z])/g, ' $1').trim()}:
                </span>{' '}
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Network Error Handler Hook
export function useNetworkError() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [networkError, setNetworkError] = React.useState<ErrorInfo | null>(null);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNetworkError(null);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNetworkError({
        type: 'network',
        title: 'Connection Lost',
        message: 'Please check your internet connection and try again.',
        recoverable: true
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, networkError };
}

// Global Error Handler
export function useGlobalErrorHandler() {
  const [errors, setErrors] = React.useState<ErrorInfo[]>([]);

  const addError = (error: ErrorInfo) => {
    setErrors(prev => [...prev, { ...error, timestamp: new Date() }]);
  };

  const removeError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return {
    errors,
    addError,
    removeError,
    clearErrors
  };
}