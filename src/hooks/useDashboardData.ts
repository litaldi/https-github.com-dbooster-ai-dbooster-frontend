
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface DashboardData {
  totalDatabases: number;
  totalQueries: number;
  avgPerformance: number;
  optimizedQueries: number;
  activeTeamMembers: number;
  costSavings: number;
}

export function useDashboardData() {
  const { isDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDashboardData({
        totalDatabases: isDemo ? 12 : 0,
        totalQueries: isDemo ? 1247 : 0,
        avgPerformance: isDemo ? 73 : 0,
        optimizedQueries: isDemo ? 415 : 0,
        activeTeamMembers: isDemo ? 24 : 1,
        costSavings: isDemo ? 62450 : 0
      });
      setIsLoading(false);
    };

    loadDashboardData();
  }, [isDemo]);

  return {
    isLoading,
    dashboardData
  };
}
