
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <FadeIn>
        <Card className="w-full max-w-md text-center">
          <CardHeader className="space-y-4">
            <ScaleIn>
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FileQuestion className="w-12 h-12 text-muted-foreground" />
              </div>
            </ScaleIn>
            <div>
              <CardTitle className="text-4xl font-bold text-primary mb-2">404</CardTitle>
              <p className="text-xl font-semibold text-foreground">Page Not Found</p>
              <p className="text-muted-foreground mt-2">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="default" className="flex items-center gap-2">
                <Link to="/">
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Search className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              If you believe this is an error, please contact support.
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
