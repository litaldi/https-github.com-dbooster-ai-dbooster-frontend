import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

export function SecurityDashboard() {
  const { securityStatus, isLoading, refreshSecurityStatus, createSecureSession } = useSecurityMonitoring();

  const getSecurityBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
  };

  const getSecurityBadgeText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading security status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
        </div>
        <Button onClick={refreshSecurityStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus.securityScore}/100</div>
            <Badge variant={getSecurityBadgeVariant(securityStatus.securityScore)} className="mt-2">
              {getSecurityBadgeText(securityStatus.securityScore)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Status</CardTitle>
            {securityStatus.sessionValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityStatus.sessionValid ? 'Valid' : 'Invalid'}
            </div>
            {!securityStatus.sessionValid && (
              <Button 
                onClick={createSecureSession} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Create New Session
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityStatus.alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent alerts (7 days)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Issues */}
      {securityStatus.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Security Issues
            </CardTitle>
            <CardDescription>
              Issues that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityStatus.issues.map((issue, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Security Issue</AlertTitle>
                  <AlertDescription>{issue}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {securityStatus.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
              Security Recommendations
            </CardTitle>
            <CardDescription>
              Suggestions to improve your security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityStatus.recommendations.map((recommendation, index) => (
                <Alert key={index}>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Recommendation</AlertTitle>
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Alerts */}
      {securityStatus.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Alerts</CardTitle>
            <CardDescription>
              Security events from the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityStatus.alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex justify-between items-start p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {securityStatus.isSecure ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
            )}
            Overall Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg">
            {securityStatus.isSecure ? (
              <span className="text-green-600">Your account security is good</span>
            ) : (
              <span className="text-red-600">Security issues require attention</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {securityStatus.isSecure 
              ? "Continue following security best practices to maintain protection."
              : "Please review and address the security issues listed above."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
