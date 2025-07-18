
import React, { useEffect } from 'react';
import { securityOrchestrator } from '@/services/security/securityOrchestrator';
import { SecurityStatusIndicator } from '@/components/security/SecurityStatusIndicator';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  useEffect(() => {
    // Initialize security on app start
    const initializeSecurity = async () => {
      try {
        await securityOrchestrator.initialize();
      } catch (error) {
        console.error('Failed to initialize security:', error);
      }
    };

    initializeSecurity();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 justify-between">
          <h1 className="text-lg font-semibold">Secure Application</h1>
          <SecurityStatusIndicator />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
