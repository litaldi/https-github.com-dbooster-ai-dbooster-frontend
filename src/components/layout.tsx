
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { DemoWalkthrough } from '@/components/demo-walkthrough';
import { Footer } from '@/components/navigation/Footer';

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6" role="main">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <DemoWalkthrough />
    </SidebarProvider>
  );
}
