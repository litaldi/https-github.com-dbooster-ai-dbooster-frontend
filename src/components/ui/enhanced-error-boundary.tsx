
import React, { Component, ReactNode } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { AlertTriangle, RefreshCw, Home, Bug, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  retryCount: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Enhanced Error Boundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Analytics or error reporting here
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleCopyError = () => {
    if (this.state.error) {
      const errorText = `${this.state.error.toString()}\n${this.state.errorInfo?.componentStack || ''}`;
      navigator.clipboard.writeText(errorText).then(() => {
        toast.success('Error details copied to clipboard');
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isRepeatedError = this.state.retryCount > 2;

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-4 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20">
          <Card className="max-w-lg w-full shadow-lg border-destructive/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-xl text-destructive">
                {isRepeatedError ? 'Persistent Error Detected' : 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                {isRepeatedError 
                  ? 'This error has occurred multiple times. Please try refreshing the page or contact support if the issue persists.'
                  : 'We encountered an unexpected error. This has been logged and we\'re working to fix it.'
                }
              </p>
              
              {this.state.retryCount > 0 && (
                <div className="text-xs text-center text-muted-foreground bg-muted/50 p-2 rounded">
                  Retry attempts: {this.state.retryCount}
                </div>
              )}

              {(this.props.showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
                <details className="mt-4 p-3 bg-muted rounded-lg text-xs border">
                  <summary className="cursor-pointer font-medium flex items-center gap-2 hover:text-primary">
                    <Bug className="h-4 w-4" />
                    Technical Details
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <strong>Error:</strong>
                      <pre className="mt-1 overflow-auto whitespace-pre-wrap bg-background p-2 rounded border text-xs">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 overflow-auto whitespace-pre-wrap bg-background p-2 rounded border text-xs max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    <Button
                      onClick={this.handleCopyError}
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      Copy Error Details
                    </Button>
                  </div>
                </details>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={this.handleRetry} 
                  className="flex-1"
                  variant={isRepeatedError ? "outline" : "default"}
                  disabled={isRepeatedError}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isRepeatedError ? 'Max Retries Reached' : 'Try Again'}
                </Button>
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-2">
                If this issue persists, please contact our support team with the error details above.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
