
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Eye, Lock, Activity } from 'lucide-react';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { useSecurityEvents } from '@/hooks/useSecurityEvents';

export function EnhancedSecurityMonitor() {
  const { validateSession } = useConsolidatedSecurity();
  const { events, stats, refreshEvents } = useSecurityEvents();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({
    level: 'secure',
    score: 85,
    issues: [] as string[]
  });

  const checkEnvironmentSecurity = async () => {
    // Basic security checks
    const issues: string[] = [];
    let score = 100;

    if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
      issues.push('Not using HTTPS in production');
      score -= 15;
    }

    if (typeof Storage === 'undefined') {
      issues.push('Storage not available');
      score -= 10;
    }

    setSecurityStatus({
      level: score >= 85 ? 'secure' : score >= 70 ? 'warning' : 'danger',
      score,
      issues
    });
  };

  useEffect(() => {
    checkEnvironmentSecurity();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      checkEnvironmentSecurity(),
      refreshEvents()
    ]);
    setIsRefreshing(false);
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'secure': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (level: string) => {
    switch (level) {
      case 'secure': return 'default';
      case 'warning': return 'secondary';
      case 'danger': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Security Monitor</h2>
          <p className="text-muted-foreground">Real-time security status and threat detection</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(securityStatus.level)}`}>
              {securityStatus.level.toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground">
              Score: {securityStatus.score}/100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityStatus.issues.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active security concerns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Events</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.securityViolations}
            </div>
            <p className="text-xs text-muted-foreground">
              Security violations detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.rateLimitHits}
            </div>
            <p className="text-xs text-muted-foreground">
              Rate limit violations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Issues */}
      {securityStatus.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Security Issues</CardTitle>
            <CardDescription>
              Current security concerns that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityStatus.issues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{issue}</span>
                  </div>
                  <Badge variant="secondary">Warning</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security events and system activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-2">
              {events.slice(0, 10).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{event.event_type}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant={
                    event.event_type.includes('violation') || event.event_type.includes('suspicious') 
                      ? 'destructive' 
                      : event.event_type.includes('blocked')
                      ? 'secondary'
                      : 'default'
                  }>
                    {event.event_type.includes('violation') ? 'Violation' : 
                     event.event_type.includes('blocked') ? 'Blocked' : 'Info'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <p className="text-muted-foreground">No recent security events</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Proactive measures to enhance security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Enhanced Input Validation</div>
                <div className="text-sm text-muted-foreground">
                  Advanced threat detection for SQL injection, XSS, and command injection
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Production Security Hardening</div>
                <div className="text-sm text-muted-foreground">
                  Enhanced security headers and environment protection
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Real-time Threat Monitoring</div>
                <div className="text-sm text-muted-foreground">
                  Continuous monitoring for suspicious activities and patterns
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
