import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  TrendingUp, 
  Zap, 
  Activity,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { productionLogger } from '@/utils/productionLogger';

export function DemoDashboardSection() {
  const [activeTab, setActiveTab] = useState('metrics');
  const [isLaunching, setIsLaunching] = useState(false);
  const navigate = useNavigate();
  const { loginDemo } = useAuth();

  const metrics = [
    {
      title: "Queries Optimized",
      value: "1,247",
      change: "+23%",
      icon: Database,
      color: "blue"
    },
    {
      title: "Performance Boost",
      value: "87%",
      change: "+12%",
      icon: TrendingUp,
      color: "green"
    },
    {
      title: "Response Time",
      value: "89ms",
      change: "-45%",
      icon: Clock,
      color: "purple"
    },
    {
      title: "Cost Savings",
      value: "$15.2k",
      change: "+34%",
      icon: Zap,
      color: "orange"
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

  const handleStartLiveDemo = async () => {
    try {
      setIsLaunching(true);
      productionLogger.info('Starting demo from DemoDashboardSection', {}, 'DemoDashboardSection');
      await loginDemo();
      productionLogger.info('Demo login successful, navigating to dashboard', {}, 'DemoDashboardSection');
      toast.success('Demo session started!');
      navigate('/app/dashboard-alt');
    } catch (error) {
      productionLogger.error('Demo start error', error, 'DemoDashboardSection');
      toast.error('Failed to start demo session. Please try again.');
    } finally {
      setIsLaunching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Activity className="h-4 w-4 mr-2" />
              Live Demo Dashboard
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experience DBooster in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our real-time dashboard with live data and interactive features. 
              See how AI-powered optimization transforms database performance.
            </p>
          </motion.div>
        </div>

        {/* Interactive Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-background border rounded-2xl shadow-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-4 text-sm text-muted-foreground font-mono">
                dashboard.dbooster.com
              </span>
            </div>
            <Button 
              onClick={handleStartLiveDemo} 
              disabled={isLaunching}
              className="h-8 text-xs"
            >
              <Play className="h-3 w-3 mr-1" />
              {isLaunching ? 'Starting...' : 'Launch Live Demo'}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="optimizations">Live Optimizations</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={index} className="relative overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">{metric.value}</div>
                            <div className="text-sm text-green-600">{metric.change}</div>
                          </div>
                          <Icon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Query Performance Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Average Response Time</span>
                      <span className="font-medium">89ms</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Target: 100ms</span>
                      <span>15% under target</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimizations" className="space-y-4">
              {recentOptimizations.map((opt, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-mono text-sm text-muted-foreground mb-1">
                          {opt.query}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600">
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
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    AI-Powered Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900 mb-1">Index Optimization Opportunity</div>
                    <div className="text-sm text-blue-700">
                      Adding composite index on (user_id, created_at) could improve 23 queries by ~65%
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-900 mb-1">Query Pattern Detected</div>
                    <div className="text-sm text-green-700">
                      Frequent LIKE operations could benefit from full-text search implementation
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="font-medium text-yellow-900 mb-1">N+1 Query Warning</div>
                    <div className="text-sm text-yellow-700">
                      Detected potential N+1 pattern - consider eager loading optimization
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={handleStartLiveDemo}
              disabled={isLaunching}
              size="lg"
              className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl"
            >
              {isLaunching ? 'Starting Demo...' : 'Launch Full Interactive Demo'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Experience the complete dashboard with your own data
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
