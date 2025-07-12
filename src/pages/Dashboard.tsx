
import React from 'react';
import { OptimizedDashboardLayout } from '@/components/dashboard/OptimizedDashboardLayout';
import { useAuth } from '@/contexts/auth-context';
import { productionLogger } from '@/utils/productionLogger';

export default function Dashboard() {
  const { user, isDemo } = useAuth();

  React.useEffect(() => {
    productionLogger.info('Dashboard accessed', { 
      userId: user?.id,
      isDemo,
      timestamp: new Date().toISOString()
    }, 'Dashboard');
  }, [user?.id, isDemo]);

  return <OptimizedDashboardLayout />;
}
