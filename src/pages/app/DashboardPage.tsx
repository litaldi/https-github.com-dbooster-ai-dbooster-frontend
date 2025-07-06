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
import { QuantumMetricCube } from '@/components/dashboard/QuantumMetricCube';
import { AIAvatarAssistant } from '@/components/dashboard/AIAvatarAssistant';
import { HolographicChart } from '@/components/dashboard/HolographicChart';
import { ParticleField } from '@/components/dashboard/ParticleField';
import { GestureController } from '@/components/dashboard/GestureController';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { InteractiveQuickActions } from '@/components/dashboard/InteractiveQuickActions';

export default function DashboardPage() {
  const { user, isDemo } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeConnections, setActiveConnections] = useState(0);
  const [hypernova, setHypernova] = useState(true);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Particle Field Background */}
      <ParticleField />
      
      {/* Gesture Controller */}
      <GestureController />
      
      {/* AI Avatar Assistant */}
      <AIAvatarAssistant />

      <div className="space-y-8 p-6 max-w-8xl mx-auto relative z-10">
        {/* Hypernova Header Section */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 p-8 shadow-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Holographic Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -150],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl"
                >
                  <Brain className="h-8 w-8 text-white" />
                </motion.div>
                
                <div>
                  <motion.h1 
                    className="text-5xl lg:text-6xl font-black text-white leading-tight bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Hypernova Dashboard
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-white/90 font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    🚀 Next-Generation AI Command Center
                  </motion.p>
                </div>

                {isDemo && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-none backdrop-blur-sm px-6 py-3 text-lg font-bold">
                      <Sparkles className="h-5 w-5 mr-2" />
                      10B x Enhanced Demo
                    </Badge>
                  </motion.div>
                )}
              </div>

              <motion.p 
                className="text-lg text-white/80 max-w-4xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {isDemo 
                  ? `🌟 Experience the future of database optimization! Revolutionary AI, quantum visualizations, and hypernova performance monitoring combined into the ultimate enterprise dashboard.`
                  : `Welcome to the future, ${user?.user_metadata?.full_name || user?.email || 'Database Hero'}! Your hypernova-powered optimization center with quantum AI assistance.`
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
                  <span className="font-semibold">95% AI accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-cyan-300" />
                  <span className="font-semibold">Quantum processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-300" />
                  <span className="font-semibold">Neural optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-300" />
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
              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-black border-none animate-pulse px-4 py-2 font-bold">
                <Activity className="h-4 w-4 mr-2" />
                {data.activeConnections} Quantum Connections
              </Badge>
              
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 font-bold px-8 py-6"
              >
                <Link to="/app/ai-studio">
                  <Brain className="h-5 w-5 mr-2" />
                  Launch Quantum AI
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Quantum Metrics Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
        >
          <QuantumMetricCube
            title="Queries Analyzed"
            value={data.totalQueries.toLocaleString()}
            change="+12.5%"
            changeType="positive"
            icon={Database}
            color="blue"
            trend={data.trends.queries}
          />
          <QuantumMetricCube
            title="AI Optimizations"
            value={data.optimizedQueries.toLocaleString()}
            change="+8.2%"
            changeType="positive"
            icon={Brain}
            color="purple"
            trend={data.trends.performance}
          />
          <QuantumMetricCube
            title="Cost Savings"
            value={`$${data.costSavings.toLocaleString()}`}
            change="+15.3%"
            changeType="positive"
            icon={DollarSign}
            color="emerald"
            trend={data.trends.costs}
          />
          <QuantumMetricCube
            title="Response Time"
            value={data.responseTimeReduction ? `${data.responseTimeReduction}s` : '--'}
            change="-67%"
            changeType="positive"
            icon={Clock}
            color="blue"
            trend={data.trends.response}
          />
        </motion.div>

        {/* Holographic Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <HolographicChart />
        </motion.div>

        {/* AI Insights Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <AIInsightsPanel />
        </motion.div>

        {/* Interactive Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <InteractiveQuickActions />
        </motion.div>

        {/* Enhanced Tabs with Revolutionary Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Tabs defaultValue="hypernova" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-2 bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-500/30">
              <TabsTrigger value="hypernova" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">
                <Rocket className="h-5 w-5" />
                <span className="font-medium">Hypernova</span>
              </TabsTrigger>
              <TabsTrigger value="quantum" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">
                <Brain className="h-5 w-5" />
                <span className="font-medium">Quantum AI</span>
              </TabsTrigger>
              <TabsTrigger value="neural" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Neural Net</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Quantum Shield</span>
              </TabsTrigger>
              <TabsTrigger value="multiverse" className="min-h-[60px] flex flex-col gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Multiverse</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hypernova" className="space-y-6">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/80 to-purple-900/80 backdrop-blur-sm border border-purple-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg"
                    >
                      <Rocket className="h-6 w-6 text-white" />
                    </motion.div>
                    Hypernova Performance Matrix
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white animate-pulse">
                      <Sparkles className="h-4 w-4 mr-1" />
                      Live Quantum Data
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base text-gray-300">
                    Real-time hypernova-powered optimization happening across dimensional databases
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
                            className="group flex items-start space-x-4 p-6 bg-gradient-to-r from-slate-800/50 to-purple-800/30 rounded-2xl border border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg shadow-lg"
                            >
                              <CheckCircle className="h-5 w-5 text-white" />
                            </motion.div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex items-center justify-between">
                                <Badge className={`text-xs font-bold border-none ${
                                  opt.impact === 'High' 
                                    ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white' 
                                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                                }`}>
                                  {opt.impact} Quantum Impact
                                </Badge>
                                <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-sm px-4 py-2">
                                  +{opt.improvement}
                                </Badge>
                              </div>
                              <p className="text-sm font-mono bg-slate-900 text-green-400 p-4 rounded-lg border border-green-500/30 shadow-inner leading-relaxed">
                                {opt.query}
                              </p>
                              <div className="flex items-center gap-6 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-cyan-400" />
                                  <span className="font-medium">{opt.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Database className="h-4 w-4 text-purple-400" />
                                  <span className="font-medium">{opt.database}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Brain className="h-4 w-4 text-pink-400" />
                                  <span className="font-medium">Quantum-optimized</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Rocket className="h-24 w-24 text-purple-400 mx-auto mb-6" />
                      </motion.div>
                      <h3 className="text-2xl font-bold mb-3 text-white">Ready for Hypernova Launch</h3>
                      <p className="text-gray-300 mb-6">
                        Connect your database to experience quantum-powered optimizations
                      </p>
                      <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                        <Link to="/app/ai-studio">
                          <Brain className="h-4 w-4 mr-2" />
                          Launch Quantum Engine
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quantum">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/80 to-cyan-900/80 backdrop-blur-sm border border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <Brain className="h-6 w-6 text-cyan-400" />
                    Quantum AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mb-6"
                    >
                      <Brain className="h-24 w-24 text-cyan-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Quantum AI Core</h3>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                      Experience the future of database analytics with AI-powered insights, predictive trends, and real-time performance visualization.
                    </p>
                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Unlock Quantum Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="neural">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/80 to-indigo-900/80 backdrop-blur-sm border border-indigo-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <BarChart3 className="h-6 w-6 text-indigo-400" />
                    Neural Network Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="mb-6"
                    >
                      <BarChart3 className="h-24 w-24 text-indigo-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Neural Network Insights</h3>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                      Visualize complex data patterns with our advanced neural network analytics engine.
                    </p>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Explore Neural Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/80 to-red-900/80 backdrop-blur-sm border border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <Shield className="h-6 w-6 text-red-400" />
                    Quantum Shield Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-gradient-to-br from-red-50/50 to-red-100/50 rounded-2xl border border-red-200">
                      <div className="text-4xl font-bold text-red-400 mb-2">99.9%</div>
                      <div className="text-sm font-medium text-red-300">Security Score</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-50/50 to-red-100/50 rounded-2xl border border-red-200">
                      <div className="text-4xl font-bold text-red-400 mb-2">{data.threatsStopped}</div>
                      <div className="text-sm font-medium text-red-300">Threats Blocked</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-50/50 to-red-100/50 rounded-2xl border border-red-200">
                      <div className="text-4xl font-bold text-red-400 mb-2">{data.activeConnections}</div>
                      <div className="text-sm font-medium text-red-300">Secured Connections</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="multiverse">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/80 to-green-900/80 backdrop-blur-sm border border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-white">
                    <Globe className="h-6 w-6 text-green-400" />
                    Multiverse Network Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="mb-6"
                    >
                      <Globe className="h-24 w-24 text-green-400 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Global Edge Network</h3>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                      Your databases are protected by our global network of 50+ edge locations worldwide, ensuring optimal performance and security.
                    </p>
                    <div className="flex justify-center gap-4">
                      <Badge variant="outline" className="px-4 py-2">🌍 50+ Edge Locations</Badge>
                      <Badge variant="outline" className="px-4 py-2">⚡ &lt;10ms Latency</Badge>
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
