
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Database, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Activity, 
  Shield, 
  Brain, 
  ArrowRight, 
  Users, 
  DollarSign,
  AlertCircle,
  Star,
  Target,
  Rocket,
  Globe,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Enhanced metrics card with better animations and design
function EnhancedMetricsCard({ title, value, change, icon: Icon, description, color = "blue", trend }) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200",
    green: "from-emerald-50 to-emerald-100 border-emerald-200", 
    purple: "from-purple-50 to-purple-100 border-purple-200",
    orange: "from-orange-50 to-orange-100 border-orange-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} border-2 hover:shadow-xl transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">{title}</CardTitle>
          <div className="p-2.5 rounded-xl bg-white/50 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-800">{value}</div>
            <p className="text-sm text-gray-600 font-medium">{description}</p>
            {change && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-sm text-emerald-600 font-semibold">{change}</span>
                </div>
                {trend && <Progress value={trend} className="h-1.5 w-16" />}
              </div>
            )}
          </div>
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/20 rounded-full blur-xl" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Enhanced quick actions with better visual hierarchy
function EnhancedQuickActionsGrid({ actions }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Button 
              variant="ghost" 
              className="w-full h-auto p-6 justify-start text-left hover:bg-accent/50 border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 group"
              asChild
            >
              <Link to={action.href} className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

// Welcome section for new users
function WelcomeSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16 px-6"
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex p-6 rounded-full bg-gradient-to-br from-primary/20 to-blue-600/20 mb-6"
          >
            <Database className="h-16 w-16 text-primary" />
          </motion.div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Welcome to DBooster
          </h3>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your AI-powered database optimization platform. Connect your database to unlock 
            powerful insights and performance improvements.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-12">
          {[
            { icon: Rocket, title: "Quick Setup", desc: "Connect in minutes" },
            { icon: Brain, title: "AI Insights", desc: "Smart recommendations" },
            { icon: Target, title: "Optimization", desc: "Boost performance" }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90" asChild>
            <Link to="/app/query-analyzer">
              <Database className="h-5 w-5 mr-2" />
              Connect Database
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/app/ai-studio">
              <Brain className="h-5 w-5 mr-2" />
              Explore AI Studio
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  // Clean data structure
  const data = {
    totalQueries: 0,
    optimized: 0,
    avgImprovement: 0,
    monthlySavings: 0,
    activeConnections: 0,
    uptime: 99.9,
    securityScore: 100
  };

  const quickActions = [
    {
      title: "Query Analyzer",
      description: "Analyze SQL queries for performance bottlenecks and get AI-powered optimization suggestions",
      icon: Database,
      href: "/app/query-analyzer"
    },
    {
      title: "Performance Monitor",
      description: "Real-time monitoring dashboard with detailed metrics and performance insights",
      icon: Activity,
      href: "/app/monitoring"
    },
    {
      title: "AI Studio",
      description: "Advanced AI tools for query generation, optimization, and database health analysis",
      icon: Brain,
      href: "/app/ai-studio"
    },
    {
      title: "Security Dashboard",
      description: "Comprehensive security monitoring with threat detection and compliance reporting",
      icon: Shield,
      href: "/app/security"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Welcome back, <span className="font-semibold text-foreground">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>. 
                Monitor your database performance and discover optimization opportunities with AI-powered insights.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button variant="outline" size="lg" className="hover:bg-accent/50" asChild>
                <Link to="/app/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg" asChild>
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Metrics Overview */}
        <section aria-labelledby="metrics-heading">
          <motion.h2 
            id="metrics-heading" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold mb-6 flex items-center gap-2"
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            Performance Overview
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <EnhancedMetricsCard
              title="Total Queries"
              value={data.totalQueries.toLocaleString()}
              change=""
              icon={Database}
              description="Analyzed this month"
              color="blue"
              trend={0}
            />
            <EnhancedMetricsCard
              title="Optimized"
              value={data.optimized.toLocaleString()}
              change=""
              icon={Zap}
              description="Performance improvements"
              color="green"
              trend={0}
            />
            <EnhancedMetricsCard
              title="Avg Improvement"
              value={`${data.avgImprovement}%`}
              change=""
              icon={TrendingUp}
              description="Response time reduction"
              color="purple"
              trend={0}
            />
            <EnhancedMetricsCard
              title="Monthly Savings"
              value={`$${data.monthlySavings.toLocaleString()}`}
              change=""
              icon={DollarSign}
              description="Infrastructure cost savings"
              color="orange"
              trend={0}
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Getting Started Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="border-2 border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                        <Rocket className="h-6 w-6 text-primary" />
                      </div>
                      Get Started
                    </CardTitle>
                    <CardDescription className="text-base">
                      Connect your database to unlock powerful optimization insights
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <WelcomeSection />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="border-2 border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Essential tools for database optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedQuickActionsGrid actions={quickActions} />
              </CardContent>
            </Card>

            {/* System Health Card */}
            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700">Security Score</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {data.securityScore}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700">System Uptime</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {data.uptime}%
                  </Badge>
                </div>
                <Separator className="bg-emerald-200" />
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">All systems operational</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Status Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Platform Status
              </CardTitle>
              <CardDescription>Real-time monitoring across all services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: "Database Connections", value: data.activeConnections, status: "ready" },
                  { label: "API Response Time", value: "< 100ms", status: "optimal" },
                  { label: "Service Status", value: "Operational", status: "healthy" }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <Badge 
                      variant="secondary" 
                      className="bg-emerald-100 text-emerald-800 border-emerald-200"
                    >
                      {item.value}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
