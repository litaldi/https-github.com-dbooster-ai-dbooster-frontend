
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Zap, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function Dashboard() {
  const { user, isDemo } = useAuth();

  const mockData = {
    totalQueries: isDemo ? 15234 : 8542,
    optimized: isDemo ? 11876 : 6231,
    avgImprovement: isDemo ? 67 : 54,
    monthlySavings: isDemo ? 2840 : 1920
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}
            {isDemo && <Badge variant="secondary" className="ml-2">Demo Mode</Badge>}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Analyzed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimized</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.optimized.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Performance improvements applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.avgImprovement}%</div>
            <p className="text-xs text-muted-foreground">Query response time reduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockData.monthlySavings}</div>
            <p className="text-xs text-muted-foreground">Infrastructure cost reduction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Optimizations</CardTitle>
            <CardDescription>Latest database performance improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { query: "SELECT * FROM users WHERE...", improvement: "45%", time: "2 hours ago" },
              { query: "UPDATE orders SET status...", improvement: "62%", time: "4 hours ago" },
              { query: "JOIN products ON orders...", improvement: "38%", time: "6 hours ago" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.query}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </p>
                </div>
                <Badge variant="secondary">+{item.improvement}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with database optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              Connect New Database
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Zap className="mr-2 h-4 w-4" />
              Run Query Analysis
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Performance Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
