
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { DemoWalkthrough } from '@/components/demo-walkthrough';
import { Footer } from '@/components/navigation/Footer';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-auto" role="main">
            <div className="max-w-7xl mx-auto w-full">
              <BreadcrumbNav />
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <DemoWalkthrough />
    </SidebarProvider>
  );
}
