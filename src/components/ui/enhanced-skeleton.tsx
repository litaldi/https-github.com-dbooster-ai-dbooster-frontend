
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ContentSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
