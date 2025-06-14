import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuickStartGuide } from '@/components/onboarding/QuickStartGuide';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { QueryHistory } from '@/components/queries/QueryHistory';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';
import { KeyboardShortcutsHelper } from '@/components/layout/KeyboardShortcutsHelper';
import { LoadingState, SkeletonCard } from '@/components/ui/enhanced-loading-states';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { 
  Database, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { RealTimeMetrics } from '@/components/dashboard/RealTimeMetrics';
import { DatabaseStatus } from '@/components/dashboard/DatabaseStatus';
import { QueryAnalytics } from '@/components/dashboard/QueryAnalytics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

export default function Dashboard() {
  const { user, isDemo } = useAuth();
  const { status, overallStatus } = useSystemStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock dashboard data
      setDashboardData({
        totalDatabases: isDemo ? 3 : 0,
        totalQueries: isDemo ? 42 : 0,
        avgPerformance: isDemo ? 85 : 0,
        optimizedQueries: isDemo ? 18 : 0,
        activeTeamMembers: isDemo ? 5 : 1
      });
      setIsLoading(false);
    };

    loadDashboardData();
  }, [isDemo]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        <LoadingState message="Loading your dashboard..." variant="database" />
      </div>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your database optimization center
          </p>
        </div>

        <QuickActions />
        
        <RealTimeMetrics />
        
        <div className="grid gap-6 lg:grid-cols-1">
          <DatabaseStatus />
          <QueryAnalytics />
        </div>
      </div>
    </EnhancedErrorBoundary>
  );
}
