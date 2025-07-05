
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { EnhancedHeader } from '@/components/navigation/EnhancedHeader';
import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <EnhancedHeader />
      
      {/* Add padding-top to account for fixed header */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      
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
