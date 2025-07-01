
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Shield,
  Activity,
  Rocket,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealTimeQueryOptimizer } from '@/components/ai/RealTimeQueryOptimizer';
import { EnhancedConnectionWizard } from '@/components/database/EnhancedConnectionWizard';
import { FadeIn } from '@/components/ui/animations';
import { EnhancedQuickActions } from '@/components/dashboard/EnhancedQuickActions';
import { RealTimeMetricsDashboard } from '@/components/dashboard/RealTimeMetricsDashboard';
import { DashboardOverviewTab } from '@/components/dashboard/DashboardOverviewTab';
import { PageTitle, SectionTitle } from '@/components/ui/typography';
import { StandardizedButton } from '@/components/ui/standardized-button';
import { ResponsiveGrid, StandardCard } from '@/components/ui/responsive-grid';
import { DashboardSkeleton } from '@/components/ui/standardized-loading';

export default function EnhancedDashboard() {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <FadeIn>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <PageTitle>
              AI Database Hub
            </PageTitle>
            <p className="text-muted-foreground text-lg">
              AI-powered optimization reducing query times by 73% and costs by 45%
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Badge variant="secondary" className="animate-pulse">
              <Eye className="h-3 w-3 mr-1" />
              Live Monitoring
            </Badge>
            <StandardizedButton asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600">
              <Link to="/ai-studio">
                <Rocket className="h-4 w-4 mr-2" />
                AI Studio
              </Link>
            </StandardizedButton>
          </div>
        </div>
      </FadeIn>

      {/* Real-time Metrics */}
      <FadeIn delay={0.1}>
        <RealTimeMetricsDashboard />
      </FadeIn>

      {/* Quick Actions */}
      <FadeIn delay={0.2}>
        <div className="space-y-6">
          <SectionTitle>Quick Actions</SectionTitle>
          <EnhancedQuickActions />
        </div>
      </FadeIn>

      {/* Enhanced Tabs */}
      <FadeIn delay={0.3}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="min-h-[44px]">Overview</TabsTrigger>
            <TabsTrigger value="optimizer" className="min-h-[44px]">AI Optimizer</TabsTrigger>
            <TabsTrigger value="connections" className="min-h-[44px]">Connections</TabsTrigger>
            <TabsTrigger value="analytics" className="min-h-[44px]">Analytics</TabsTrigger>
            <TabsTrigger value="security" className="min-h-[44px]">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverviewTab setActiveTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="optimizer" className="space-y-6">
            <RealTimeQueryOptimizer />
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <EnhancedConnectionWizard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <StandardCard>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Comprehensive performance insights and trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced analytics with predictive insights coming soon
                  </p>
                  <StandardizedButton variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Enable Advanced Analytics
                  </StandardizedButton>
                </div>
              </CardContent>
            </StandardCard>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <StandardCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Security Dashboard
                </CardTitle>
                <CardDescription>
                  Enterprise-grade security monitoring and threat detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid cols={{ default: 3 }} gap="md" className="text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-muted-foreground">Active Threats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">15</div>
                    <div className="text-muted-foreground">Blocked Today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">99.9%</div>
                    <div className="text-muted-foreground">Security Score</div>
                  </div>
                </ResponsiveGrid>
              </CardContent>
            </StandardCard>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}
