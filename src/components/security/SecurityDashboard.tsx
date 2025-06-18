
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { securityService } from '@/services/securityService';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type SecurityAuditLog = Database['public']['Tables']['security_audit_log']['Row'];

interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function SecurityDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    securityViolations: 0,
    rateLimitHits: 0,
    recentActivity: 0
  });

  const loadSecurityEvents = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get recent security events
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (recentEvents) {
        // Transform the data to match our SecurityEvent interface
        const transformedEvents: SecurityEvent[] = recentEvents.map((event: SecurityAuditLog) => ({
          id: event.id,
          event_type: event.event_type,
          event_data: event.event_data,
          ip_address: event.ip_address as string | null,
          user_agent: event.user_agent,
          created_at: event.created_at || new Date().toISOString()
        }));

        setEvents(transformedEvents);
        
        // Calculate stats
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentActivity = transformedEvents.filter(
          e => new Date(e.created_at) > oneHourAgo
        ).length;
        
        const securityViolations = transformedEvents.filter(
          e => e.event_type.includes('violation') || 
               e.event_type.includes('suspicious') ||
               e.event_type.includes('failure')
        ).length;
        
        const rateLimitHits = transformedEvents.filter(
          e => e.event_type.includes('rate_limit')
        ).length;

        setStats({
          totalEvents: transformedEvents.length,
          securityViolations,
          rateLimitHits,
          recentActivity
        });
      }
    } catch (error) {
      console.error('Failed to load security events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityEvents();
  }, []);

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('violation') || eventType.includes('failure') || eventType.includes('suspicious')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (eventType.includes('rate_limit')) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getEventBadgeVariant = (eventType: string): "default" | "secondary" | "destructive" | "outline" => {
    if (eventType.includes('violation') || eventType.includes('failure') || eventType.includes('suspicious')) {
      return 'destructive';
    }
    if (eventType.includes('rate_limit')) {
      return 'secondary';
    }
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">Monitor security events and system activity</p>
        </div>
        <Button onClick={loadSecurityEvents} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Last 50 events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.securityViolations}</div>
            <p className="text-xs text-muted-foreground">Violations detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.rateLimitHits}</div>
            <p className="text-xs text-muted-foreground">Rate limit events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Last hour</p>
          </CardContent>
        </Card>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="flex items-center gap-2">
                    {getEventIcon(event.event_type)}
                    <span className="font-medium">{event.event_type.replace(/_/g, ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEventBadgeVariant(event.event_type)}>
                      {event.event_type.split('_')[0]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">
                      {event.event_data ? JSON.stringify(event.event_data).slice(0, 100) + '...' : 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {event.ip_address || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(event.created_at), 'MMM dd, HH:mm:ss')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
