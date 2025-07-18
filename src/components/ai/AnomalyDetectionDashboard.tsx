
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Shield,
  Cpu,
  Database,
  RefreshCw,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnomalyDetection } from '@/hooks/useAnomalyDetection';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AnomalyDetectionDashboard() {
  const { isDetecting, result, error, detectAnomalies } = useAnomalyDetection();
  const [activeTab, setActiveTab] = useState('overview');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'resource': return <Cpu className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'degrading': return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'stable': return <Minus className="h-5 w-5 text-blue-600" />;
      default: return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  // Mock data for the chart
  const mockChartData = [
    { time: '00:00', performance: 95, resource: 45 },
    { time: '00:15', performance: 92, resource: 48 },
    { time: '00:30', performance: 88, resource: 52 },
    { time: '00:45', performance: 85, resource: 55 },
    { time: '01:00', performance: 78, resource: 65 }, // Anomaly
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              AI Anomaly Detection
            </CardTitle>
            <Button 
              onClick={detectAnomalies} 
              disabled={isDetecting}
              variant="outline"
            >
              {isDetecting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Run Detection
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Detection Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">System Trend</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getTrendIcon(result.trend)}
                            <span className="text-2xl font-bold capitalize">
                              {result.trend}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Anomalies Found</p>
                          <div className="flex items-center gap-2 mt-1">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span className="text-2xl font-bold">
                              {result.anomalies.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                          <div className="flex items-center gap-2 mt-1">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span className="text-2xl font-bold">
                              {result.anomalies.filter(a => a.severity === 'critical').length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="performance" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Performance Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="resource" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Resource Usage %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anomalies" className="space-y-4">
              <AnimatePresence>
                {result?.anomalies && result.anomalies.length > 0 ? (
                  result.anomalies.map((anomaly, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-amber-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getTypeIcon(anomaly.type)}
                              <div>
                                <h4 className="font-medium">
                                  {anomaly.type.charAt(0).toUpperCase() + anomaly.type.slice(1)} Anomaly
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {anomaly.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant={getSeverityColor(anomaly.severity)}>
                              {anomaly.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{anomaly.description}</p>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-blue-800 mb-1">
                              Recommended Action:
                            </p>
                            <p className="text-sm text-blue-700">
                              {anomaly.recommendedAction}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Database className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Anomalies Detected</h3>
                      <p className="text-muted-foreground">
                        Your system is operating within normal parameters.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-4">
              {result?.forecast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Next Hour</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{result.forecast.nextHour}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Next Day</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{result.forecast.nextDay}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Next Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{result.forecast.nextWeek}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
