
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Server, 
  HardDrive, 
  Cpu,
  Memory,
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CapacityForecast {
  metric: 'storage' | 'cpu' | 'memory' | 'connections';
  current: number;
  predicted30d: number;
  predicted90d: number;
  predicted1y: number;
  unit: string;
  threshold: number;
  trend: 'linear' | 'exponential' | 'seasonal';
  recommendation: string;
}

interface GrowthData {
  date: string;
  storage: number;
  cpu: number;
  memory: number;
  connections: number;
}

export function CapacityPlanningAssistant() {
  const [forecasts, setForecasts] = useState<CapacityForecast[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);

  const mockForecasts: CapacityForecast[] = [
    {
      metric: 'storage',
      current: 750,
      predicted30d: 820,
      predicted90d: 980,
      predicted1y: 1450,
      unit: 'GB',
      threshold: 1000,
      trend: 'linear',
      recommendation: 'Consider upgrading storage plan within 60 days'
    },
    {
      metric: 'cpu',
      current: 65,
      predicted30d: 72,
      predicted90d: 85,
      predicted1y: 92,
      unit: '%',
      threshold: 80,
      trend: 'exponential',
      recommendation: 'CPU usage will exceed threshold in 2 months - scale up recommended'
    },
    {
      metric: 'memory',
      current: 78,
      predicted30d: 82,
      predicted90d: 88,
      predicted1y: 95,
      unit: '%',
      threshold: 90,
      trend: 'linear',
      recommendation: 'Memory usage approaching limits - monitor closely'
    },
    {
      metric: 'connections',
      current: 45,
      predicted30d: 52,
      predicted90d: 68,
      predicted1y: 89,
      unit: 'count',
      threshold: 100,
      trend: 'seasonal',
      recommendation: 'Connection pool size adequate for projected growth'
    }
  ];

  const mockGrowthData: GrowthData[] = [
    { date: '30d ago', storage: 620, cpu: 55, memory: 68, connections: 35 },
    { date: '25d ago', storage: 640, cpu: 58, memory: 70, connections: 38 },
    { date: '20d ago', storage: 670, cpu: 61, memory: 72, connections: 40 },
    { date: '15d ago', storage: 700, cpu: 63, memory: 74, connections: 42 },
    { date: '10d ago', storage: 720, cpu: 64, memory: 76, connections: 43 },
    { date: '5d ago', storage: 735, cpu: 64, memory: 77, connections: 44 },
    { date: 'Today', storage: 750, cpu: 65, memory: 78, connections: 45 }
  ];

  const analyzeCapacity = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setForecasts(mockForecasts);
      setGrowthData(mockGrowthData);
      setIsAnalyzing(false);
    }, 2500);
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'storage': return <HardDrive className="h-5 w-5" />;
      case 'cpu': return <Cpu className="h-5 w-5" />;
      case 'memory': return <Memory className="h-5 w-5" />;
      case 'connections': return <Server className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const getUrgencyLevel = (current: number, predicted90d: number, threshold: number) => {
    if (predicted90d >= threshold) return 'critical';
    if (predicted90d >= threshold * 0.8) return 'warning';
    return 'normal';
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'normal': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Capacity Planning Assistant
            </CardTitle>
            <Button 
              onClick={analyzeCapacity} 
              disabled={isAnalyzing}
              variant="outline"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Capacity
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {growthData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resource Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="storage" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          name="Storage (GB)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cpu" 
                          stroke="#82ca9d" 
                          strokeWidth={2}
                          name="CPU (%)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="memory" 
                          stroke="#ffc658" 
                          strokeWidth={2}
                          name="Memory (%)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="connections" 
                          stroke="#ff7300" 
                          strokeWidth={2}
                          name="Connections"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Forecasts */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Capacity Forecasts</h3>
                {forecasts.map((forecast) => {
                  const urgency = getUrgencyLevel(forecast.current, forecast.predicted90d, forecast.threshold);
                  return (
                    <Alert key={forecast.metric} className="border-l-4 border-l-blue-500">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          {getMetricIcon(forecast.metric)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium capitalize">{forecast.metric} Capacity</h4>
                              <Badge variant="outline" className="capitalize">
                                {forecast.trend} growth
                              </Badge>
                              {urgency !== 'normal' && (
                                <div className="flex items-center gap-1">
                                  <AlertTriangle className={`h-4 w-4 ${getUrgencyColor(urgency)}`} />
                                  <span className={`text-sm font-medium ${getUrgencyColor(urgency)}`}>
                                    {urgency === 'critical' ? 'Action Required' : 'Monitor Closely'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <AlertDescription>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-sm text-muted-foreground">Current</div>
                              <div className="text-lg font-bold">
                                {forecast.current}{forecast.unit}
                              </div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm text-muted-foreground">30 Days</div>
                              <div className="text-lg font-bold text-blue-600">
                                {forecast.predicted30d}{forecast.unit}
                              </div>
                            </div>
                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                              <div className="text-sm text-muted-foreground">90 Days</div>
                              <div className="text-lg font-bold text-yellow-600">
                                {forecast.predicted90d}{forecast.unit}
                              </div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-sm text-muted-foreground">1 Year</div>
                              <div className="text-lg font-bold text-purple-600">
                                {forecast.predicted1y}{forecast.unit}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">Recommendation:</span>
                            </div>
                            <p className="text-blue-700 text-sm">{forecast.recommendation}</p>
                          </div>
                        </AlertDescription>
                      </div>
                    </Alert>
                  );
                })}
              </div>
            </motion.div>
          )}

          {forecasts.length === 0 && !isAnalyzing && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Ready to Analyze Capacity</h3>
              <p className="text-muted-foreground">
                Get AI-powered forecasts for your database resource needs
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
