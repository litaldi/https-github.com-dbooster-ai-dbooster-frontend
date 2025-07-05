
import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/enhanced-loading-states';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface LazyLoadingWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function LazyLoadingWrapper({ 
  children, 
  fallback = <LoadingSpinner size="lg" />,
  errorFallback = <div className="p-4 text-center text-muted-foreground">Failed to load component</div>
}: LazyLoadingWrapperProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Simplified utility function to create lazy-loaded components
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  // Simplified wrapper without complex forwardRef generics
  return (props: React.ComponentProps<T>) => (
    <LazyLoadingWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyLoadingWrapper>
  );
}
