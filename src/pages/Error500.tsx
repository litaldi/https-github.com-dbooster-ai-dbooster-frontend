
import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Home, AlertTriangle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Error500() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const reportError = () => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    const subject = encodeURIComponent('DBooster Error Report - 500 Server Error');
    const body = encodeURIComponent(`
Please describe what you were doing when this error occurred:

[Your description here]

Technical Details:
- Time: ${errorDetails.timestamp}
- Page: ${errorDetails.url}
- Browser: ${errorDetails.userAgent}
    `);
    
    window.location.href = `mailto:support@dbooster.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-destructive/5">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-6 p-4 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl text-destructive mb-2">Server Error</CardTitle>
          <p className="text-muted-foreground">
            We're experiencing technical difficulties. Our team has been notified and is working on a fix.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This is a temporary issue. Please try refreshing the page or come back in a few minutes.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
            
            <Button variant="outline" asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-center">Need Immediate Help?</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <Button variant="ghost" onClick={reportError} className="gap-2">
                <Mail className="h-4 w-4" />
                Report This Error
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                <p>Error Reference: #{Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
                <p>Time: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <p>
              If this problem persists, please contact our support team at{' '}
              <a href="mailto:support@dbooster.com" className="text-primary underline">
                support@dbooster.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
