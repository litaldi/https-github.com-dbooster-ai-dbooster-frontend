
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import { ContextualHelp } from '@/components/ui/contextual-help';
import { ContentSkeleton } from '@/components/ui/enhanced-skeleton';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

export function EnhancedLayout() {
  // Initialize keyboard shortcuts and performance monitoring
  useKeyboardShortcuts();
  usePerformanceOptimization({
    preloadResources: true,
    measureTimings: true,
    enableWebVitals: true
  });

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<ContentSkeleton />}>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </Suspense>
      
      <ContextualHelp />
    </div>
  );
}
