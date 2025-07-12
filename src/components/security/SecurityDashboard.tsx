
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw, Eye, Ban } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityStatsCard } from './SecurityStatsCard';
import { SecurityEventsTable } from './SecurityEventsTable';
import { useSecurityEvents } from '@/hooks/useSecurityEvents';
import { securityService } from '@/services/securityService';
import { useState, useEffect } from 'react';

export function SecurityDashboard() {
  const { events, stats, loading, refreshEvents } = useSecurityEvents();
  const [enhancedStats, setEnhancedStats] = useState({
    totalEvents: 0,
    threatsDetected: 0,
    blockedIPs: 0,
    recentHighRiskEvents: []
  });
  const [loadingEnhanced, setLoadingEnhanced] = useState(true);

  const loadEnhancedStats = async () => {
    try {
      setLoadingEnhanced(true);
      const summary = await securityService.getEnhancedSecuritySummary();
      setEnhancedStats(summary);
    } catch (error) {
      console.error('Failed to load enhanced security stats:', error);
    } finally {
      setLoadingEnhanced(false);
    }
  };

  useEffect(() => {
    loadEnhancedStats();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([
      refreshEvents(),
      loadEnhancedStats()
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Security Dashboard</h2>
          <p className="text-muted-foreground">Monitor security events, threats, and system activity with real-time protection</p>
        </div>
        <Button onClick={handleRefresh} disabled={loading || loadingEnhanced}>
          <RefreshCw className={`h-4 w-4 mr-2 ${(loading || loadingEnhanced) ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Enhanced Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

        <SecurityStatsCard
          title="Threats Blocked"
          value={enhancedStats.threatsDetected}
          description="Last 24 hours"
          icon={Eye}
          variant="destructive"
        />

        <SecurityStatsCard
          title="Blocked IPs"
          value={enhancedStats.blockedIPs}
          description="Currently blocked"
          icon={Ban}
          variant="warning"
        />
      </div>

      {/* High-Risk Events Alert */}
      {enhancedStats.recentHighRiskEvents.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent High-Risk Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enhancedStats.recentHighRiskEvents.slice(0, 3).map((event: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-3">
                    <Badge variant="destructive">{event.event_type}</Badge>
                    <span className="text-sm text-gray-600">
                      {new Date(event.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.ip_address && `IP: ${event.ip_address}`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security events and system activities with enhanced threat detection
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
