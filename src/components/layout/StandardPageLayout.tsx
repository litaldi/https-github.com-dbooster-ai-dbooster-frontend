
import React from 'react';
import { SmartHeader } from '@/components/navigation/SmartHeader';

interface StandardPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  description?: string;
}

export function StandardPageLayout({ 
  children, 
  title, 
  subtitle, 
  description 
}: StandardPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          {subtitle && (
            <p className="text-sm text-muted-foreground mb-2">{subtitle}</p>
          )}
          <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}
