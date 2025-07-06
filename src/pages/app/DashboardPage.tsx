
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  TrendingUp, 
  Clock, 
  Zap, 
  CheckCircle, 
  Activity,
  BarChart3,
  Settings,
  Eye,
  Brain,
  Shield,
  Users,
  DollarSign,
  AlertCircle,
  Rocket,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isDemo } = useAuth();

  // Enhanced demo data with more realistic metrics
  const demoData = {
    totalQueries: 15234,
    optimizedQueries: 11876,
    avgImprovement: 73,
    responseTimeReduction: 2.4,
    costSavings: 28400,
    activeConnections: 12,
    threatsStopped: 156,
    uptime: 99.94,
    optimizationRate: 78
  };

  const realData = {
    totalQueries: 0,
    optimizedQueries: 0,
    avgImprovement: 0,
    responseTimeReduction: 0,
    costSavings: 0,
    activeConnections: 0,
    threatsStopped: 0,
    uptime: 0,
    optimizationRate: 0
  };

  const data = isDemo ? demoData : realData;

  const recentOptimizations = isDemo ? [
    { 
      query: "SELECT u.*, p.name FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.created_at > ?", 
      improvement: "67%", 
      time: "2 mins ago", 
      status: "success",
      database: "users_db"
    },
    { 
      query: "UPDATE orders SET status = 'shipped' WHERE id IN (SELECT id FROM pending_orders)", 
      improvement: "45%", 
      time: "15 mins ago", 
      status: "success",
      database: "orders_db"
    },
    { 
      query: "SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id GROUP BY c.name", 
      improvement: "82%", 
      time: "1 hour ago", 
      status: "success",
      database: "catalog_db"
    },
    { 
      query: "DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL 90 DAY", 
      improvement: "34%", 
      time: "2 hours ago", 
      status: "success",
      database: "audit_db"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="space-y-8 p-6 max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                {isDemo && (
                  <Badge variant="secondary" className="animate-pulse px-3 py-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Demo Mode
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {isDemo 
                ? `Welcome to DBooster! You're viewing sample data from a production environment with ${data.totalQueries.toLocaleString()} queries optimized.`
                : `Welcome back, ${user?.user_metadata?.full_name || user?.email || 'User'}! Here's your database performance overview.`
              }
            </p>
            {isDemo && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-700 font-medium">
                  This demo shows real optimization results from our enterprise customers
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live monitoring
              </Badge>
              <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                All systems secure
              </Badge>
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg">
              <Link to="/app/ai-studio">
                <Rocket className="h-4 w-4 mr-2" />
                Launch AI Studio
              </Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Queries</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{data.totalQueries.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Analyzed this month</p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Optimized</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">{data.optimizedQueries.toLocaleString()}</div>
              <div className="flex items-center gap-3 mb-1">
                <Progress value={data.optimizationRate} className="flex-1 h-2" />
                <span className="text-sm font-medium text-muted-foreground">{data.optimizationRate}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Performance improvements</p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Improvement</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{data.avgImprovement}%</div>
              <p className="text-sm text-muted-foreground">Query response time</p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-purple-700 bg-purple-100">
                  -{data.responseTimeReduction}s avg
                </Badge>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cost Savings</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">${data.costSavings.toLocaleString()}</div>
              <p className="text-sm text-muted-foreground">Infrastructure savings</p>
              <div className="mt-2">
                <Badge variant="secondary" className="text-emerald-700 bg-emerald-100">
                  60% reduction
                </Badge>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger value="overview" className="min-h-[52px] flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="optimizations" className="min-h-[52px] flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium">Recent</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="min-h-[52px] flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="min-h-[52px] flex flex-col gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Performance Overview */}
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Performance Overview
                    <Badge variant="outline">Real-time</Badge>
                  </CardTitle>
                  <CardDescription>
                    {isDemo ? 'Live performance metrics from your optimized database queries' : 'Connect your database to see performance insights'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isDemo ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                          <div className="text-3xl font-bold text-green-600 mb-1">{data.responseTimeReduction}s</div>
                          <div className="text-sm font-medium text-green-700">Avg Time Saved</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                          <div className="text-3xl font-bold text-blue-600 mb-1">{data.uptime}%</div>
                          <div className="text-sm font-medium text-blue-700">System Uptime</div>
                        </div>
                      </div>
                      <div className="h-40 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-xl border border-border/50 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <BarChart3 className="h-8 w-8 text-muted-foreground mx-auto" />
                          <p className="text-sm font-medium text-muted-foreground">Performance charts coming soon</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Database className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                      <h3 className="text-xl font-semibold mb-3">Connect Your Database</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        Start optimizing by connecting your first database to see real-time performance insights
                      </p>
                      <Button asChild className="bg-gradient-to-r from-primary to-blue-600">
                        <Link to="/app/settings">
                          <Settings className="h-4 w-4 mr-2" />
                          Connect Database
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Rocket className="h-5 w-5 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    {isDemo ? 'Try these features with sample data' : 'Common optimization tasks'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" asChild>
                    <Link to="/app/ai-studio">
                      <Brain className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">AI Query Optimizer</div>
                        <div className="text-xs opacity-90">Intelligent query tuning</div>
                      </div>
                    </Link>
                  </Button>
                  <Button className="w-full justify-start h-12" variant="outline" asChild>
                    <Link to="/app/analytics">
                      <BarChart3 className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Performance Analytics</div>
                        <div className="text-xs text-muted-foreground">Detailed insights</div>
                      </div>
                    </Link>
                  </Button>
                  <Button className="w-full justify-start h-12" variant="outline" asChild>
                    <Link to="/app/monitoring">
                      <Activity className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Real-time Monitor</div>
                        <div className="text-xs text-muted-foreground">Live performance data</div>
                      </div>
                    </Link>
                  </Button>
                  <Button className="w-full justify-start h-12" variant="outline" asChild>
                    <Link to="/app/settings">
                      <Settings className="mr-3 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Database Settings</div>
                        <div className="text-xs text-muted-foreground">Configuration & setup</div>
                      </div>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimizations" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Recent Optimizations
                  <Badge variant="secondary">{recentOptimizations.length} recent</Badge>
                </CardTitle>
                <CardDescription>
                  {isDemo ? 'Latest AI-powered query improvements with real performance gains' : 'No optimizations yet - connect a database to get started'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentOptimizations.length > 0 ? (
                  <div className="space-y-4">
                    {recentOptimizations.map((opt, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0 space-y-2">
                          <p className="text-sm font-mono bg-muted/50 p-2 rounded border text-foreground leading-relaxed">
                            {opt.query}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {opt.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              {opt.database}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-green-700 bg-green-100 font-semibold">
                          +{opt.improvement}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-3">No Optimizations Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Connect your database and run queries to see AI-powered optimizations here
                    </p>
                    <Button asChild>
                      <Link to="/app/ai-studio">
                        <Brain className="h-4 w-4 mr-2" />
                        Start Optimizing
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Query Performance Trends
                  </CardTitle>
                  <CardDescription>
                    Performance improvement trends over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-border/50 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium text-muted-foreground">Performance charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Cost Analysis
                  </CardTitle>
                  <CardDescription>
                    Infrastructure cost savings analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-border/50 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <DollarSign className="h-8 w-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium text-muted-foreground">Cost analysis charts coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-800">Security Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-1">99.9%</div>
                  <p className="text-xs text-green-700 font-medium">All systems secure</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-800">Threats Blocked</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-1">{data.threatsStopped}</div>
                  <p className="text-xs text-blue-700 font-medium">This month</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-800">Active Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-1">{data.activeConnections}</div>
                  <p className="text-xs text-purple-700 font-medium">Secured databases</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  Enterprise Security Dashboard
                </CardTitle>
                <CardDescription>
                  SOC2 compliant security monitoring with real-time threat detection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Your database connections are secured with enterprise-grade encryption and 24/7 monitoring
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Badge variant="outline" className="px-4 py-2">SOC2 Type II</Badge>
                    <Badge variant="outline" className="px-4 py-2">End-to-End Encryption</Badge>
                    <Badge variant="outline" className="px-4 py-2">Audit Logging</Badge>
                    <Badge variant="outline" className="px-4 py-2">24/7 Monitoring</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
