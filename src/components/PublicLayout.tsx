
import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/navigation/MainNav';
import { Footer } from '@/components/navigation/Footer';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { LiveChatWidget } from '@/components/support/LiveChatWidget';
import { EnhancedAccessibilityMenu } from '@/components/ui/enhanced-accessibility-menu';

export function PublicLayout() {
  return (
    <EnhancedErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        
        {/* Accessibility Menu - Fixed position */}
        <div className="fixed top-4 right-4 z-40">
          <EnhancedAccessibilityMenu />
        </div>
        
        <MainNav />
        <main id="main-content" className="flex-1" role="main">
          <EnhancedErrorBoundary>
            <Outlet />
          </EnhancedErrorBoundary>
        </main>
        <Footer />
        <ScrollToTop />
        <LiveChatWidget />
      </div>
    </EnhancedErrorBoundary>
  );
}
