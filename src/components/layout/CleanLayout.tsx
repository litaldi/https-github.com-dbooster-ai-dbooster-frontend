
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CleanHeader } from '@/components/navigation/CleanHeader';
import { CleanFooter } from '@/components/navigation/CleanFooter';
import { AIChatWidget } from '@/components/chat/AIChatWidget';

export function CleanLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <CleanHeader />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <CleanFooter />
      <AIChatWidget />
      
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </div>
  );
}
