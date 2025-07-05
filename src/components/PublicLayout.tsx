
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { EnhancedMegaMenu } from '@/components/navigation/EnhancedMegaMenu';
import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';
import { megaMenuNavigation } from '@/config/navigation';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Header with Mega Menu */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 3l3.5 6.5L21 10l-3.5 6.5L13 20l-3.5-6.5L5 13l3.5-6.5L13 3z"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  DBooster
                </span>
              </div>
            </div>

            {/* Mega Menu Navigation */}
            <EnhancedMegaMenu items={megaMenuNavigation} />

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Get Started Free
              </button>
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
