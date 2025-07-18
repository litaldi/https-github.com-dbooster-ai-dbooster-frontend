
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  Zap,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface PredictionData {
  id: string;
  type: 'performance' | 'usage' | 'security' | 'growth';
  title: string;
  prediction: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  timeline: string;
  recommendations: string[];
  metrics: {
    current: number;
    predicted: number;
    change: number;
  };
}

export function PredictiveAnalyticsDashboard() {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate loading predictions
    loadPredictiveData();
  }, []);

  const loadPredictiveData = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setPredictions([
        {
          id: '1',
          type: 'performance',
          title: 'Query Response Time Forecast',
          prediction: 'Response times will increase by 15% in the next 30 days due to growing data volume',
          confidence: 87,
          impact: 'medium',
          trend: 'up',
          timeline: '30 days',
          recommendations: [
            'Add composite indexes on high-traffic tables',
            'Implement query result caching',
            'Consider database sharding for large tables'
          ],
          metrics: {
            current: 245,
            predicted: 282,
            change: 15
          }
        },
        {
          id: '2',
          type: 'usage',
          title: 'Database Storage Growth',
          prediction: 'Storage usage will reach 85% capacity within 45 days at current growth rate',
          confidence: 92,
          impact: 'high',
          trend: 'up',
          timeline: '45 days',
          recommendations: [
            'Implement data archiving strategy',
            'Schedule storage expansion',
            'Optimize data compression settings'
          ],
          metrics: {
            current: 68,
            predicted: 85,
            change: 25
          }
        },
        {
          id: '3',
          type: 'security',
          title: 'Authentication Pattern Analysis',
          prediction: 'Unusual login patterns detected - potential security risk increasing',
          confidence: 78,
          impact: 'high',
          trend: 'up',
          timeline: '7 days',
          recommendations: [
            'Review and update access controls',
            'Implement multi-factor authentication',
            'Increase monitoring frequency'
          ],
          metrics: {
            current: 12,
            predicted: 18,
            change: 50
          }
        },
        {
          id: '4',
          type: 'growth',
          title: 'User Activity Projection',
          prediction: 'User activity expected to grow by 40% during peak season',
          confidence: 84,
          impact: 'medium',
          trend: 'up',
          timeline: '60 days',
          recommendations: [
            'Scale connection pool settings',
            'Prepare load balancing strategies',
            'Monitor resource utilization closely'
          ],
          metrics: {
            current: 1250,
            predicted: 1750,
            change: 40
          }
        }
      ]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return BarChart3;
      case 'usage': return PieChart;
      case 'security': return AlertTriangle;
      case 'growth': return LineChart;
      default: return Activity;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'from-blue-500 to-cyan-600';
      case 'usage': return 'from-green-500 to-emerald-600';
      case 'security': return 'from-red-500 to-orange-600';
      case 'growth': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-slate-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return CheckCircle;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 border-red-200';
      case 'medium': return 'text-yellow-600 border-yellow-200';
      case 'low': return 'text-green-600 border-green-200';
      default: return 'text-gray-600 border-gray-200';
    }
  };

  const refreshAnalysis = () => {
    loadPredictiveData();
  };

  if (isAnalyzing) {
    return (
      <Card className="h-[600px] flex flex-col items-center justify-center">
        <CardContent className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-12 w-12 text-primary mx-auto" />
          </motion.div>
          <h3 className="text-lg font-semibold">AI Analysis in Progress</h3>
          <p className="text-muted-foreground">
            Analyzing patterns and generating predictions...
          </p>
          <Progress value={65} className="w-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Predictive Analytics
            <Badge variant="secondary">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
          <Button onClick={refreshAnalysis} size="sm">
            Refresh Analysis
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="overview" className="space-y-4 h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictions.map((prediction, index) => {
                  const TypeIcon = getTypeIcon(prediction.type);
                  const TrendIcon = getTrendIcon(prediction.trend);
                  
                  return (
                    <motion.div
                      key={prediction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(prediction.type)}`}>
                                <TypeIcon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h3 className="font-medium text-sm">{prediction.title}</h3>
                                <p className="text-xs text-muted-foreground">{prediction.timeline}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getImpactColor(prediction.impact)}>
                                {prediction.impact} impact
                              </Badge>
                              <TrendIcon className={`h-4 w-4 ${
                                prediction.trend === 'up' ? 'text-red-500' : 
                                prediction.trend === 'down' ? 'text-green-500' : 'text-gray-500'
                              }`} />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">
                            {prediction.prediction}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Confidence:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={prediction.confidence} className="w-16 h-2" />
                              <span className="font-medium">{prediction.confidence}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span>Predicted Change:</span>
                            <span className={`font-medium ${
                              prediction.metrics.change > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {prediction.metrics.change > 0 ? '+' : ''}{prediction.metrics.change}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {predictions.filter(p => p.type === 'performance').map((prediction) => (
                <Card key={prediction.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{prediction.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{prediction.prediction}</p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{prediction.metrics.current}ms</p>
                        <p className="text-xs text-muted-foreground">Current Avg</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{prediction.metrics.predicted}ms</p>
                        <p className="text-xs text-muted-foreground">Predicted</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-orange-600">+{prediction.metrics.change}%</p>
                        <p className="text-xs text-muted-foreground">Change</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recommendations:</h4>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              {predictions.filter(p => p.type === 'usage').map((prediction) => (
                <Card key={prediction.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{prediction.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{prediction.prediction}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Usage:</span>
                        <span>{prediction.metrics.current}%</span>
                      </div>
                      <Progress value={prediction.metrics.current} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Predicted Usage:</span>
                        <span className="text-red-600">{prediction.metrics.predicted}%</span>
                      </div>
                      <Progress value={prediction.metrics.predicted} className="h-2" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Action Items:</h4>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              {predictions.filter(p => p.type === 'security').map((prediction) => (
                <Card key={prediction.id} className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">{prediction.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{prediction.prediction}</p>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-red-700">High Priority Alert</span>
                      </div>
                      <Badge variant="destructive">Action Required</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-red-700">Security Recommendations:</h4>
                      <ul className="space-y-1">
                        {prediction.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
