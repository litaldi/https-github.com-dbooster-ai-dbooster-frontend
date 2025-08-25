
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { EnhancedMegaMenu } from '@/components/navigation/EnhancedMegaMenu';
import { EnhancedMobileNavigation } from '@/components/ui/enhanced-mobile-navigation';
import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';
import { EnhancedSearch } from '@/components/ui/enhanced-search';
import { StandardizedCTAButton } from '@/components/ui/standardized-cta-button';
import { SkipLink } from '@/components/ui/enhanced-accessibility';
import { megaMenuNavigation } from '@/config/navigation';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function PublicLayout() {
  const navigate = useNavigate();

  const handleGlobalSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Skip Link for Accessibility */}
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      
      {/* Enhanced Header with Global Search */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  DBooster
                </span>
              </div>
            </div>

            {/* Desktop Mega Menu Navigation */}
            <EnhancedMegaMenu items={megaMenuNavigation} />
            
            {/* Mobile Navigation */}
            <EnhancedMobileNavigation items={megaMenuNavigation} />

            {/* Global Search Bar - Moved to the right */}
            <div className="flex items-center gap-3">
              <div className="max-w-md hidden md:block">
                <EnhancedSearch
                  placeholder="Search everything..."
                  onSearch={handleGlobalSearch}
                  showRecentSearches={true}
                  className="w-full"
                />
              </div>

              {/* Standardized CTA Button */}
              <StandardizedCTAButton
                size="default"
                className="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="flex-1" role="main">
        <Outlet />
      </main>
      
      {/* Enhanced Footer */}
      <EnhancedFooter />
      
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </div>
  );
}
