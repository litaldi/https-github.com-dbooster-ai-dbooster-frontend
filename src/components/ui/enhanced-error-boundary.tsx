
import React, { Component, ReactNode } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorRecovery } from '@/utils/errorRecovery';

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
  private retryTimeoutId?: NodeJS.Timeout;

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

    // Use error recovery system
    ErrorRecovery.handleError(error, 'error-boundary', {
      report: true,
      userMessage: 'A component error occurred. You can try to recover or refresh the page.'
    });
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
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

  handleAutoRetry = () => {
    if (this.state.retryCount < 2) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 3000);
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleCopyError = async () => {
    if (this.state.error) {
      const errorText = `Error: ${this.state.error.toString()}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || 'Not available'}\n\nStack Trace:\n${this.state.error.stack || 'Not available'}`;
      
      try {
        await navigator.clipboard.writeText(errorText);
        toast.success('Error details copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy error details');
      }
    }
  };

  handleGetHelp = () => {
    window.open('/support', '_blank');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isRepeatedError = this.state.retryCount > 2;

      return (
        <div 
          className="min-h-[50vh] flex items-center justify-center p-4 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/20 dark:to-orange-950/20"
          role="alert"
          aria-live="assertive"
        >
          <Card className="max-w-lg w-full shadow-lg border-destructive/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl text-destructive" id="error-title">
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
                <div 
                  className="text-xs text-center text-muted-foreground bg-muted/50 p-2 rounded"
                  aria-label={`Retry attempts: ${this.state.retryCount}`}
                >
                  Retry attempts: {this.state.retryCount}
                </div>
              )}

              {(this.props.showDetails || process.env.NODE_ENV === 'development') && this.state.error && (
                <details className="mt-4 p-3 bg-muted rounded-lg text-xs border">
                  <summary className="cursor-pointer font-medium flex items-center gap-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                    <Bug className="h-4 w-4" aria-hidden="true" />
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
                      aria-label="Copy error details to clipboard"
                    >
                      <Copy className="h-3 w-3 mr-2" aria-hidden="true" />
                      Copy Error Details
                    </Button>
                  </div>
                </details>
              )}
              
              <div className="flex gap-2 pt-4" role="group" aria-labelledby="error-title">
                <Button 
                  onClick={this.handleRetry} 
                  className="flex-1"
                  variant={isRepeatedError ? "outline" : "default"}
                  disabled={isRepeatedError}
                  aria-label={isRepeatedError ? 'Maximum retry attempts reached' : 'Try to recover from error'}
                >
                  <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                  {isRepeatedError ? 'Max Retries Reached' : 'Try Again'}
                </Button>
                
                <Button 
                  onClick={this.handleGoHome} 
                  variant="outline"
                  className="flex-1"
                  aria-label="Go to home page"
                >
                  <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                  Go Home
                </Button>
                
                <Button 
                  onClick={this.handleGetHelp} 
                  variant="ghost"
                  size="sm"
                  aria-label="Get help and support"
                >
                  <HelpCircle className="h-4 w-4" aria-hidden="true" />
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
