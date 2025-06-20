
import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/navigation/MainNav';
import { Footer } from '@/components/navigation/Footer';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { SkipLink } from '@/components/ui/accessibility-helpers';

export function PublicLayout() {
  return (
    <EnhancedErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <MainNav />
        <main id="main-content" className="flex-1" role="main">
          <EnhancedErrorBoundary>
            <Outlet />
          </EnhancedErrorBoundary>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </EnhancedErrorBoundary>
  );
}
