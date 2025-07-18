
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Server, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function PredictiveDatabaseScaling() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scalingRecommendations, setScalingRecommendations] = useState<any>(null);

  const mockUsageData = [
    { month: 'Jan', cpu: 45, memory: 60, storage: 40, connections: 120 },
    { month: 'Feb', cpu: 52, memory: 65, storage: 45, connections: 150 },
    { month: 'Mar', cpu: 58, memory: 70, storage: 50, connections: 180 },
    { month: 'Apr', cpu: 65, memory: 75, storage: 55, connections: 220 },
    { month: 'May', cpu: 72, memory: 80, storage: 62, connections: 250 },
    { month: 'Jun', cpu: 78, memory: 85, storage: 68, connections: 280 }
  ];

  const mockForecastData = [
    { month: 'Jul', predicted: 85, confidence: 90 },
    { month: 'Aug', predicted: 92, confidence: 85 },
    { month: 'Sep', predicted: 98, confidence: 80 },
    { month: 'Oct', predicted: 105, confidence: 75 }
  ];

  const mockRecommendations = {
    urgency: 'Medium',
    timeToScale: '2-3 months',
    currentCapacity: 78,
    projectedCapacity: 105,
    recommendations: [
      {
        type: 'Vertical Scaling',
        priority: 'High',
        description: 'Upgrade CPU from 4 cores to 8 cores',
        estimatedCost: '$150/month additional',
        impact: 'Handles 40% more concurrent users',
        timeline: '1-2 days'
      },
      {
        type: 'Horizontal Scaling',
        priority: 'Medium',
        description: 'Add read replica for load distribution',
        estimatedCost: '$300/month additional',
        impact: 'Reduces read query latency by 60%',
        timeline: '3-5 days'
      },
      {
        type: 'Storage Optimization',
        priority: 'Low',
        description: 'Implement data archiving strategy',
        estimatedCost: '$50/month savings',
        impact: 'Reduces active storage by 25%',
        timeline: '1-2 weeks'
      }
    ],
    costAnalysis: {
      currentCost: '$450/month',
      projectedCost: '$750/month',
      doNothingCost: '$1200/month (performance degradation)',
      savings: '$450/month'
    }
  };

  const analyzeScaling = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setScalingRecommendations(mockRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Predictive Database Scaling Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Current Usage Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="cpu" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Resource Utilization</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[mockUsageData[mockUsageData.length - 1]]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cpu" fill="#8884d8" />
                  <Bar dataKey="memory" fill="#82ca9d" />
                  <Bar dataKey="storage" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <Button onClick={analyzeScaling} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <TrendingUp className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing Scaling Requirements...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyze Scaling Needs
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Analyzing usage patterns and forecasting capacity needs...</div>
              <Progress value={70} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {scalingRecommendations && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Scaling Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-semibold">Urgency Level</div>
                  <Badge variant="secondary" className="mt-1">{scalingRecommendations.urgency}</Badge>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-semibold">Time to Scale</div>
                  <div className="text-sm text-muted-foreground mt-1">{scalingRecommendations.timeToScale}</div>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-semibold">Current Usage</div>
                  <div className="text-sm text-muted-foreground mt-1">{scalingRecommendations.currentCapacity}%</div>
                  <Progress value={scalingRecommendations.currentCapacity} className="mt-1" />
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-semibold">Projected Usage</div>
                  <div className="text-sm text-muted-foreground mt-1">{scalingRecommendations.projectedCapacity}%</div>
                  <Progress value={Math.min(scalingRecommendations.projectedCapacity, 100)} className="mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scaling Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scalingRecommendations.recommendations.map((rec: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4" />
                            <h4 className="font-semibold">{rec.type}</h4>
                            <Badge variant={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Cost: </span>
                              <span className="text-blue-600">{rec.estimatedCost}</span>
                            </div>
                            <div>
                              <span className="font-medium">Impact: </span>
                              <span className="text-green-600">{rec.impact}</span>
                            </div>
                            <div>
                              <span className="font-medium">Timeline: </span>
                              <span>{rec.timeline}</span>
                            </div>
                          </div>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500 ml-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="font-semibold">Current Cost</div>
                  <div className="text-lg text-blue-600">{scalingRecommendations.costAnalysis.currentCost}</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-semibold">After Scaling</div>
                  <div className="text-lg text-green-600">{scalingRecommendations.costAnalysis.projectedCost}</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-semibold">Do Nothing Cost</div>
                  <div className="text-lg text-red-600">{scalingRecommendations.costAnalysis.doNothingCost}</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="font-semibold">Monthly Savings</div>
                  <div className="text-lg text-green-600">{scalingRecommendations.costAnalysis.savings}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
