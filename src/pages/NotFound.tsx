
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { FloatingElement } from '@/components/ui/micro-interactions';

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularPages = [
    { name: 'Dashboard', path: '/app/dashboard', description: 'AI-powered query optimization' },
    { name: 'Features', path: '/features', description: 'Explore our capabilities' },
    { name: 'Pricing', path: '/pricing', description: 'Find the right plan' },
    { name: 'Support', path: '/support', description: 'Get help when you need it' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would trigger a search
      console.log('Search for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl text-center space-y-8">
        <FadeIn>
          <FloatingElement intensity="subtle">
            <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-4 select-none">
              404
            </div>
          </FloatingElement>
        </FadeIn>

        <ScaleIn delay={0.2}>
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold gradient-text-premium">
                Page Not Found
              </CardTitle>
              <CardDescription className="text-base md:text-lg">
                The page you're looking for seems to have been optimized out of existence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground max-w-md mx-auto">
                Don't worry! Even the best databases sometimes return empty results. 
                Let's help you find what you're looking for.
              </p>

              {/* Quick Search */}
              <form onSubmit={handleSearch} className="max-w-sm mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search our site..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 focus-ring"
                  />
                </div>
              </form>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <Button asChild size="lg" className="btn-hover-lift">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="btn-hover-lift">
                  <Link to="/app/dashboard">
                    <Search className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>

              {/* Popular Pages */}
              <div className="pt-6 border-t">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                  Popular Destinations
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {popularPages.map((page, index) => (
                    <FadeIn key={page.name} delay={0.1 * (index + 1)}>
                      <Link to={page.path} className="group">
                        <div className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:scale-105 hover:shadow-md text-left">
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">
                            {page.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {page.description}
                          </div>
                        </div>
                      </Link>
                    </FadeIn>
                  ))}
                </div>
              </div>

              {/* Help Section */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Need help?</span>
                </div>
                <div className="flex gap-4">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/support">Contact Support</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/docs-help">Documentation</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScaleIn>
      </div>
    </div>
  );
}
