
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ContentSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-4">
        <motion.div
          className="h-8 bg-muted rounded-md w-1/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="h-4 bg-muted rounded-md w-2/3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-lg">
            <CardHeader>
              <motion.div
                className="h-6 bg-muted rounded-md w-3/4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            </CardHeader>
            <CardContent className="space-y-3">
              <motion.div
                className="h-4 bg-muted rounded-md w-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 + 0.3 }}
              />
              <motion.div
                className="h-4 bg-muted rounded-md w-2/3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 + 0.5 }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <ContentSkeleton />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <motion.div
          className="h-10 bg-muted rounded-md w-1/4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="h-6 bg-muted rounded-md w-1/2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-lg">
            <CardContent className="p-6 space-y-3">
              <motion.div
                className="h-8 bg-muted rounded-md w-2/3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
              <motion.div
                className="h-12 bg-muted rounded-md w-1/2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 + 0.3 }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
