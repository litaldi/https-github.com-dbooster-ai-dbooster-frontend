
import React from 'react';
import { OptimizedDashboardLayout } from '@/components/dashboard/OptimizedDashboardLayout';
import { useAuth } from '@/contexts/auth-context';
import { productionLogger } from '@/utils/productionLogger';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isDemo, loading } = useAuth();

  React.useEffect(() => {
    if (user) {
      productionLogger.info('Dashboard accessed', { 
        userId: user?.id,
        isDemo,
        timestamp: new Date().toISOString()
      }, 'Dashboard');
    }
  }, [user?.id, isDemo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <OptimizedDashboardLayout />;
}
