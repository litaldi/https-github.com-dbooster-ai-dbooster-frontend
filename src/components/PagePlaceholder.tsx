
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Construction className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            This page is under development and will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
