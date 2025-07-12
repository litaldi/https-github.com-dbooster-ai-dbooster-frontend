
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft, FileQuestion, Zap } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4" dir="ltr">
      <FadeIn>
        <Card className="w-full max-w-lg text-center shadow-xl">
          <CardHeader className="space-y-6 pb-8">
            <ScaleIn>
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <FileQuestion className="w-16 h-16 text-primary" />
              </div>
            </ScaleIn>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  DBooster
                </span>
              </div>
              <CardTitle className="text-6xl font-bold text-primary mb-4">404</CardTitle>
              <h1 className="text-2xl font-semibold text-foreground">Page Not Found</h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="flex items-center gap-2">
                <Link to="/">
                  <Home className="w-5 w-5" />
                  Go Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                <Link to="/app">
                  <Search className="w-5 h-5" />
                  Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground pt-4">
              <p>Need help? Our support team is here for you.</p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/support" className="text-primary hover:underline">
                  Contact Support
                </Link>
                <span>•</span>
                <Link to="/faq" className="text-primary hover:underline">
                  View FAQ
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
