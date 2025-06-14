
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  errorId: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      console.error('Production error:', { 
        error: error.message, 
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId
      });
    }
  }

  private handleRetry = () => {
    this.setState(prevState => ({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReportError = () => {
    const subject = encodeURIComponent(`Error Report: ${this.state.error?.name || 'Unknown Error'}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message || 'No message'}
Stack Trace: ${this.state.error?.stack || 'No stack trace'}
User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}
    `);
    
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isRepeatedError = this.state.retryCount > 2;
      const isNetworkError = this.state.error?.message?.includes('Network') || 
                            this.state.error?.message?.includes('fetch');

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/20 dark:via-gray-900 dark:to-orange-950/20">
          <Card className="w-full max-w-lg shadow-lg border-destructive/20 animate-fade-in">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-xl font-semibold text-destructive">
                  {isNetworkError ? 'Connection Problem' : 
                   isRepeatedError ? 'Persistent Error' : 'Something went wrong'}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  ID: {this.state.errorId.slice(-8)}
                </Badge>
              </div>
              
              <CardDescription className="text-sm">
                {isNetworkError 
                  ? 'Please check your internet connection and try again.'
                  : isRepeatedError 
                    ? 'This error has occurred multiple times. A page reload might help resolve the issue.'
                    : 'We encountered an unexpected error. This has been logged and our team will investigate.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                {!isRepeatedError ? (
                  <Button 
                    onClick={this.handleRetry} 
                    className="w-full"
                    variant="default"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                ) : (
                  <Button 
                    onClick={this.handleReload} 
                    className="w-full"
                    variant="default"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    onClick={this.handleGoHome} 
                    variant="outline"
                    className="w-full"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                  
                  <Button 
                    onClick={this.handleReportError} 
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>
              
              {(process.env.NODE_ENV === 'development' || this.props.showDetails) && this.state.error && (
                <details className="mt-4 p-3 bg-muted rounded-md">
                  <summary className="cursor-pointer text-sm font-medium flex items-center gap-2 hover:opacity-80">
                    <Bug className="w-4 h-4" />
                    Error Details {process.env.NODE_ENV === 'development' && '(Development)'}
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Error Type:</p>
                      <Badge variant="secondary" className="text-xs">
                        {this.state.error.name}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Message:</p>
                      <pre className="text-xs overflow-auto max-h-20 p-2 bg-background rounded border font-mono">
                        {this.state.error.message}
                      </pre>
                    </div>
                    
                    {this.state.error.stack && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Stack Trace:</p>
                        <pre className="text-xs overflow-auto max-h-32 p-2 bg-background rounded border font-mono">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Component Stack:</p>
                        <pre className="text-xs overflow-auto max-h-32 p-2 bg-background rounded border font-mono">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t text-xs text-muted-foreground">
                      <p>Retry attempts: {this.state.retryCount}</p>
                      <p>Timestamp: {new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
