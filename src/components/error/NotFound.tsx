
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, ArrowLeft, FileQuestion, Zap, Mail } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

export function NotFound() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Suggest related pages based on the path
  const getSuggestedPages = (path: string) => {
    if (path.includes('app') || path.includes('dashboard')) {
      return [
        { label: 'Dashboard', href: '/app', icon: Home },
        { label: 'Analytics', href: '/app/analytics', icon: Search },
      ];
    }
    if (path.includes('blog') || path.includes('learn')) {
      return [
        { label: 'Learn Hub', href: '/learn', icon: Search },
        { label: 'Blog', href: '/blog', icon: FileQuestion },
      ];
    }
    return [
      { label: 'Home', href: '/', icon: Home },
      { label: 'Features', href: '/features', icon: Search },
    ];
  };

  const suggestedPages = getSuggestedPages(currentPath);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4" dir="ltr">
      <FadeIn>
        <Card className="w-full max-w-lg text-center shadow-xl border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-8">
            <ScaleIn>
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center border-2 border-primary/20">
                <FileQuestion className="w-16 h-16 text-primary" />
              </div>
            </ScaleIn>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-md">
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
              {currentPath !== '/' && (
                <p className="text-sm text-muted-foreground/80 font-mono bg-muted/30 px-3 py-1 rounded-md inline-block">
                  {currentPath}
                </p>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8">
            {/* Suggested Pages */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Try these pages instead:</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                {suggestedPages.map((page) => {
                  const IconComponent = page.icon;
                  return (
                    <Button key={page.href} asChild variant="outline" size="sm" className="flex items-center gap-2">
                      <Link to={page.href}>
                        <IconComponent className="w-4 h-4" />
                        {page.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>
            
            {/* Main Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" className="flex items-center gap-2">
                <Link to="/">
                  <Home className="w-5 h-5" />
                  Go Home
                </Link>
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
            
            {/* Support */}
            <div className="space-y-3 text-sm text-muted-foreground pt-4 border-t border-border/30">
              <p>Need help? Our support team is here for you.</p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/support" className="text-primary hover:underline underline-offset-2 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Contact Support
                </Link>
                <span>•</span>
                <Link to="/faq" className="text-primary hover:underline underline-offset-2">
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
