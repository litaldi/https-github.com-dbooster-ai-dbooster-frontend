
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

export function NotFound() {
  const navigate = useNavigate();

  const quickLinks = [
    { title: 'Dashboard', href: '/app', icon: Home },
    { title: 'Documentation', href: '/docs', icon: HelpCircle },
    { title: 'Features', href: '/features', icon: Search },
    { title: 'Support', href: '/support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <ScaleIn>
              <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
            </ScaleIn>
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The page you're looking for doesn't exist or has been moved to a different location.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto">
          <FadeIn delay={0.2}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What can you do?</CardTitle>
                <CardDescription>
                  Here are some suggestions to help you find what you're looking for:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </Button>
                  <Button onClick={() => navigate('/')} className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>
                  Popular pages and features you might be looking for:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quickLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <Button
                        key={link.title}
                        variant="ghost"
                        onClick={() => navigate(link.href)}
                        className="justify-start h-auto p-4 hover:bg-muted/50"
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{link.title}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
