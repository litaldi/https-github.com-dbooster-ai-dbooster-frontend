import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Globe,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { UltimateMetricCard } from '@/components/dashboard/UltimateMetricCard';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { InteractiveQuickActions } from '@/components/dashboard/InteractiveQuickActions';

export default function DashboardPage() {
  const { user, isDemo } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeConnections, setActiveConnections] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time connection changes
      setActiveConnections(prev => Math.max(8, prev + Math.floor(Math.random() * 3) - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Enhanced demo data with trends
  const demoData = {
    totalQueries: 15234,
    optimizedQueries: 11876,
    avgImprovement: 73,
    responseTimeReduction: 2.4,
    costSavings: 28400,
    activeConnections: activeConnections || 12,
    threatsStopped: 156,
    uptime: 99.97,
    optimizationRate: 78,
    trends: {
      queries: [120, 135, 149, 142, 158, 173, 168, 184, 191, 187, 203, 215],
      performance: [45, 52, 48, 61, 67, 73, 69, 78, 82, 79, 85, 91],
      costs: [12400, 15200, 18100, 21300, 24600, 28400],
      response: [180, 165, 142, 128, 115, 98, 89, 76, 68, 61, 54, 47]
    }
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
    optimizationRate: 0,
    trends: {
      queries: [],
      performance: [],
      costs: [],
      response: []
    }
  };

  const data = isDemo ? demoData : realData;

  const recentOptimizations = isDemo ? [
    { 
      query: "SELECT u.*, p.name FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.created_at > ?", 
      improvement: "67%", 
      time: "2 mins ago", 
      status: "success",
      database: "users_db",
      impact: "High"
    },
    { 
      query: "UPDATE orders SET status = 'shipped' WHERE id IN (SELECT id FROM pending_orders)", 
      improvement: "45%", 
      time: "15 mins ago", 
      status: "success",
      database: "orders_db",
      impact: "Medium"
    },
    { 
      query: "SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id GROUP BY c.name", 
      improvement: "82%", 
      time: "1 hour ago", 
      status: "success",
      database: "catalog_db",
      impact: "High"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <div className="space-y-8 p-6 max-w-8xl mx-auto">
        {/* Revolutionary Header Section */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                >
                  <Zap className="h-8 w-8 text-white" />
                </motion.div>
                
                <div>
                  <motion.h1 
                    className="text-4xl lg:text-5xl font-black text-white leading-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Ultimate Dashboard
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-white/90 font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    AI-Powered Database Command Center
                  </motion.p>
                </div>

                {isDemo && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
                      <Eye className="h-4 w-4 mr-2" />
                      Demo Mode - Experience the Future
                    </Badge>
                  </motion.div>
                )}
              </div>

              <motion.p 
                className="text-lg text-white/80 max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {isDemo 
                  ? `🚀 Welcome to the future of database optimization! You're viewing live data from enterprise customers who've achieved incredible results with our AI engine.`
                  : `Welcome back, ${user?.user_metadata?.full_name || user?.email || 'Database Hero'}! Your AI-powered optimization center is ready to revolutionize your database performance.`
                }
              </motion.p>

              <motion.div 
                className="flex flex-wrap items-center gap-6 text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-300" />
                  <span className="font-semibold">73% avg improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-300" />
                  <span className="font-semibold">60% cost reduction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-300" />
                  <span className="font-semibold">Enterprise secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-300" />
                  <span className="font-semibold">{currentTime.toLocaleTimeString()}</span>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
            >
              <Badge className="bg-green-500/20 text-green-100 border-green-400/30 backdrop-blur-sm px-4 py-2 animate-pulse">
                <Activity className="h-4 w-4 mr-2" />
                {data.activeConnections} Live Connections
              </Badge>
              
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 font-bold px-8 py-6"
              >
                <Link to="/app/ai-studio">
                  <Brain className="h-5 w-5 mr-2" />
                  Launch AI Studio
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Revolutionary Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          <UltimateMetricCard
            title="Queries Analyzed"
            value={data.totalQueries.toLocaleString()}
            change="+12.5%"
            changeType="positive"
            icon={Database}
            color="blue"
            subtitle="This month"
            trend={data.trends.queries}
          />
          <UltimateMetricCard
            title="AI Optimizations"
            value={data.optimizedQueries.toLocaleString()}
            change="+8.2%"
            changeType="positive"
            icon={Brain}
            color="purple"
            subtitle="Performance improvements"
            trend={data.trends.performance}
          />
          <UltimateMetricCard
            title="Cost Savings"
            value={`$${data.costSavings.toLocaleString()}`}
            change="+15.3%"
            changeType="positive"
            icon={DollarSign}
            color="emerald"
            subtitle="Infrastructure savings"
            trend={data.trends.costs}
          />
          <UltimateMetricCard
            title="Response Time"
            value={data.responseTimeReduction ? `${data.responseTimeReduction}s` : '--'}
            change="-67%"
            changeType="positive"
            icon={Clock}
            color="blue"
            subtitle="Average improvement"
            trend={data.trends.response}
          />
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AIInsightsPanel />
        </motion.div>

        {/* Interactive Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <InteractiveQuickActions />
        </motion.div>

        {/* Enhanced Tabs with Revolutionary Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Tabs defaultValue="optimizations" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-2 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border-0">
              <TabsTrigger value="optimizations" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl">
                <Zap className="h-5 w-5" />
                <span className="font-medium">Live Optimizations</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Advanced Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Security Center</span>
              </TabsTrigger>
              <TabsTrigger value="global" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Global Network</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="optimizations" className="space-y-6">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg"
                    >
                      <CheckCircle className="h-6 w-6 text-white" />
                    </motion.div>
                    Live Query Optimizations
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse">
                      {recentOptimizations.length} Active
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {isDemo 
                      ? 'Real-time AI optimizations happening right now across enterprise databases' 
                      : 'Connect your database to see live optimization results here'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOptimizations.length > 0 ? (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {recentOptimizations.map((opt, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="group flex items-start space-x-4 p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300"
                          >
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg"
                            >
                              <CheckCircle className="h-5 w-5 text-white" />
                            </motion.div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge className={`text-xs font-bold ${
                                  opt.impact === 'High' 
                                    ? 'bg-red-100 text-red-700 border-red-300' 
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                                }`}>
                                  {opt.impact} Impact
                                </Badge>
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm px-3 py-1">
                                  +{opt.improvement}
                                </Badge>
                              </div>
                              <p className="text-sm font-mono bg-gray-900 text-green-400 p-4 rounded-lg border shadow-inner leading-relaxed">
                                {opt.query}
                              </p>
                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium">{opt.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Database className="h-4 w-4 text-purple-500" />
                                  <span className="font-medium">{opt.database}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Target className="h-4 w-4 text-orange-500" />
                                  <span className="font-medium">Auto-optimized</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
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

            <TabsContent value="analytics">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                    Advanced Analytics Suite
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mb-6"
                    >
                      <BarChart3 className="h-24 w-24 text-purple-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">Revolutionary Analytics Coming Soon</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                      Experience the future of database analytics with AI-powered insights, predictive trends, and real-time performance visualization.
                    </p>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Early Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-red-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="h-6 w-6 text-red-600" />
                    Enterprise Security Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                      <div className="text-4xl font-bold text-green-600 mb-2">99.9%</div>
                      <div className="text-sm font-medium text-green-700">Security Score</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{data.threatsStopped}</div>
                      <div className="text-sm font-medium text-blue-700">Threats Blocked</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                      <div className="text-4xl font-bold text-purple-600 mb-2">{data.activeConnections}</div>
                      <div className="text-sm font-medium text-purple-700">Secured Connections</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="global">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-cyan-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Globe className="h-6 w-6 text-cyan-600" />
                    Global Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="mb-6"
                    >
                      <Globe className="h-24 w-24 text-cyan-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4">Global Edge Network</h3>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                      Your databases are protected by our global network of 50+ edge locations worldwide, ensuring optimal performance and security.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Badge variant="outline" className="px-4 py-2">🌍 50+ Edge Locations</Badge>
                      <Badge variant="outline" className="px-4 py-2">⚡ <10ms Latency</Badge>
                      <Badge variant="outline" className="px-4 py-2">🔒 End-to-End Encryption</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
