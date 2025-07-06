
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { EnhancedDashboardSidebar } from '@/components/navigation/EnhancedDashboardSidebar';
import { Header } from '@/components/header';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { KeyboardShortcuts } from '@/components/ui/keyboard-shortcuts';
import { NotificationProvider } from '@/components/notifications/SmartNotifications';
import { TourProvider, TourOverlay } from '@/components/onboarding/InteractiveTour';

export default function Layout() {
  return (
    <EnhancedErrorBoundary>
      <NotificationProvider>
        <TourProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
              <SkipLink href="#main-content">Skip to main content</SkipLink>
              <EnhancedDashboardSidebar />
              <div className="flex-1 flex flex-col min-w-0 bg-background">
                <Header />
                <main id="main-content" className="flex-1 p-4 md:p-6 overflow-auto bg-background" role="main">
                  <div className="max-w-7xl mx-auto w-full">
                    <BreadcrumbNav />
                    <EnhancedErrorBoundary>
                      <Outlet />
                    </EnhancedErrorBoundary>
                  </div>
                </main>
                <EnhancedFooter />
              </div>
              <ScrollToTop />
            </div>
            <OnboardingTour />
            <KeyboardShortcuts />
            <TourOverlay />
          </SidebarProvider>
        </TourProvider>
      </NotificationProvider>
    </EnhancedErrorBoundary>
  );
}
