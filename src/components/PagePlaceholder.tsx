
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  showBackButton?: boolean;
}

export function PagePlaceholder({ 
  title, 
  description, 
  icon = <Construction className="h-8 w-8 text-muted-foreground" />,
  showBackButton = true 
}: PagePlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader className="space-y-6 pb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center border-2 border-primary/20">
            {icon}
          </div>
          <div className="space-y-4">
            <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {description}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-8">
          {showBackButton && (
            <div className="flex justify-center">
              <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          )}
          
          <div className="space-y-2 text-sm text-muted-foreground pt-4">
            <p>This page is under development and will be available soon.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
