
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Activity, TrendingUp, Settings, AlertTriangle, CheckCircle, Zap, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ConnectionMetrics {
  timestamp: string;
  activeConnections: number;
  idleConnections: number;
  waitingQueries: number;
  responseTime: number;
}

interface PoolRecommendation {
  id: string;
  type: 'optimization' | 'warning' | 'critical';
  title: string;
  description: string;
  currentValue: number;
  recommendedValue: number;
  expectedImprovement: string;
  priority: 'high' | 'medium' | 'low';
}

export function SmartConnectionPoolOptimizer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<ConnectionMetrics[]>([]);
  const [recommendations, setRecommendations] = useState<PoolRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate real-time metrics
    const generateMetrics = () => {
      const now = new Date();
      const newMetrics: ConnectionMetrics[] = [];
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        newMetrics.push({
          timestamp: time.toISOString(),
          activeConnections: Math.floor(Math.random() * 50) + 10,
          idleConnections: Math.floor(Math.random() * 20) + 5,
          waitingQueries: Math.floor(Math.random() * 15),
          responseTime: Math.floor(Math.random() * 200) + 50
        });
      }
      
      setMetrics(newMetrics);
    };

    generateMetrics();
    const interval = setInterval(generateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const analyzeConnectionPool = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockRecommendations: PoolRecommendation[] = [
      {
        id: '1',
        type: 'critical',
        title: 'Pool Size Undersized',
        description: 'Connection pool is frequently hitting maximum capacity, causing query queuing.',
        currentValue: 20,
        recommendedValue: 35,
        expectedImprovement: '40% reduction in wait times',
        priority: 'high'
      },
      {
        id: '2',
        type: 'optimization',
        title: 'Idle Connection Timeout',
        description: 'Idle connections are being held too long, wasting resources.',
        currentValue: 600,
        recommendedValue: 300,
        expectedImprovement: '25% memory reduction',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Connection Validation Frequency',
        description: 'Connection validation is too frequent, impacting performance.',
        currentValue: 30,
        recommendedValue: 120,
        expectedImprovement: '15% performance boost',
        priority: 'low'
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
  };

  const currentMetrics = metrics[metrics.length - 1];
  const poolUtilization = currentMetrics ? 
    ((currentMetrics.activeConnections / (currentMetrics.activeConnections + currentMetrics.idleConnections)) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Smart Connection Pool Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Active Connections</span>
              </div>
              <div className="text-2xl font-bold">{currentMetrics?.activeConnections || 0}</div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Idle Connections</span>
              </div>
              <div className="text-2xl font-bold">{currentMetrics?.idleConnections || 0}</div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Waiting Queries</span>
              </div>
              <div className="text-2xl font-bold">{currentMetrics?.waitingQueries || 0}</div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Pool Utilization</span>
              </div>
              <div className="text-2xl font-bold">{poolUtilization.toFixed(1)}%</div>
              <Progress value={poolUtilization} className="mt-2" />
            </div>
          </div>

          <Button 
            onClick={analyzeConnectionPool} 
            disabled={isAnalyzing}
            className="mb-6"
          >
            {isAnalyzing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Pool Performance...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze & Optimize Pool
              </>
            )}
          </Button>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activeConnections" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="idleConnections" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {recommendations.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Run analysis to get AI-powered optimization recommendations.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <Card key={rec.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {rec.type === 'critical' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              {rec.type === 'warning' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                              {rec.type === 'optimization' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              <h3 className="font-semibold">{rec.title}</h3>
                              <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                                {rec.priority}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{rec.description}</p>
                            <div className="flex gap-4 text-sm">
                              <span>Current: <strong>{rec.currentValue}</strong></span>
                              <span>Recommended: <strong>{rec.recommendedValue}</strong></span>
                              <span className="text-green-600">Impact: {rec.expectedImprovement}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Apply
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      name="Response Time (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
