
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
  ChevronRight,
  Bell,
  Eye,
  FileText,
  Settings
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

// Recent activity feed component
function RecentActivity() {
  const activities = [
    { id: 1, type: 'optimization', message: 'Query optimization completed', time: '2 minutes ago', icon: Zap },
    { id: 2, type: 'connection', message: 'New database connection established', time: '15 minutes ago', icon: Database },
    { id: 3, type: 'alert', message: 'Performance threshold exceeded', time: '1 hour ago', icon: AlertCircle },
    { id: 4, type: 'analysis', message: 'Weekly performance report generated', time: '3 hours ago', icon: FileText }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest database optimization activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Performance trends chart placeholder
function PerformanceTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Performance Trends
        </CardTitle>
        <CardDescription>Query response time over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Average Response Time</span>
            <span className="font-semibold text-green-600">-23% vs last week</span>
          </div>
          <Progress value={77} className="h-2" />
          <div className="grid grid-cols-7 gap-2 mt-4">
            {[65, 58, 72, 49, 41, 38, 35].map((value, index) => (
              <div key={index} className="text-center">
                <div className={`h-${Math.max(1, Math.floor(value/10))} bg-primary/20 rounded-sm mb-1`} />
                <span className="text-xs text-muted-foreground">{value}ms</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// System alerts component
function SystemAlerts() {
  const alerts = [
    { id: 1, type: 'warning', message: 'High CPU usage detected on server-2', severity: 'medium' },
    { id: 2, type: 'info', message: '3 queries optimized automatically', severity: 'low' },
    { id: 3, type: 'success', message: 'Backup completed successfully', severity: 'low' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
            <div className={`w-2 h-2 rounded-full ${
              alert.severity === 'medium' ? 'bg-orange-500' : 
              alert.severity === 'low' ? 'bg-blue-500' : 'bg-green-500'
            }`} />
            <span className="text-sm flex-1">{alert.message}</span>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
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

export default function Dashboard() {
  const { user } = useAuth();

  // Sample data for improved metrics
  const data = {
    totalQueries: 15234,
    optimized: 12847,
    avgImprovement: 73,
    monthlySavings: 28400,
    activeConnections: 156,
    uptime: 99.97,
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
        {/* Clean Header Section - No Welcome Message */}
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
                Your database optimization center with AI-powered insights and performance monitoring.
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
              change="+12.5% this month"
              icon={Database}
              description="Analyzed and optimized"
              color="blue"
              trend={85}
            />
            <EnhancedMetricsCard
              title="Optimized"
              value={data.optimized.toLocaleString()}
              change="+8.2% improvement"
              icon={Zap}
              description="Performance enhanced"
              color="green"
              trend={92}
            />
            <EnhancedMetricsCard
              title="Avg Improvement"
              value={`${data.avgImprovement}%`}
              change="+15% vs last month"
              icon={TrendingUp}
              description="Response time reduction"
              color="purple"
              trend={73}
            />
            <EnhancedMetricsCard
              title="Monthly Savings"
              value={`$${data.monthlySavings.toLocaleString()}`}
              change="+23% cost reduction"
              icon={DollarSign}
              description="Infrastructure cost savings"
              color="orange"
              trend={78}
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Activity and Trends */}
          <div className="lg:col-span-2 space-y-6">
            <RecentActivity />
            <PerformanceTrends />
          </div>

          {/* Right Column - Quick Actions and Alerts */}
          <div className="space-y-6">
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

            <SystemAlerts />
          </div>
        </div>

        {/* System Health Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Shield className="h-5 w-5 text-emerald-600" />
                System Health & Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <span className="text-sm font-medium text-emerald-700">Security Score</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {data.securityScore}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <span className="text-sm font-medium text-emerald-700">System Uptime</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {data.uptime}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <span className="text-sm font-medium text-emerald-700">Active Connections</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {data.activeConnections}
                  </Badge>
                </div>
              </div>
              <Separator className="bg-emerald-200 my-4" />
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">All systems operational • SOC2 Compliant • 24/7 Monitoring</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
