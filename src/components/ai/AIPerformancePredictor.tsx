
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Clock, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  ioOperations: number;
  confidence: number;
  bottlenecks: string[];
  suggestions: string[];
}

export function AIPerformancePredictor() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  const predictPerformance = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI performance prediction
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockMetrics: PerformanceMetrics = {
      executionTime: Math.random() * 2000 + 100,
      memoryUsage: Math.random() * 80 + 10,
      cpuUsage: Math.random() * 60 + 20,
      ioOperations: Math.floor(Math.random() * 1000) + 50,
      confidence: Math.random() * 30 + 70,
      bottlenecks: [
        'Missing index on user_id column',
        'Full table scan detected',
        'Inefficient JOIN operation'
      ].slice(0, Math.floor(Math.random() * 3) + 1),
      suggestions: [
        'Add composite index on (user_id, created_at)',
        'Consider query rewrite with EXISTS clause',
        'Implement result caching for frequently accessed data'
      ]
    };
    
    setMetrics(mockMetrics);
    setIsAnalyzing(false);
    
    toast({
      title: "Performance prediction complete!",
      description: `Analysis shows ${mockMetrics.confidence.toFixed(1)}% confidence`,
    });
  };

  const getPerformanceRating = (time: number) => {
    if (time < 100) return { rating: 'Excellent', color: 'bg-green-500', icon: CheckCircle };
    if (time < 500) return { rating: 'Good', color: 'bg-blue-500', icon: TrendingUp };
    if (time < 1000) return { rating: 'Fair', color: 'bg-yellow-500', icon: Clock };
    return { rating: 'Poor', color: 'bg-red-500', icon: AlertTriangle };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h2 className="text-xl font-semibold">AI Performance Predictor</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query Performance Analysis</CardTitle>
          <CardDescription>
            Get AI-powered predictions about your query's performance before execution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT * FROM users u JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
          />
          <Button onClick={predictPerformance} disabled={!query.trim() || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Activity className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Performance...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Predict Performance
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {metrics && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const perf = getPerformanceRating(metrics.executionTime);
                const Icon = perf.icon;
                return (
                  <div className="flex items-center justify-between">
                    <span>Overall Rating</span>
                    <Badge className={`${perf.color} text-white`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {perf.rating}
                    </Badge>
                  </div>
                );
              })()}
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Execution Time</span>
                    <span>{metrics.executionTime.toFixed(0)}ms</span>
                  </div>
                  <Progress value={Math.min(metrics.executionTime / 20, 100)} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory Usage</span>
                    <span>{metrics.memoryUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.memoryUsage} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>{metrics.cpuUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics.cpuUsage} />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>I/O Operations</span>
                  <span>{metrics.ioOperations}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Confidence</span>
                  <Badge variant="outline">{metrics.confidence.toFixed(1)}%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Optimization Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Potential Bottlenecks</h4>
                <div className="space-y-2">
                  {metrics.bottlenecks.map((bottleneck, index) => (
                    <Alert key={index}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{bottleneck}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">AI Suggestions</h4>
                <div className="space-y-2">
                  {metrics.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
