
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle, Activity, Lock, Eye, Settings } from 'lucide-react';
import { enhancedSecurityHeaders } from '@/services/security/enhancedSecurityHeaders';

export function SecurityEnhancementsDashboard() {
  const [securityStatus, setSecurityStatus] = useState<Record<string, boolean>>({});
  const [threatStats, setThreatStats] = useState<any>({});
  const [sessionMetrics, setSessionMetrics] = useState<any>({});

  useEffect(() => {
    loadSecurityStatus();
    const interval = setInterval(loadSecurityStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityStatus = async () => {
    try {
      // Load security headers status
      const headersStatus = enhancedSecurityHeaders.getSecurityHeadersStatus();
      setSecurityStatus(headersStatus);

      // Load threat detection stats
      const { enhancedThreatDetection } = await import('@/services/security/threatDetectionEnhanced');
      const stats = enhancedThreatDetection.getThreatStatistics();
      setThreatStats(stats);

      // Load session metrics
      const { secureSessionManager } = await import('@/services/security/secureSessionManager');
      const metrics = secureSessionManager.getSessionMetrics();
      setSessionMetrics(metrics);
    } catch (error) {
      console.error('Failed to load security status:', error);
    }
  };

  const applySecurityHeaders = () => {
    enhancedSecurityHeaders.applyStrictSecurityHeaders();
    loadSecurityStatus();
  };

  const getSecurityScore = (): number => {
    const totalChecks = Object.keys(securityStatus).length;
    const passedChecks = Object.values(securityStatus).filter(Boolean).length;
    return totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number): { variant: any; text: string } => {
    if (score >= 90) return { variant: 'default', text: 'Excellent' };
    if (score >= 70) return { variant: 'secondary', text: 'Good' };
    if (score >= 50) return { variant: 'outline', text: 'Fair' };
    return { variant: 'destructive', text: 'Poor' };
  };

  const securityScore = getSecurityScore();
  const scoreBadge = getScoreBadge(securityScore);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Enhancements</h2>
          <p className="text-muted-foreground">
            Advanced security monitoring and protection systems
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(securityScore)}`}>
              {securityScore}%
            </div>
            <Badge variant={scoreBadge.variant}>{scoreBadge.text}</Badge>
          </div>
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Headers</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(securityStatus).filter(Boolean).length}/{Object.keys(securityStatus).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Security headers active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Detection</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{threatStats.blockedIPs || 0}</div>
            <p className="text-xs text-muted-foreground">
              IPs currently blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionMetrics.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Secure sessions active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionMetrics.averageSecurityScore?.toFixed(0) || 0}</div>
            <p className="text-xs text-muted-foreground">
              Average session score
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="headers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="headers">Security Headers</TabsTrigger>
          <TabsTrigger value="threats">Threat Detection</TabsTrigger>
          <TabsTrigger value="sessions">Session Security</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="headers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Headers Status</CardTitle>
              <CardDescription>
                Current status of security headers and browser protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(securityStatus).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {status ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                  <Badge variant={status ? 'default' : 'destructive'}>
                    {status ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
              
              <Button onClick={applySecurityHeaders} className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                Apply Security Headers
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection Statistics</CardTitle>
              <CardDescription>
                Real-time threat detection and IP blocking status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Total Threats Detected</div>
                  <div className="text-2xl font-bold">{threatStats.totalThreats || 0}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Blocked IP Addresses</div>
                  <div className="text-2xl font-bold text-red-600">{threatStats.blockedIPs || 0}</div>
                </div>
              </div>
              
              {threatStats.averageThreatScore > 20 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    High threat activity detected. Monitor system closely and consider additional security measures.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Security Metrics</CardTitle>
              <CardDescription>
                Secure session management and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Active Sessions</div>
                  <div className="text-2xl font-bold text-green-600">{sessionMetrics.activeSessions || 0}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Expired Sessions</div>
                  <div className="text-2xl font-bold text-gray-600">{sessionMetrics.expiredSessions || 0}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Suspicious Sessions</div>
                  <div className="text-2xl font-bold text-orange-600">{sessionMetrics.suspiciousSessions || 0}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Average Security Score</div>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">
                    {sessionMetrics.averageSecurityScore?.toFixed(1) || '0.0'}
                  </div>
                  <Badge variant={sessionMetrics.averageSecurityScore >= 70 ? 'default' : 'secondary'}>
                    {sessionMetrics.averageSecurityScore >= 70 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Actions</CardTitle>
              <CardDescription>
                Quick actions to enhance security posture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={applySecurityHeaders} className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Apply All Security Headers
              </Button>
              
              <Button 
                variant="outline" 
                onClick={loadSecurityStatus} 
                className="w-full"
              >
                <Activity className="mr-2 h-4 w-4" />
                Refresh Security Status
              </Button>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Enable "Leaked Password Protection" in your Supabase Dashboard → Authentication → Settings for enhanced security.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
