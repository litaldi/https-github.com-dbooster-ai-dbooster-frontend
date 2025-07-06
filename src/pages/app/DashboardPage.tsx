
import { StatsCard } from '@/components/ui/enhanced-card-system';
import { Database, TrendingUp, Clock, Zap } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your database performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Queries Optimized"
          value="1,247"
          description="This month"
          icon={<Zap className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Performance Improvement"
          value="73%"
          description="Average across all queries"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Response Time Reduction"
          value="2.4s"
          description="Average improvement"
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Connected Databases"
          value="5"
          description="Active connections"
          icon={<Database className="h-5 w-5" />}
        />
      </div>

      {/* Additional dashboard content would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder for charts and additional widgets */}
      </div>
    </div>
  );
}
