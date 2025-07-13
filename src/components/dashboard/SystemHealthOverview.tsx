
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Server, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';

interface DashboardMetrics {
  totalQueries: number;
  optimizedQueries: number;
  avgImprovement: number;
  monthlySavings: number;
  activeConnections: number;
  uptime: number;
  securityScore: number;
  responseTime: number;
  criticalIssues: number;
  pendingOptimizations: number;
}

interface SystemHealthOverviewProps {
  metrics?: DashboardMetrics;
}

export function SystemHealthOverview({ metrics }: SystemHealthOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-900">
                {metrics?.securityScore?.toFixed(1) || 0}%
              </div>
              <p className="text-sm text-green-700">Security Score</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Uptime</span>
              <span className="font-semibold text-blue-900">
                {metrics?.uptime?.toFixed(2) || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Response Time</span>
              <span className="font-semibold text-blue-900">
                {metrics?.responseTime || 0}ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Connections</span>
              <span className="font-semibold text-blue-900">
                {metrics?.activeConnections || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-orange-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-700">Critical Issues</span>
              <Badge variant={metrics?.criticalIssues === 0 ? "secondary" : "destructive"}>
                {metrics?.criticalIssues || 0}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-700">Pending Tasks</span>
              <Badge variant="secondary">
                {metrics?.pendingOptimizations || 0}
              </Badge>
            </div>
            <Button size="sm" className="w-full mt-3">
              <ChevronRight className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
