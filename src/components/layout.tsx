
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EnhancedDashboardSidebar } from '@/components/navigation/EnhancedDashboardSidebar';
import { Header } from '@/components/header';
import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { KeyboardShortcuts } from '@/components/ui/keyboard-shortcuts';
import { NotificationProvider } from '@/components/notifications/SmartNotifications';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { Suspense } from 'react';

// Enhanced loading component with better UX
const LoadingFallback = () => (
  <div 
    className="flex items-center justify-center min-h-[400px]" 
    role="status" 
    aria-label="Loading content"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default function Layout() {
  // Initialize performance optimizations
  usePerformanceOptimization();

  return (
    <EnhancedErrorBoundary>
      <NotificationProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <EnhancedDashboardSidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-background">
              <Header />
              <main 
                id="main-content" 
                className="flex-1 p-4 md:p-6 overflow-auto bg-background" 
                role="main"
                tabIndex={-1}
              >
                <div className="max-w-7xl mx-auto w-full">
                  <BreadcrumbNav />
                  <EnhancedErrorBoundary>
                    <Suspense fallback={<LoadingFallback />}>
                      <Outlet />
                    </Suspense>
                  </EnhancedErrorBoundary>
                </div>
              </main>
              <EnhancedFooter />
            </div>
            <ScrollToTop />
          </div>
          <KeyboardShortcuts />
        </SidebarProvider>
      </NotificationProvider>
    </EnhancedErrorBoundary>
  );
}
