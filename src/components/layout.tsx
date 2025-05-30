
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { DemoWalkthrough } from '@/components/demo-walkthrough';
import { OnboardingTour } from '@/components/onboarding/OnboardingTour';
import { Footer } from '@/components/navigation/Footer';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

export default function Layout() {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main id="main-content" className="flex-1 p-4 md:p-6 overflow-auto" role="main">
              <div className="max-w-7xl mx-auto w-full">
                <BreadcrumbNav />
                <ErrorBoundary>
                  <Outlet />
                </ErrorBoundary>
              </div>
            </main>
            <Footer />
          </div>
          <ScrollToTop />
        </div>
        <DemoWalkthrough />
        <OnboardingTour />
      </SidebarProvider>
    </ErrorBoundary>
  );
}
