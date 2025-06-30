
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Lightbulb,
  Target
} from 'lucide-react';
import { realAIService, type RealAIOptimizationResult } from '@/services/ai/realAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

interface OptimizationState {
  isAnalyzing: boolean;
  progress: number;
  result: RealAIOptimizationResult | null;
  error: string | null;
}

const useQueryOptimization = () => {
  const [state, setState] = useState<OptimizationState>({
    isAnalyzing: false,
    progress: 0,
    result: null,
    error: null
  });

  const optimizeQuery = useCallback(async (query: string) => {
    if (!query.trim()) {
      enhancedToast.warning({
        title: "No Query Provided",
        description: "Please enter a SQL query to optimize.",
      });
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, progress: 0, result: null, error: null }));

    try {
      // Simulate progressive analysis
      const progressSteps = [20, 40, 60, 80, 100];
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setState(prev => ({ ...prev, progress: step }));
      }

      const result = await realAIService.optimizeQueryWithRealAI(query, 'sample_schema');
      
      setState(prev => ({ ...prev, result, isAnalyzing: false }));

      enhancedToast.success({
        title: "Query Optimized Successfully",
        description: `Performance improved by ${Math.round((1 - result.performancePrediction.executionTime / 200) * 100)}%`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Optimization failed';
      setState(prev => ({ ...prev, error: errorMessage, isAnalyzing: false }));
      
      enhancedToast.error({
        title: "Optimization Failed",
        description: "Unable to optimize query. Please try again.",
      });
    }
  }, []);

  return { ...state, optimizeQuery };
};

const OptimizationProgress: React.FC<{ progress: number; isAnalyzing: boolean }> = React.memo(({ progress, isAnalyzing }) => {
  const getProgressMessage = (progress: number) => {
    if (progress < 40) return "Analyzing query structure...";
    if (progress < 80) return "Predicting performance impact...";
    return "Generating optimization recommendations...";
  };

  if (!isAnalyzing) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 animate-pulse text-primary" />
        <span className="text-sm font-medium">AI Analysis in Progress...</span>
      </div>
      <Progress value={progress} className="w-full" />
      <div className="text-xs text-muted-foreground">
        {getProgressMessage(progress)}
      </div>
    </div>
  );
});

OptimizationProgress.displayName = 'OptimizationProgress';

const PerformanceMetrics: React.FC<{ result: RealAIOptimizationResult }> = React.memo(({ result }) => {
  const metrics = useMemo(() => [
    {
      title: 'Execution Time',
      value: `${result.performancePrediction.executionTime.toFixed(0)}ms`,
      icon: Clock,
      color: 'blue'
    },
    {
      title: 'Resource Usage',
      value: `${result.performancePrediction.resourceUsage.toFixed(0)}MB`,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Scalability Score',
      value: result.performancePrediction.scalabilityScore.toFixed(0),
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Bottlenecks',
      value: result.performancePrediction.bottlenecks.length.toString(),
      icon: AlertTriangle,
      color: 'amber'
    }
  ], [result]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className={`text-center p-4 bg-${metric.color}-50 rounded-lg`}>
            <Icon className={`h-6 w-6 text-${metric.color}-600 mx-auto mb-2`} />
            <div className={`text-2xl font-bold text-${metric.color}-600`}>
              {metric.value}
            </div>
            <div className="text-sm text-muted-foreground">{metric.title}</div>
          </div>
        );
      })}
    </div>
  );
});

PerformanceMetrics.displayName = 'PerformanceMetrics';

export function RealTimeQueryOptimizer() {
  const [query, setQuery] = useState('');
  const { isAnalyzing, progress, result, error, optimizeQuery } = useQueryOptimization();

  const getRiskColor = useCallback((level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  }, []);

  const getImpactColor = useCallback((impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Real-Time Query Optimizer
              <Badge variant="secondary" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              Advanced AI that analyzes and optimizes SQL queries in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SQL Query to Optimize</label>
              <Textarea
                placeholder="SELECT * FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.created_at > '2024-01-01' ORDER BY u.created_at DESC;"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>

            <OptimizationProgress progress={progress} isAnalyzing={isAnalyzing} />

            <Button 
              onClick={() => optimizeQuery(query)} 
              disabled={!query.trim() || isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing with AI...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Optimize with Real-Time AI
                </>
              )}
            </Button>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {result && (
        <ScaleIn delay={0.2}>
          <div className="space-y-6">
            {/* Performance Prediction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Prediction
                  <Badge variant="outline" className="ml-2">
                    {Math.round(result.confidenceScore * 100)}% Confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceMetrics result={result} />

                {result.performancePrediction.bottlenecks.length > 0 && (
                  <Alert className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Detected Bottlenecks:</strong> {result.performancePrediction.bottlenecks.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Optimized Query */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  AI-Optimized Query
                  <div className={`px-2 py-1 rounded text-xs ${getRiskColor(result.riskAssessment.level)}`}>
                    {result.riskAssessment.level.toUpperCase()} RISK
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto text-green-800">
                    <code>{result.optimizedQuery}</code>
                  </pre>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  {result.explanation}
                </div>
              </CardContent>
            </Card>

            {/* Index Recommendations */}
            {result.indexRecommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                    AI Index Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.indexRecommendations.map((rec, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">
                            {rec.table}.{rec.columns.join(', ')}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={getImpactColor(rec.impact)}>
                              {rec.impact} impact
                            </Badge>
                            <Badge variant="outline">{rec.type}</Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expected improvement: {rec.estimatedImprovement}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScaleIn>
      )}
    </div>
  );
}
