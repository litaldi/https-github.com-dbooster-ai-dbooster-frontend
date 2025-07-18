
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Users, Activity, Eye, Clock } from 'lucide-react';
import { securityMonitoringService, type SecurityAlert } from '@/services/security/securityMonitoringService';
import { useAuth } from '@/contexts/auth-context';
import { productionLogger } from '@/utils/productionLogger';

export function SecurityDashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [metrics, setMetrics] = useState({
    totalEscalationAttempts: 0,
    recentEscalationAttempts: 0,
    securityScore: 100,
    criticalAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      const [alertsData, metricsData] = await Promise.all([
        securityMonitoringService.getSecurityAlerts(20),
        securityMonitoringService.getSecurityMetrics()
      ]);

      setAlerts(alertsData);
      setMetrics(metricsData);
    } catch (error) {
      productionLogger.error('Failed to load security dashboard data', error, 'SecurityDashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadSecurityData();
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(metrics.securityScore)}`}>
                  {metrics.securityScore}/100
                </p>
              </div>
              <Shield className={`h-8 w-8 ${getScoreColor(metrics.securityScore)}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Attempts</p>
                <p className="text-2xl font-bold">{metrics.recentEscalationAttempts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold">{metrics.totalEscalationAttempts}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalAlerts}</p>
              </div>
              <Activity className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Recent security events and potential threats
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Alerts</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="privilege">Privilege Escalation</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No security alerts found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        {alert.user_id && (
                          <p className="text-sm text-muted-foreground mt-1">
                            User ID: {alert.user_id}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="critical">
              <div className="space-y-3">
                {alerts
                  .filter(alert => alert.severity === 'critical')
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between p-4 border rounded-lg border-red-200 bg-red-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">CRITICAL</Badge>
                          <Badge variant="outline">{alert.type}</Badge>
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        {alert.user_id && (
                          <p className="text-sm text-muted-foreground mt-1">
                            User ID: {alert.user_id}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="privilege">
              <div className="space-y-3">
                {alerts
                  .filter(alert => alert.type === 'privilege_escalation')
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between p-4 border rounded-lg border-orange-200 bg-orange-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive">PRIVILEGE ESCALATION</Badge>
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        {alert.metadata?.attempted_role && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Attempted Role: {alert.metadata.attempted_role}
                          </p>
                        )}
                        {alert.metadata?.ip_address && (
                          <p className="text-sm text-muted-foreground">
                            IP Address: {alert.metadata.ip_address}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
