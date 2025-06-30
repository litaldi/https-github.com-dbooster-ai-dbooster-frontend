
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertCircle, 
  TrendingUp, 
  Shield, 
  Database,
  Zap,
  Eye,
  Brain,
  Clock
} from 'lucide-react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

interface AnomalyData {
  anomalies: Array<{
    type: 'performance' | 'security' | 'resource';
    severity: 'critical' | 'warning' | 'info';
    description: string;
    timestamp: Date;
    recommendedAction: string;
  }>;
  trend: 'improving' | 'stable' | 'degrading';
  forecast: {
    nextHour: string;
    nextDay: string;
    nextWeek: string;
  };
}

export function IntelligentAnomalyDetector() {
  const [anomalyData, setAnomalyData] = useState<AnomalyData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  useEffect(() => {
    // Auto-scan on component mount
    if (autoScanEnabled) {
      scanForAnomalies();
      
      // Set up periodic scanning every 5 minutes
      const interval = setInterval(scanForAnomalies, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [autoScanEnabled]);

  const scanForAnomalies = async () => {
    setIsScanning(true);
    
    try {
      // Generate mock metrics for demo
      const mockMetrics = Array.from({ length: 100 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 60000),
        executionTime: Math.random() * 1000 + 100,
        cpuUsage: Math.random() * 80 + 20,
        memoryUsage: Math.random() * 70 + 30,
        activeConnections: Math.floor(Math.random() * 100) + 10
      }));

      const result = await nextGenAIService.detectAnomalies(mockMetrics);
      setAnomalyData(result);
      setLastScan(new Date());

      if (result.anomalies.length > 0) {
        const criticalCount = result.anomalies.filter(a => a.severity === 'critical').length;
        if (criticalCount > 0) {
          enhancedToast.error({
            title: "Critical Anomalies Detected",
            description: `${criticalCount} critical anomalies found in your database`,
          });
        } else {
          enhancedToast.warning({
            title: "Anomalies Detected",
            description: `${result.anomalies.length} anomalies detected`,
          });
        }
      }
    } catch (error) {
      enhancedToast.error({
        title: "Anomaly Detection Failed",
        description: "Unable to scan for anomalies. Please try again.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'info': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'resource': return <Database className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'outline';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'degrading': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 rotate-0" />;
      case 'stable': return <TrendingUp className="h-4 w-4 rotate-90" />;
      case 'degrading': return <TrendingUp className="h-4 w-4 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-orange-600" />
              Intelligent Anomaly Detector
              <Badge variant="secondary" className="ml-2">
                <Brain className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              Machine learning-based anomaly detection with predictive forecasting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Auto-Scan Status</div>
                <div className={`text-xs ${autoScanEnabled ? 'text-green-600' : 'text-gray-600'}`}>
                  {autoScanEnabled ? 'Active - Scanning every 5 minutes' : 'Disabled'}
                </div>
              </div>
              <Button
                variant={autoScanEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoScanEnabled(!autoScanEnabled)}
              >
                {autoScanEnabled ? 'Disable Auto-Scan' : 'Enable Auto-Scan'}
              </Button>
            </div>

            {lastScan && (
              <div className="text-sm text-muted-foreground">
                Last scan: {lastScan.toLocaleString()}
              </div>
            )}

            <Button 
              onClick={scanForAnomalies} 
              disabled={isScanning}
              className="w-full"
              size="lg"
            >
              {isScanning ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-pulse" />
                  Scanning for Anomalies...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Scan Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </FadeIn>

      {anomalyData && (
        <ScaleIn delay={0.2}>
          <div className="space-y-6">
            {/* Trend and Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  System Trend & Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Current Trend:</span>
                  <div className={`flex items-center gap-1 ${getTrendColor(anomalyData.trend)}`}>
                    {getTrendIcon(anomalyData.trend)}
                    <span className="font-medium capitalize">{anomalyData.trend}</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Next Hour</span>
                    </div>
                    <p className="text-sm text-blue-800">{anomalyData.forecast.nextHour}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Next Day</span>
                    </div>
                    <p className="text-sm text-green-800">{anomalyData.forecast.nextDay}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Next Week</span>
                    </div>
                    <p className="text-sm text-purple-800">{anomalyData.forecast.nextWeek}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detected Anomalies */}
            {anomalyData.anomalies.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Detected Anomalies
                    <Badge variant="destructive">{anomalyData.anomalies.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {anomalyData.anomalies.map((anomaly, index) => (
                    <Alert key={index} className="border-l-4 border-l-orange-500">
                      <div className="flex items-start gap-3">
                        <div className="p-1">
                          {getTypeIcon(anomaly.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(anomaly.severity)}>
                              {getSeverityIcon(anomaly.severity)}
                              {anomaly.severity}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {anomaly.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {anomaly.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <AlertDescription>
                            <div className="space-y-1">
                              <p><strong>Issue:</strong> {anomaly.description}</p>
                              <p><strong>Recommended Action:</strong> {anomaly.recommendedAction}</p>
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-green-600">All Clear!</h3>
                  <p className="text-muted-foreground">
                    No anomalies detected in your database system
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </ScaleIn>
      )}
    </div>
  );
}
