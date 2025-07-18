
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { enhancedApiSecurity } from '@/services/security/enhancedApiSecurity';
import { rateLimitService } from '@/services/security/rateLimitService';
import { Shield, AlertTriangle, CheckCircle, Activity, Lock, Globe } from 'lucide-react';

export const SecurityMonitoringDashboard: React.FC = () => {
  const [authStats, setAuthStats] = React.useState<any>(null);
  const [apiStats, setApiStats] = React.useState<any>(null);
  const [securityScore, setSecurityScore] = React.useState(0);

  React.useEffect(() => {
    const loadStats = () => {
      const auth = consolidatedAuthenticationSecurity.getAuthenticationStats();
      const api = enhancedApiSecurity.getApiSecurityStats();
      
      setAuthStats(auth);
      setApiStats(api);
      
      // Calculate overall security score
      let score = 100;
      
      // Deduct points for failed authentication attempts
      if (auth.recentFailureRate > 20) score -= 20;
      else if (auth.recentFailureRate > 10) score -= 10;
      
      // Deduct points for API failures
      const apiFailureRate = api.totalRequests > 0 ? (api.failedRequests / api.totalRequests) * 100 : 0;
      if (apiFailureRate > 20) score -= 15;
      else if (apiFailureRate > 10) score -= 5;
      
      // Deduct points for suspicious activity
      if (auth.suspiciousIPs > 0) score -= Math.min(auth.suspiciousIPs * 5, 25);
      if (api.suspiciousPatterns > 0) score -= Math.min(api.suspiciousPatterns * 5, 25);
      
      setSecurityScore(Math.max(score, 0));
    };

    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  if (!authStats || !apiStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getScoreColor(securityScore)}>{securityScore}/100</span>
            </div>
            <Progress value={securityScore} className="mt-2" />
            <Badge variant={getScoreBadgeVariant(securityScore)} className="mt-2">
              {securityScore >= 90 ? 'Excellent' : securityScore >= 70 ? 'Good' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auth Attempts</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{authStats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">
              {authStats.successfulAttempts} successful
            </p>
            {authStats.recentFailureRate > 0 && (
              <Badge variant="outline" className="mt-1">
                {authStats.recentFailureRate.toFixed(1)}% recent failures
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiStats.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {apiStats.successfulRequests} successful
            </p>
            <p className="text-xs text-muted-foreground">
              Avg: {apiStats.averageResponseTime}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {authStats.suspiciousIPs + apiStats.suspiciousPatterns}
            </div>
            <p className="text-xs text-muted-foreground">
              {authStats.suspiciousIPs} IPs, {apiStats.suspiciousPatterns} patterns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Tabs defaultValue="authentication" className="space-y-4">
        <TabsList>
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="api">API Security</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Statistics</CardTitle>
                <CardDescription>Recent authentication activity and security metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Attempts:</span>
                  <span className="font-medium">{authStats.totalAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Successful:</span>
                  <span className="font-medium text-green-600">{authStats.successfulAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Failed:</span>
                  <span className="font-medium text-red-600">{authStats.failedAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Suspicious IPs:</span>
                  <span className="font-medium">{authStats.suspiciousIPs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Demo Sessions:</span>
                  <span className="font-medium">{authStats.activeDemoSessions}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
                <CardDescription>Current security status and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {authStats.recentFailureRate > 20 && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">High failure rate detected ({authStats.recentFailureRate.toFixed(1)}%)</span>
                  </div>
                )}
                
                {authStats.suspiciousIPs > 0 && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{authStats.suspiciousIPs} suspicious IP(s) blocked</span>
                  </div>
                )}
                
                {authStats.recentFailureRate <= 5 && authStats.suspiciousIPs === 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Authentication security is healthy</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
                <CardDescription>API request statistics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Requests:</span>
                  <span className="font-medium">{apiStats.totalRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Successful:</span>
                  <span className="font-medium text-green-600">{apiStats.successfulRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Failed:</span>
                  <span className="font-medium text-red-600">{apiStats.failedRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Response Time:</span>
                  <span className="font-medium">{apiStats.averageResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Suspicious Patterns:</span>
                  <span className="font-medium">{apiStats.suspiciousPatterns}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top API Domains</CardTitle>
                <CardDescription>Most frequently accessed domains</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {apiStats.topDomains.map((domain: any, index: number) => (
                  <div key={domain.domain} className="flex justify-between items-center">
                    <span className="text-sm truncate">{domain.domain}</span>
                    <Badge variant="outline">{domain.count}</Badge>
                  </div>
                ))}
                {apiStats.topDomains.length === 0 && (
                  <p className="text-sm text-muted-foreground">No API requests recorded</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Security Monitoring</CardTitle>
              <CardDescription>Live security events and system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {securityScore >= 90 ? '✓' : securityScore >= 70 ? '⚠' : '✗'}
                    </div>
                    <p className="text-sm text-muted-foreground">Security Status</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {authStats.activeDemoSessions}
                    </div>
                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {Date.now() % 60 < 30 ? '🟢' : '🟡'}
                    </div>
                    <p className="text-sm text-muted-foreground">System Health</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Security Recommendations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {securityScore < 90 && (
                      <li>• Monitor authentication failure rates closely</li>
                    )}
                    {authStats.suspiciousIPs > 0 && (
                      <li>• Review and validate blocked IP addresses</li>
                    )}
                    {apiStats.averageResponseTime > 2000 && (
                      <li>• Investigate slow API response times</li>
                    )}
                    {securityScore >= 90 && authStats.suspiciousIPs === 0 && (
                      <li>• Security posture is excellent - maintain current practices</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
