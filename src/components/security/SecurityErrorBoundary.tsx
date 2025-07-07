
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { productionLogger } from '@/utils/productionLogger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

export class SecurityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate a unique error ID for tracking
    const errorId = `sec_err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log security-related errors with extra caution
    const isSecurityRelated = this.isSecurityError(error);
    
    if (isSecurityRelated) {
      productionLogger.error('Security-related component error', {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack?.substring(0, 500), // Limit stack trace length
        componentStack: errorInfo.componentStack?.substring(0, 300),
        isSecurityRelated: true
      }, 'SecurityErrorBoundary');
    } else {
      productionLogger.error('Component error caught by security boundary', {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack?.substring(0, 500)
      }, 'SecurityErrorBoundary');
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private isSecurityError(error: Error): boolean {
    const securityKeywords = [
      'security', 'auth', 'token', 'credential', 'permission',
      'csrf', 'xss', 'injection', 'validation', 'sanitize'
    ];
    
    const errorMessage = error.message.toLowerCase();
    const errorStack = (error.stack || '').toLowerCase();
    
    return securityKeywords.some(keyword => 
      errorMessage.includes(keyword) || errorStack.includes(keyword)
    );
  }

  private handleRetry = () => {
    // Clear error state and attempt to recover
    this.setState({ hasError: false, error: undefined, errorId: undefined });
    
    // Log recovery attempt
    productionLogger.info('User initiated error recovery', {
      errorId: this.state.errorId
    }, 'SecurityErrorBoundary');
  };

  private handleReload = () => {
    // Log reload attempt
    productionLogger.info('User initiated page reload after error', {
      errorId: this.state.errorId
    }, 'SecurityErrorBoundary');
    
    // Force page reload for complete recovery
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default security-focused error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <Card className="w-full max-w-md border-red-200 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-red-800 flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                Security Error Detected
              </CardTitle>
              <CardDescription className="text-red-600">
                A security-related error has occurred. The application has been protected by stopping execution.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.props.showDetails && import.meta.env.DEV && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm font-mono text-gray-700">
                    Error ID: {this.state.errorId}
                  </p>
                  {this.state.error && (
                    <p className="text-sm font-mono text-gray-600 mt-1">
                      {this.state.error.message}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  onClick={this.handleReload}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Reload Page
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  If this problem persists, please contact support with Error ID: {this.state.errorId}
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
