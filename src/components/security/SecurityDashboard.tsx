
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SecurityStatsCard } from './SecurityStatsCard';
import { SecurityEventsTable } from './SecurityEventsTable';
import { useSecurityEvents } from '@/hooks/useSecurityEvents';

export function SecurityDashboard() {
  const { events, stats, loading, refreshEvents } = useSecurityEvents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">Monitor security events and system activity</p>
        </div>
        <Button onClick={refreshEvents} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SecurityStatsCard
          title="Total Events"
          value={stats.totalEvents}
          description="Last 50 events"
          icon={Shield}
        />
        
        <SecurityStatsCard
          title="Security Issues"
          value={stats.securityViolations}
          description="Violations detected"
          icon={AlertTriangle}
          variant="destructive"
        />
        
        <SecurityStatsCard
          title="Rate Limits"
          value={stats.rateLimitHits}
          description="Rate limit events"
          icon={Clock}
          variant="warning"
        />
        
        <SecurityStatsCard
          title="Recent Activity"
          value={stats.recentActivity}
          description="Last hour"
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Security Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security events and system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SecurityEventsTable events={events} />

          {events.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No security events found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
