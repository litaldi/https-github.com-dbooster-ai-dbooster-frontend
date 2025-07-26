import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { useMFA } from '@/hooks/useMFA';

export function SecurityDashboard() {
  const { 
    securityMetrics, 
    securityAlerts, 
    isLoading, 
    refreshSecurityData,
    invalidateAllSessions 
  } = useEnhancedSecurity();
  
  const { mfaConfig, enableMFA, disableMFA } = useMFA();

  const handleRefreshSecurity = async () => {
    await refreshSecurityData();
  };

  const handleInvalidateAllSessions = async () => {
    try {
      await invalidateAllSessions('current-user-id'); // In real app, get from auth
      await refreshSecurityData();
    } catch (error) {
      console.error('Failed to invalidate sessions:', error);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading security metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Security Dashboard</h1>
        <Button onClick={handleRefreshSecurity} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`text-4xl font-bold ${getSecurityScoreColor(securityMetrics?.overallSecurityScore || 0)}`}>
              {securityMetrics?.overallSecurityScore || 0}%
            </div>
            <Badge variant={getSecurityScoreBadge(securityMetrics?.overallSecurityScore || 0)}>
              {securityMetrics?.overallSecurityScore >= 80 ? 'Excellent' : 
               securityMetrics?.overallSecurityScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Overall security posture based on current threats and configurations
          </p>
        </CardContent>
      </Card>

      {/* Security Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Events</p>
                <p className="text-2xl font-bold">{securityMetrics?.totalSecurityEvents || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{securityMetrics?.criticalAlerts || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{securityMetrics?.activeSessions || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">MFA Users</p>
                <p className="text-2xl font-bold">{securityMetrics?.mfaEnabledUsers || 0}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MFA Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Status: {mfaConfig?.isMfaEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-muted-foreground">
                {mfaConfig?.isMfaEnabled 
                  ? 'Your account is protected with multi-factor authentication'
                  : 'Enable MFA to add an extra layer of security'
                }
              </p>
            </div>
            <Button
              variant={mfaConfig?.isMfaEnabled ? 'destructive' : 'default'}
              onClick={mfaConfig?.isMfaEnabled ? disableMFA : enableMFA}
            >
              {mfaConfig?.isMfaEnabled ? 'Disable MFA' : 'Enable MFA'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {securityAlerts && securityAlerts.length > 0 ? (
            <div className="space-y-3">
              {securityAlerts.slice(0, 5).map((alert) => (
                <Alert key={alert.id} variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent security alerts</p>
          )}
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              onClick={handleInvalidateAllSessions}
              className="w-full justify-start"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Invalidate All Sessions
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefreshSecurity}
              className="w-full justify-start"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Security Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}