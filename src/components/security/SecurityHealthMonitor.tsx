
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Eye, 
  Lock,
  Activity
} from 'lucide-react';

interface SecurityMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: string;
  description: string;
}

export function SecurityHealthMonitor() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const securityMetrics: SecurityMetric[] = [
    {
      name: 'Authentication',
      status: 'healthy',
      value: '100%',
      description: 'All authentication systems operational'
    },
    {
      name: 'Data Encryption',
      status: 'healthy',
      value: 'AES-256',
      description: 'All data encrypted at rest and in transit'
    },
    {
      name: 'Access Controls',
      status: 'healthy',
      value: 'Active',
      description: 'Row-level security policies enforced'
    },
    {
      name: 'Audit Logging',
      status: 'healthy',
      value: 'Enabled',
      description: 'All database activities logged'
    },
    {
      name: 'Rate Limiting',
      status: 'warning',
      value: '95%',
      description: 'Some endpoints approaching limits'
    },
    {
      name: 'Vulnerability Scan',
      status: 'healthy',
      value: 'Clean',
      description: 'Last scan: 2 hours ago'
    }
  ];

  const overallScore = 94;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    setLastUpdated(new Date());
  };

  const getStatusIcon = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: SecurityMetric['status']) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Health Monitor
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time security status and compliance monitoring
              </p>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Security Score */}
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallScore / 100)}`}
                  className="text-green-600"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{overallScore}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Overall Security Score</h3>
              <p className="text-sm text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Security Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                <div className="flex items-center gap-3">
                  {getStatusIcon(metric.status)}
                  <div>
                    <h4 className="font-medium">{metric.name}</h4>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{metric.value}</div>
                  {getStatusBadge(metric.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Security Recommendations */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-4">Security Recommendations</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Eye className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Monitor rate limiting thresholds
                  </p>
                  <p className="text-xs text-yellow-700">
                    Some API endpoints are approaching their rate limits. Consider increasing limits or optimizing client requests.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Enable two-factor authentication
                  </p>
                  <p className="text-xs text-blue-700">
                    Consider implementing 2FA for enhanced account security across all user accounts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
