
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { SECURITY_GUIDELINES, SecurityValidator, INCIDENT_RESPONSE_PLAN } from '@/utils/securityGuidelines';
import { secureRateLimitService } from '@/services/secureRateLimitService';
import { productionLogger } from '@/utils/productionLogger';

export function SecurityMonitor() {
  const [securityStatus, setSecurityStatus] = useState(SecurityValidator.checkImplementationStatus());
  const [rateLimitStats, setRateLimitStats] = useState<{ totalBlocked: number; activeBlocks: number } | null>(null);
  const [isAdmin] = useState(false); // This would be determined by user role in real implementation

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        // Only load admin data if user is admin
        if (isAdmin) {
          const stats = await secureRateLimitService.getRateLimitStats('admin-user-id');
          setRateLimitStats(stats);
        }
      } catch (error) {
        productionLogger.error('Failed to load security data', error, 'SecurityMonitor');
      }
    };

    loadSecurityData();
  }, [isAdmin]);

  const getSecurityScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreBadge = (percentage: number) => {
    if (percentage >= 90) return 'default';
    if (percentage >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Security Score Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSecurityScoreColor(securityStatus.percentage)}`}>
              {securityStatus.percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              {securityStatus.implemented}/{securityStatus.total} guidelines implemented
            </p>
          </CardContent>
        </Card>

        {/* Critical Issues Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityStatus.criticalIssues.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Unresolved critical security issues
            </p>
          </CardContent>
        </Card>

        {/* Rate Limiting Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limiting</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rateLimitStats?.activeBlocks ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active blocks ({rateLimitStats?.totalBlocked ?? 0} total)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Security Guidelines</CardTitle>
          <CardDescription>
            Current implementation status of security best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {SECURITY_GUIDELINES.map((guideline, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{guideline.title}</h4>
                    <Badge variant={getSecurityScoreBadge(guideline.implemented ? 100 : 0)}>
                      {guideline.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{guideline.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">Category: {guideline.category}</p>
                </div>
                <div className="ml-4">
                  {guideline.implemented ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Incident Response Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Incident Response Plan</CardTitle>
          <CardDescription>
            Steps to follow in case of a security incident
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {INCIDENT_RESPONSE_PLAN.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <p className="text-sm">{step.replace(/^\d+\.\s*/, '')}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Emergency Contacts</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Security Team:</span>
                <br />
                <span className="text-muted-foreground">{INCIDENT_RESPONSE_PLAN.contacts.security_team}</span>
              </div>
              <div>
                <span className="font-medium">Incident Commander:</span>
                <br />
                <span className="text-muted-foreground">{INCIDENT_RESPONSE_PLAN.contacts.incident_commander}</span>
              </div>
              <div>
                <span className="font-medium">Legal:</span>
                <br />
                <span className="text-muted-foreground">{INCIDENT_RESPONSE_PLAN.contacts.legal}</span>
              </div>
            </div>
          </div>
        </Car content>
      </Card>
    </div>
  );
}
