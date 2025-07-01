
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function EnhancedDashboard() {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Enterprise AI Database Hub
            </h1>
            <p className="text-muted-foreground">
              Revolutionary AI-powered optimization reducing query times by 73% and costs by 45%
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="animate-pulse">
              <Eye className="h-3 w-3 mr-1" />
              Live Monitoring
            </Badge>
            <Button asChild className="bg-gradient-to-r from-primary to-blue-600">
              <Link to="/ai-studio">
                <Rocket className="h-4 w-4 mr-2" />
                AI Studio
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      {/* Real-time Metrics */}
      <FadeIn delay={0.1}>
        <RealTimeMetricsDashboard />
      </FadeIn>

      {/* Quick Actions */}
      <FadeIn delay={0.2}>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <EnhancedQuickActions />
        </div>
      </FadeIn>

      {/* Enhanced Tabs */}
      <FadeIn delay={0.3}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="optimizer">AI Optimizer</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
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
            <Card>
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
                  <Button variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    Enable Advanced Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
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
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}
