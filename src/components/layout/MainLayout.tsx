
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/navigation/MainNav';
import { Footer } from '@/components/navigation/Footer';
import { AccessibilitySkipLinks } from '@/components/ui/accessibility-skip-links';
import { AccessibilityEnhancements } from '@/components/ui/accessibility-enhancements';

export function MainLayout() {
  return (
    <>
      <AccessibilitySkipLinks />
      <AccessibilityEnhancements />
      
      <div className="min-h-screen flex flex-col">
        <div id="main-navigation">
          <MainNav />
        </div>
        
        <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
          <Outlet />
        </main>
        
        <div id="footer">
          <Footer />
        </div>
      </div>
    </>
  );
}
