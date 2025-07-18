
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnomalyDetection } from '@/hooks/useAnomalyDetection';

export function AnomalyDetectionDashboard() {
  const { 
    anomalyData, 
    isScanning, 
    error, 
    scanForAnomalies 
  } = useAnomalyDetection();

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Anomaly Detection Dashboard
            </CardTitle>
            <Button 
              onClick={scanForAnomalies} 
              disabled={isScanning}
              variant="outline"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Scan for Anomalies
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {anomalyData && (
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
                              <Badge variant={getSeverityColor(anomaly.severity) as any}>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
