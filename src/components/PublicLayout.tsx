
import React from 'react';
import { EnhancedHeader } from './layout/enhanced-header';
import { AccessibilityEnhancements } from './ui/accessibility-enhancements';
import { AccessibilityFloatingButton } from './ui/accessibility-menu';
import { PerformanceWidget } from './ui/performance-widget';
import { SkipLink } from './ui/accessibility-helpers';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  // Initialize performance optimization
  usePerformanceOptimization({
    preloadResources: true,
    measureTimings: true,
    enableWebVitals: true
  });

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Accessibility Enhancements */}
      <AccessibilityEnhancements />
      
      {/* Skip Link for keyboard navigation */}
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      
      {/* Header */}
      <EnhancedHeader />
      
      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      
      {/* Accessibility Controls */}
      <AccessibilityFloatingButton />
      
      {/* Performance Widget (development only) */}
      <PerformanceWidget />
    </div>
  );
}
