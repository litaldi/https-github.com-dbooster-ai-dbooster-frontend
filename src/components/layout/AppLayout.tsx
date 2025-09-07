import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainNav } from '@/components/navigation/MainNav';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Main content with top padding to account for fixed nav */}
      <motion.main 
        className="pt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <EnhancedLoading 
              variant="spinner" 
              size="lg" 
              text="Loading..." 
            />
          </div>
        }>
          <Outlet />
        </Suspense>
      </motion.main>

      <ScrollToTop />
    </div>
  );
}