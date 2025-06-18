
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error404() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="max-w-2xl w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-6">
            <div className="text-8xl font-bold text-muted-foreground/30 mb-2">404</div>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <CardTitle className="text-2xl mb-2">Page Not Found</CardTitle>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track with DBooster.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Popular Pages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <Link to="/dashboard" className="text-primary hover:underline">
                Dashboard
              </Link>
              <Link to="/repositories" className="text-primary hover:underline">
                Repositories
              </Link>
              <Link to="/queries" className="text-primary hover:underline">
                Query Optimization
              </Link>
              <Link to="/ai-features" className="text-primary hover:underline">
                AI Features
              </Link>
              <Link to="/features" className="text-primary hover:underline">
                Features
              </Link>
              <Link to="/support" className="text-primary hover:underline">
                Support
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4 border-t">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/support" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Get Help
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link to="/contact" className="gap-2">
                <Search className="h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
