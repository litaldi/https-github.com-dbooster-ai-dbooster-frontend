
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { EnhancedMegaMenu } from '@/components/navigation/EnhancedMegaMenu';
import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';
import { EnhancedSearch } from '@/components/ui/enhanced-search';
import { megaMenuNavigation } from '@/config/navigation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
      {/* Enhanced Header with Global Search */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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

            {/* Mega Menu Navigation - Categories on the left */}
            <EnhancedMegaMenu items={megaMenuNavigation} />

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

              {/* CTA Button */}
              <Button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
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
