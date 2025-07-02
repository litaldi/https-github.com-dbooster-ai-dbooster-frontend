
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface SecurityCheck {
  name: string;
  status: 'passed' | 'warning' | 'failed';
  description: string;
  score: number;
}

export function SecurityHealthMonitor() {
  const { validateSession } = useConsolidatedSecurity();
  const { user, session } = useAuth();
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [overallScore, setOverallScore] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const runSecurityChecks = async () => {
      setIsChecking(true);
      const checks: SecurityCheck[] = [];

      // Check 1: Session Validity
      try {
        const sessionValid = await validateSession();
        checks.push({
          name: 'Session Security',
          status: sessionValid ? 'passed' : 'failed',
          description: sessionValid ? 'Session is valid and secure' : 'Session validation failed',
          score: sessionValid ? 25 : 0
        });
      } catch {
        checks.push({
          name: 'Session Security',
          status: 'failed',
          description: 'Unable to validate session',
          score: 0
        });
      }

      // Check 2: Authentication Status
      checks.push({
        name: 'Authentication',
        status: user && session ? 'passed' : 'failed',
        description: user && session ? 'User is properly authenticated' : 'User authentication required',
        score: user && session ? 25 : 0
      });

      // Check 3: HTTPS Check
      const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
      checks.push({
        name: 'Secure Connection',
        status: isHTTPS ? 'passed' : 'warning',
        description: isHTTPS ? 'Connection is secure' : 'Consider using HTTPS in production',
        score: isHTTPS ? 20 : 10
      });

      // Check 4: Local Storage Security
      const hasSecureStorage = typeof Storage !== 'undefined';
      checks.push({
        name: 'Secure Storage',
        status: hasSecureStorage ? 'passed' : 'warning',
        description: hasSecureStorage ? 'Secure storage available' : 'Limited storage capabilities',
        score: hasSecureStorage ? 15 : 5
      });

      // Check 5: Browser Security Features
      const hasSecurityFeatures = 'crypto' in window && 'ServiceWorker' in window;
      checks.push({
        name: 'Browser Security',
        status: hasSecurityFeatures ? 'passed' : 'warning',
        description: hasSecurityFeatures ? 'Modern security features available' : 'Limited browser security features',
        score: hasSecurityFeatures ? 15 : 8
      });

      setSecurityChecks(checks);
      const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
      setOverallScore(totalScore);
      setIsChecking(false);
    };

    runSecurityChecks();
  }, [validateSession, user, session]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const getStatusIcon = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: SecurityCheck['status']) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Passed</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                <span className={getScoreColor(overallScore)}>{overallScore}/100</span>
              </span>
              <Badge variant="outline" className={getScoreColor(overallScore)}>
                {getScoreStatus(overallScore)}
              </Badge>
            </div>
            <Progress value={overallScore} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Security score based on current authentication and browser security features
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Security Checks
            {isChecking && <Badge variant="secondary">Checking...</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityChecks.map((check, index) => (
              <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <h4 className="font-medium">{check.name}</h4>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{check.score}pts</span>
                  {getStatusBadge(check.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {overallScore < 70 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your security score is below recommended levels. Consider addressing the failed or warning items above to improve security.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
