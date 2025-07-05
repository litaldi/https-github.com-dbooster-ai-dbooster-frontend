
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { productionLogger } from '@/utils/productionLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    
    this.setState({ 
      error, 
      errorInfo,
      errorId 
    });

    // Log error to production logger
    productionLogger.error('React Error Boundary caught an error', error);

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined
    });
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  handleReportError = (): void => {
    const { error, errorId } = this.state;
    
    if (error && errorId) {
      // In a real app, you would send this to your error reporting service
      console.log('Reporting error:', { errorId, error: error.message });
      
      // Show user feedback
      alert('Error reported successfully. Thank you for helping us improve!');
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Return custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorId } = this.state;
      const isDevelopment = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription>
                We're sorry, but something unexpected happened. Our team has been notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error ID for support */}
              {errorId && (
                <div className="bg-muted p-3 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Error ID</p>
                  <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                    {errorId}
                  </code>
                </div>
              )}

              {/* Development error details */}
              {isDevelopment && error && (
                <details className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <summary className="cursor-pointer font-medium text-destructive mb-2 flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    Error Details (Development)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-sm font-medium">Message:</p>
                      <code className="text-sm bg-background p-2 rounded block mt-1">
                        {error.message}
                      </code>
                    </div>
                    {error.stack && (
                      <div>
                        <p className="text-sm font-medium">Stack Trace:</p>
                        <pre className="text-xs bg-background p-2 rounded mt-1 overflow-auto max-h-40">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                
                <Button variant="outline" onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
                
                <Button variant="outline" onClick={this.handleReportError} className="flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Report Issue
                </Button>
              </div>

              {/* Help text */}
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  If this problem persists, please contact our support team with the error ID above.
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

// Export a functional component wrapper for easier usage
export const ErrorBoundary: React.FC<Props> = ({ children, ...props }) => (
  <EnhancedErrorBoundary {...props}>
    {children}
  </EnhancedErrorBoundary>
);

export default EnhancedErrorBoundary;
