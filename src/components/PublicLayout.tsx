
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProfessionalNav } from '@/components/navigation/ProfessionalNav';
import { ProfessionalFooter } from '@/components/navigation/ProfessionalFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ProfessionalNav />
      
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      
      <ProfessionalFooter />
      
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        closeButton
      />
    </div>
  );
}
