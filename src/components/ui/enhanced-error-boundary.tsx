
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { EnhancedButton } from './enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { monitoringService } from '@/services/monitoringService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Send to monitoring service
    monitoringService.captureError({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      component: 'ErrorBoundary',
      action: 'Component Error'
    });
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
          <Card className="max-w-2xl w-full border-destructive/20 bg-destructive/5">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-destructive">Something went wrong</CardTitle>
              <p className="text-muted-foreground">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <EnhancedButton
                  onClick={this.handleRetry}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </EnhancedButton>
                
                <EnhancedButton
                  variant="outline"
                  onClick={this.handleGoBack}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </EnhancedButton>
              </div>

              {/* Development mode details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Development Mode</Badge>
                    <span className="text-sm text-muted-foreground">Error details shown below</span>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg text-sm font-mono">
                    <div className="text-destructive font-semibold mb-2">
                      {this.state.error.name}: {this.state.error.message}
                    </div>
                    <div className="text-muted-foreground text-xs whitespace-pre-wrap">
                      {this.state.error.stack}
                    </div>
                  </div>

                  {this.state.errorInfo && (
                    <details className="bg-muted p-4 rounded-lg">
                      <summary className="cursor-pointer text-sm font-medium">
                        Component Stack
                      </summary>
                      <pre className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  If this problem persists, please{' '}
                  <button 
                    className="text-primary underline hover:no-underline"
                    onClick={() => window.location.href = '/contact'}
                  >
                    contact our support team
                  </button>
                  {' '}with details about what you were doing when this occurred.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}
