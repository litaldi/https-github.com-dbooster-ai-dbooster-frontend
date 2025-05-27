
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Zap,
  Database,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PerformanceMetric {
  timestamp: string;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  queryRate: number;
  predictedLoad: number;
}

interface PerformancePrediction {
  metric: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
  recommendation: string;
}

export function PredictivePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [predictions, setPredictions] = useState<PerformancePrediction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertsCount, setAlertsCount] = useState(0);

  useEffect(() => {
    // Generate mock real-time data
    const generateMockData = () => {
      const now = new Date();
      const newMetrics: PerformanceMetric[] = [];
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        newMetrics.push({
          timestamp: time.toISOString(),
          responseTime: 100 + Math.random() * 200 + (i < 5 ? Math.random() * 300 : 0),
          cpuUsage: 30 + Math.random() * 40 + (i < 3 ? Math.random() * 30 : 0),
          memoryUsage: 40 + Math.random() * 30,
          queryRate: 50 + Math.random() * 100,
          predictedLoad: 60 + Math.random() * 25 + (i < 8 ? Math.random() * 40 : 0)
        });
      }
      
      setMetrics(newMetrics);
    };

    generateMockData();
    
    // Generate predictions
    setPredictions([
      {
        metric: 'Response Time',
        current: 145,
        predicted: 220,
        trend: 'up',
        confidence: 0.87,
        timeframe: 'Next 2 hours',
        recommendation: 'Consider scaling up or optimizing slow queries'
      },
      {
        metric: 'CPU Usage',
        current: 65,
        predicted: 45,
        trend: 'down',
        confidence: 0.72,
        timeframe: 'Next 1 hour',
        recommendation: 'Normal operation expected'
      },
      {
        metric: 'Query Rate',
        current: 125,
        predicted: 180,
        trend: 'up',
        confidence: 0.91,
        timeframe: 'Next 30 minutes',
        recommendation: 'Prepare for increased load, monitor connection pool'
      },
      {
        metric: 'Memory Usage',
        current: 58,
        predicted: 62,
        trend: 'stable',
        confidence: 0.68,
        timeframe: 'Next 4 hours',
        recommendation: 'Memory usage within normal range'
      }
    ]);

    setAlertsCount(2);

    // Simulate real-time updates
    if (isMonitoring) {
      const interval = setInterval(() => {
        generateMockData();
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'stable': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600';
      case 'down': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Predictive Performance Monitor</h2>
          <Badge variant="outline" className="ml-2">AI Powered</Badge>
        </div>
        <div className="flex items-center gap-4">
          {alertsCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {alertsCount} alerts
            </Badge>
          )}
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold">145ms</p>
                <p className="text-xs text-muted-foreground">+12% from last hour</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPU Usage</p>
                <p className="text-2xl font-bold">65%</p>
                <p className="text-xs text-muted-foreground">-5% from last hour</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Query Rate</p>
                <p className="text-2xl font-bold">125/min</p>
                <p className="text-xs text-muted-foreground">+8% from last hour</p>
              </div>
              <Database className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                <p className="text-2xl font-bold">58%</p>
                <p className="text-xs text-muted-foreground">+2% from last hour</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends & Predictions</CardTitle>
          <CardDescription>
            Real-time metrics with AI-powered future performance predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => formatTime(value as string)}
                  formatter={(value: number, name: string) => [
                    `${Math.round(value)}${name.includes('Usage') ? '%' : name.includes('Time') ? 'ms' : ''}`,
                    name
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="responseTime" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                  name="Response Time (ms)"
                />
                <Area 
                  type="monotone" 
                  dataKey="cpuUsage" 
                  stackId="2"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.3}
                  name="CPU Usage (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="predictedLoad" 
                  stroke="#ff7300" 
                  strokeDasharray="5 5"
                  name="Predicted Load"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Performance Predictions
          </CardTitle>
          <CardDescription>
            Machine learning-powered forecasts for key performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{prediction.metric}</h4>
                    {getTrendIcon(prediction.trend)}
                    <Badge variant="outline">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{prediction.timeframe}</span>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-lg font-bold">{prediction.current}</div>
                    <div className="text-sm text-muted-foreground">Current</div>
                  </div>
                  <div className={`text-center p-3 rounded ${prediction.trend === 'up' ? 'bg-red-50 dark:bg-red-950' : prediction.trend === 'down' ? 'bg-green-50 dark:bg-green-950' : 'bg-blue-50 dark:bg-blue-950'}`}>
                    <div className={`text-lg font-bold ${getTrendColor(prediction.trend)}`}>
                      {prediction.predicted}
                    </div>
                    <div className="text-sm text-muted-foreground">Predicted</div>
                  </div>
                  <div className="text-center p-3 bg-muted rounded">
                    <div className="text-lg font-bold">
                      {prediction.trend === 'up' ? '+' : prediction.trend === 'down' ? '-' : '±'}
                      {Math.abs(prediction.predicted - prediction.current)}
                    </div>
                    <div className="text-sm text-muted-foreground">Change</div>
                  </div>
                </div>

                <Progress value={prediction.confidence * 100} className="mb-3" />
                
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>AI Recommendation:</strong> {prediction.recommendation}
                  </AlertDescription>
                </Alert>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automated Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Intelligent Alerts
          </CardTitle>
          <CardDescription>
            AI-driven performance alerts and proactive recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>High Response Time Predicted:</strong> AI models predict response times will increase by 52% in the next 2 hours. Consider scaling database resources or optimizing active queries.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Query Rate Spike Expected:</strong> Traffic patterns suggest a 44% increase in query rate within 30 minutes. Monitor connection pool and prepare for increased load.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
