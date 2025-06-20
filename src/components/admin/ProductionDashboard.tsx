
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Shield, 
  Zap, 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Users,
  Database,
  Globe
} from 'lucide-react';
import { productionInitializer } from '@/utils/productionInit';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { accessibilityChecker } from '@/utils/accessibilityChecker';

export function ProductionDashboard() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [accessibilityReport, setAccessibilityReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const health = await productionInitializer.runHealthChecks();
      const metrics = performanceMonitor.getMetrics();
      const a11yReport = await accessibilityChecker.runAccessibilityAudit();
      
      setHealthStatus(health);
      setPerformanceMetrics(metrics);
      setAccessibilityReport(a11yReport);
    } catch (error) {
      console.error('Failed to run health checks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"}>
        {status ? "Healthy" : "Issues"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Production Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor application health, performance, and security
          </p>
        </div>
        <Button onClick={runHealthCheck} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthStatus && getStatusIcon(healthStatus.security)}
              {healthStatus && getStatusBadge(healthStatus.security)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthStatus && getStatusIcon(healthStatus.performance)}
              {healthStatus && getStatusBadge(healthStatus.performance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accessibility</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {accessibilityReport && getStatusIcon(accessibilityReport.score > 80)}
              <Badge variant={accessibilityReport?.score > 80 ? "default" : "secondary"}>
                {accessibilityReport?.score || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO</CardTitle>
            <Globe className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {healthStatus && getStatusIcon(healthStatus.seo)}
              {healthStatus && getStatusBadge(healthStatus.seo)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">First Contentful Paint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics?.fcp ? `${Math.round(performanceMetrics.fcp)}ms` : 'N/A'}
                </div>
                <Badge variant={performanceMetrics?.fcp < 1800 ? "default" : "secondary"}>
                  {performanceMetrics?.fcp < 1800 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Largest Contentful Paint</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics?.lcp ? `${Math.round(performanceMetrics.lcp)}ms` : 'N/A'}
                </div>
                <Badge variant={performanceMetrics?.lcp < 2500 ? "default" : "secondary"}>
                  {performanceMetrics?.lcp < 2500 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Cumulative Layout Shift</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics?.cls ? performanceMetrics.cls.toFixed(3) : 'N/A'}
                </div>
                <Badge variant={performanceMetrics?.cls < 0.1 ? "default" : "secondary"}>
                  {performanceMetrics?.cls < 0.1 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Time to First Byte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceMetrics?.ttfb ? `${Math.round(performanceMetrics.ttfb)}ms` : 'N/A'}
                </div>
                <Badge variant={performanceMetrics?.ttfb < 800 ? "default" : "secondary"}>
                  {performanceMetrics?.ttfb < 800 ? "Good" : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthStatus?.details?.security && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span>Content Security Policy</span>
                    {getStatusIcon(healthStatus.details.security.cspEnabled)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>HTTPS Enabled</span>
                    {getStatusIcon(healthStatus.details.security.httpsEnabled)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dev Tools Disabled</span>
                    {getStatusIcon(healthStatus.details.security.devToolsDisabled)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Report</CardTitle>
            </CardHeader>
            <CardContent>
              {accessibilityReport && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Score</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{accessibilityReport.score}%</span>
                      <Badge variant={accessibilityReport.score > 80 ? "default" : "secondary"}>
                        {accessibilityReport.score > 80 ? "Good" : "Needs Work"}
                      </Badge>
                    </div>
                  </div>
                  
                  {accessibilityReport.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Issues Found
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {accessibilityReport.issues.map((issue: string, index: number) => (
                          <li key={index}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {accessibilityReport.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recommendations</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {accessibilityReport.recommendations.map((rec: string, index: number) => (
                          <li key={index}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Health</CardTitle>
            </CardHeader>
            <CardContent>
              {healthStatus?.details?.seo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span>Page Title</span>
                    {getStatusIcon(healthStatus.details.seo.hasTitle)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Meta Description</span>
                    {getStatusIcon(healthStatus.details.seo.hasDescription)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Canonical URL</span>
                    {getStatusIcon(healthStatus.details.seo.hasCanonical)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Structured Data</span>
                    {getStatusIcon(healthStatus.details.seo.hasStructuredData)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
