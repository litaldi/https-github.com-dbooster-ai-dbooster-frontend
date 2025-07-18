
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { AlertTriangle, Shield, Activity, Clock, Play, Square, RefreshCw, TrendingUp } from 'lucide-react';

export function SecurityMonitoringDashboard() {
  const {
    isMonitoring,
    lastAuditReport,
    performanceMetrics,
    patternUpdateHistory,
    alerts,
    loading,
    startMonitoring,
    stopMonitoring,
    refreshMonitoringData,
    performManualAudit,
    checkForPatternUpdates
  } = useSecurityMonitoring();

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
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
          <h2 className="text-2xl font-bold">Security Monitoring Center</h2>
          <p className="text-muted-foreground">
            Continuous monitoring and automated threat detection
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            disabled={loading}
            variant={isMonitoring ? "destructive" : "default"}
          >
            {isMonitoring ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          <Button onClick={refreshMonitoringData} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Monitoring Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Monitoring Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={isMonitoring ? "default" : "secondary"}>
              {isMonitoring ? 'Active' : 'Inactive'}
            </Badge>
            {isMonitoring && (
              <span className="text-sm text-muted-foreground">
                Continuous monitoring active • Auto-audits every 15 minutes
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Latest Audit Report */}
      {lastAuditReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Latest Security Audit
            </CardTitle>
            <CardDescription>
              {new Date(lastAuditReport.timestamp).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{lastAuditReport.totalEvents}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{lastAuditReport.suspiciousPatterns?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Patterns Detected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{lastAuditReport.threatTrends?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Threat Trends</div>
              </div>
              <div className="text-center">
                <Badge variant={getRiskBadgeVariant(lastAuditReport.riskLevel)}>
                  {lastAuditReport.riskLevel?.toUpperCase()}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">Risk Level</div>
              </div>
            </div>

            {lastAuditReport.recommendations && lastAuditReport.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {lastAuditReport.recommendations.slice(0, 3).map((rec: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={performManualAudit} disabled={loading} variant="outline" size="sm">
              Run Manual Audit
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {Math.round(performanceMetrics.averageResponseTime)}ms
                </div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{performanceMetrics.requestsPerMinute}</div>
                <div className="text-sm text-muted-foreground">Requests/min</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {Math.round((performanceMetrics.memoryUsage || 0) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Memory Usage</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{performanceMetrics.errorRate || 0}%</div>
                <div className="text-sm text-muted-foreground">Error Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Security Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{alert.pattern}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.occurrences} occurrences • Last seen: {new Date(alert.lastSeen).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threat Pattern Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Threat Pattern Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patternUpdateHistory.slice(0, 3).map((update: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Version {update.version}</div>
                  <div className="text-sm text-muted-foreground">{update.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{update.patternsAdded} patterns</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(update.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={checkForPatternUpdates}
            disabled={loading}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Check for Updates
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
