
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Eye, Download } from 'lucide-react';
import { enhancedProductionLogger } from '@/utils/enhancedProductionLogger';
import { comprehensiveSecurityInit } from '@/utils/comprehensiveSecurityInit';
import { enhancedSecurityConfig } from '@/services/security/enhancedSecurityConfig';

interface SecurityHealthResult {
  score: number;
  issues: Array<{ severity: 'low' | 'medium' | 'high' | 'critical'; message: string }>;
  recommendations: string[];
}

export function SecurityMonitoringDashboard() {
  const [healthResult, setHealthResult] = useState<SecurityHealthResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const result = await comprehensiveSecurityInit.runSecurityHealthCheck();
      setHealthResult(result);
      
      // Get recent logs
      const recentLogs = enhancedProductionLogger.getLogs().slice(-20);
      setLogs(recentLogs);
    } catch (error) {
      enhancedProductionLogger.error('Failed to run security health check', error, 'SecurityDashboard');
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    const logsData = enhancedProductionLogger.exportSecureLogs();
    const blob = new Blob([logsData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Security Monitoring Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor security health and events</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runHealthCheck} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportLogs} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Score */}
      {healthResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Security Health Score
              <span className={`text-3xl font-bold ${getScoreColor(healthResult.score)}`}>
                {healthResult.score}/100
              </span>
            </CardTitle>
            <CardDescription>
              Overall security posture of the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  healthResult.score >= 90 ? 'bg-green-500' : 
                  healthResult.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${healthResult.score}%` }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Issues */}
      {healthResult && healthResult.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Security Issues ({healthResult.issues.length})
            </CardTitle>
            <CardDescription>
              Issues that need attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthResult.issues.map((issue, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <span>{issue.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {healthResult && healthResult.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recommendations ({healthResult.recommendations.length})
            </CardTitle>
            <CardDescription>
              Suggested improvements for better security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {healthResult.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Security Events ({logs.length})
          </CardTitle>
          <CardDescription>
            Latest security-related log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No security events recorded
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{log.level.toUpperCase()}</Badge>
                    <span className="font-medium">{log.context}</span>
                    <span className="text-muted-foreground">{log.message}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Security Configuration</CardTitle>
          <CardDescription>
            Current security settings and policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Input Validation</h4>
              <div className="text-sm space-y-1">
                <div>Email max length: 254 chars</div>
                <div>Password max length: 128 chars</div>
                <div>General input max: 1000 chars</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Rate Limiting</h4>
              <div className="text-sm space-y-1">
                <div>Auth: 3 attempts/5min</div>
                <div>API: 60 requests/min</div>
                <div>Forms: 15 requests/min</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Security Headers</h4>
              <div className="text-sm space-y-1">
                <div>CSP: Enabled with nonce</div>
                <div>HSTS: Max-age 1 year</div>
                <div>X-Frame-Options: DENY</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Environment</h4>
              <div className="text-sm space-y-1">
                <div>Mode: {import.meta.env.MODE}</div>
                <div>HTTPS: {window.location.protocol === 'https:' ? 'Enabled' : 'Disabled'}</div>
                <div>Console cleanup: {import.meta.env.PROD ? 'Active' : 'Inactive'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
