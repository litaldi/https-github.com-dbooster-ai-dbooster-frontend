
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Activity, 
  Eye, 
  Database, 
  Zap, 
  Settings,
  HelpCircle,
  Bell,
  Search,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'stable';
}

function MetricCard({ title, value, change, icon, trend }: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className={`text-sm ${getTrendColor()}`}>{change}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OptimizedDashboardLayout() {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const sampleMetrics = [
    {
      title: "Queries Optimized",
      value: "1,247",
      change: "+23% this month",
      icon: <Database className="h-4 w-4" />,
      trend: 'up' as const
    },
    {
      title: "Performance Boost",
      value: "87%",
      change: "+12% improvement",
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const
    },
    {
      title: "Response Time",
      value: "89ms",
      change: "-45% reduction",
      icon: <Clock className="h-4 w-4" />,
      trend: 'up' as const
    },
    {
      title: "Cost Savings",
      value: "$15.2k",
      change: "+34% this quarter",
      icon: <Zap className="h-4 w-4" />,
      trend: 'up' as const
    }
  ];

  const recentOptimizations = [
    {
      query: "SELECT * FROM orders WHERE...",
      improvement: "73% faster",
      status: "optimized",
      time: "2 min ago"
    },
    {
      query: "SELECT u.*, p.* FROM users...",
      improvement: "84% faster",
      status: "optimized",
      time: "5 min ago"
    },
    {
      query: "SELECT COUNT(*) FROM events...",
      improvement: "91% faster",
      status: "reviewing",
      time: "8 min ago"
    }
  ];

  const simulateDataLoad = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      setLoadingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800 border-green-200';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              Database Optimization Dashboard
            </h1>
            {isDemo && (
              <Badge variant="secondary" className="animate-pulse bg-blue-100 text-blue-800">
                <Eye className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            {isDemo 
              ? 'Explore enterprise-grade features with interactive demos and sample data'
              : 'Real-time insights with AI-powered optimization recommendations'
            }
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>94% performance score</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4 text-blue-600" />
              <span>156 active connections</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>All systems secure</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="animate-pulse border-green-500 text-green-700">
              <Activity className="h-3 w-3 mr-1" />
              Live monitoring
            </Badge>
            <Button variant="outline" size="sm" onClick={simulateDataLoad} disabled={isLoading}>
              <Activity className="h-4 w-4 mr-2" />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
            <Link to="/ai-studio">
              <Brain className="h-4 w-4 mr-2" />
              AI Studio
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Loading Progress */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span>Refreshing dashboard data...</span>
              <span>{loadingProgress}%</span>
            </div>
            <Progress value={loadingProgress} className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {sampleMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <MetricCard {...metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
          <TabsTrigger value="overview" className="min-h-[44px] flex flex-col gap-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="min-h-[44px] flex flex-col gap-1">
            <Zap className="h-4 w-4" />
            <span className="text-xs">Optimizations</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="min-h-[44px] flex flex-col gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="min-h-[44px] flex flex-col gap-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Query Response Time</span>
                    <span className="font-medium">89ms avg</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Optimization Rate</span>
                    <span className="font-medium">94% success</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Efficiency</span>
                    <span className="font-medium">96% optimal</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-900 text-sm">Index Optimization Opportunity</div>
                  <div className="text-xs text-blue-700 mt-1">
                    Adding composite index could improve 23 queries by ~65%
                  </div>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-900 text-sm">Query Pattern Detected</div>
                  <div className="text-xs text-green-700 mt-1">
                    Frequent JOIN operations optimized successfully
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="font-medium text-yellow-900 text-sm">Performance Alert</div>
                  <div className="text-xs text-yellow-700 mt-1">
                    Monitor memory usage during peak hours
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Recent Query Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOptimizations.map((opt, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-muted-foreground mb-1">
                          {opt.query}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {opt.improvement}
                          </Badge>
                          <Badge className={getStatusColor(opt.status)}>
                            {opt.status === 'optimized' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {opt.status === 'reviewing' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {opt.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {opt.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Advanced Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Detailed performance charts, trends, and predictive analytics
            </p>
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              View Full Analytics
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Security Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              SOC2 compliant monitoring with real-time threat detection
            </p>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="outline" className="border-green-500 text-green-700">SOC2 Certified</Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-700">99.9% Uptime</Badge>
              <Badge variant="outline" className="border-purple-500 text-purple-700">Zero Threats</Badge>
            </div>
            <Button asChild>
              <Link to="/testing">
                <Shield className="h-4 w-4 mr-2" />
                Security Testing Dashboard
              </Link>
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Demo Mode Information */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg"
        >
          <div className="flex items-start gap-4">
            <Eye className="h-6 w-6 text-blue-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-2">Demo Mode Active</h3>
              <p className="text-sm text-blue-700 mb-4">
                You're exploring DBooster with sample data and interactive features. All functionality 
                is fully operational with realistic scenarios and performance metrics.
              </p>
              <div className="flex gap-3">
                <Button asChild size="sm">
                  <Link to="/pricing">
                    Upgrade to Full Version
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/demo">
                    Learn More About Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
