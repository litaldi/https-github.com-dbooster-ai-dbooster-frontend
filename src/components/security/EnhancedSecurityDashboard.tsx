
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Eye,
  Lock,
  FileText,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { enhancedAuthenticationSecurity } from '@/services/security/enhancedAuthenticationSecurity';
import { securityHeaders } from '@/services/security/securityHeaders';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  sessionCount: number;
  lockedAccounts: number;
  recentNotifications: Array<{
    id: string;
    event_type: string;
    severity: string;
    message: string;
    created_at: string;
  }>;
  rateLimitEvents: number;
  headersScore: number;
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  actionRequired?: boolean;
}

export function EnhancedSecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    sessionCount: 0,
    lockedAccounts: 0,
    recentNotifications: [],
    rateLimitEvents: 0,
    headersScore: 0
  });
  
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadSecurityMetrics = async () => {
    setLoading(true);
    try {
      // Load security audit events (last 24 hours)
      const { data: auditEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Load security notifications
      const { data: notifications } = await supabase
        .from('security_notifications')
        .select('*')
        .eq('acknowledged', false)
        .order('created_at', { ascending: false })
        .limit(10);

      // Load active sessions
      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('id')
        .gt('expires_at', new Date().toISOString());

      // Load locked accounts
      const { data: lockouts } = await supabase
        .from('account_lockouts')
        .select('id')
        .gt('locked_until', new Date().toISOString());

      // Load rate limit events
      const { data: rateLimits } = await supabase
        .from('rate_limit_tracking')
        .select('id')
        .not('blocked_until', 'is', null)
        .gt('blocked_until', new Date().toISOString());

      // Validate security headers
      const headersValidation = securityHeaders.validateSecurityHeaders();

      const criticalEvents = auditEvents?.filter(event => 
        event.event_type.includes('violation') || 
        event.event_type.includes('blocked') ||
        event.event_type.includes('high_risk')
      ).length || 0;

      setMetrics({
        totalEvents: auditEvents?.length || 0,
        criticalEvents,
        sessionCount: sessions?.length || 0,
        lockedAccounts: lockouts?.length || 0,
        recentNotifications: notifications || [],
        rateLimitEvents: rateLimits?.length || 0,
        headersScore: headersValidation.score
      });

      // Generate security alerts
      const newAlerts: SecurityAlert[] = [];

      if (criticalEvents > 5) {
        newAlerts.push({
          id: 'high-critical-events',
          type: 'error',
          title: 'High Critical Event Count',
          message: `${criticalEvents} critical security events detected in the last 24 hours`,
          actionRequired: true
        });
      }

      if (lockouts && lockouts.length > 0) {
        newAlerts.push({
          id: 'account-lockouts',
          type: 'warning',
          title: 'Account Lockouts Active',
          message: `${lockouts.length} accounts are currently locked due to failed login attempts`,
          actionRequired: false
        });
      }

      if (headersValidation.score < 75) {
        newAlerts.push({
          id: 'security-headers',
          type: 'warning',
          title: 'Security Headers Incomplete',
          message: `Security headers score: ${headersValidation.score}/100. Missing: ${headersValidation.missing.join(', ')}`,
          actionRequired: true
        });
      }

      if (sessions && sessions.length > 100) {
        newAlerts.push({
          id: 'high-session-count',
          type: 'info',
          title: 'High Session Count',
          message: `${sessions.length} active sessions detected. Consider implementing session cleanup`,
          actionRequired: false
        });
      }

      setAlerts(newAlerts);
      setLastRefresh(new Date());
    } catch (error) {
      productionLogger.error('Failed to load security metrics', error, 'EnhancedSecurityDashboard');
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeNotification = async (notificationId: string) => {
    try {
      await supabase
        .from('security_notifications')
        .update({ acknowledged: true })
        .eq('id', notificationId);
      
      await loadSecurityMetrics();
    } catch (error) {
      productionLogger.error('Failed to acknowledge notification', error, 'EnhancedSecurityDashboard');
    }
  };

  const cleanupSessions = async () => {
    try {
      await enhancedAuthenticationSecurity.cleanupExpiredSessions();
      await loadSecurityMetrics();
    } catch (error) {
      productionLogger.error('Failed to cleanup sessions', error, 'EnhancedSecurityDashboard');
    }
  };

  useEffect(() => {
    loadSecurityMetrics();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadSecurityMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'default';
      default: return 'default';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Security Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive security monitoring and threat detection
          </p>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={cleanupSessions} 
            variant="outline"
            disabled={loading}
          >
            <Lock className="h-4 w-4 mr-2" />
            Cleanup Sessions
          </Button>
          <Button onClick={loadSecurityMetrics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Security Alerts</h3>
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{alert.title}</strong>
                    <p className="mt-1">{alert.message}</p>
                  </div>
                  {alert.actionRequired && (
                    <Badge variant="destructive" className="ml-2">
                      Action Required
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.criticalEvents} critical events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessionCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently active user sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Lockouts</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics.lockedAccounts}
            </div>
            <p className="text-xs text-muted-foreground">
              Accounts currently locked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Headers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              metrics.headersScore >= 75 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {metrics.headersScore}%
            </div>
            <p className="text-xs text-muted-foreground">
              Security headers score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Notifications</CardTitle>
          <CardDescription>
            Unacknowledged security events requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics.recentNotifications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="text-muted-foreground">No pending security notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getSeverityBadgeVariant(notification.severity)}>
                        {notification.severity}
                      </Badge>
                      <span className="text-sm font-medium">{notification.event_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeNotification(notification.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Limiting Status */}
      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting Status</CardTitle>
          <CardDescription>
            Current rate limiting blocks and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Active Blocks: {metrics.rateLimitEvents}</span>
            </div>
            <Badge variant={metrics.rateLimitEvents > 0 ? "destructive" : "secondary"}>
              {metrics.rateLimitEvents > 0 ? "Blocking Active" : "Normal Operation"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
