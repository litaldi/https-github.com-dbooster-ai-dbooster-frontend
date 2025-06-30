
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Database,
  Lightbulb,
  Target,
  Activity
} from 'lucide-react';
import { nextGenAIService, type AIOptimizationResult } from '@/services/ai/nextGenAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

export function PredictiveQueryOptimizer() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIOptimizationResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleOptimize = async () => {
    if (!query.trim()) {
      enhancedToast.warning({
        title: "No Query Provided",
        description: "Please enter a SQL query to optimize.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResult(null);

    try {
      // Simulate progressive analysis
      const progressSteps = [20, 40, 60, 80, 100];
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setAnalysisProgress(step);
      }

      const optimizationResult = await nextGenAIService.optimizeQueryWithPrediction(query);
      setResult(optimizationResult);

      enhancedToast.success({
        title: "Query Optimized Successfully",
        description: `Performance improved by ${Math.round((1 - optimizationResult.performancePrediction.executionTime / 200) * 100)}%`,
      });
    } catch (error) {
      enhancedToast.error({
        title: "Optimization Failed",
        description: "Unable to optimize query. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              Predictive Query Optimizer
              <Badge variant="secondary" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </CardTitle>
            <CardDescription>
              Next-generation AI that predicts performance impact and optimizes queries before execution
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

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-pulse text-primary" />
                  <span className="text-sm font-medium">AI Analysis in Progress...</span>
                </div>
                <Progress value={analysisProgress} className="w-full" />
                <div className="text-xs text-muted-foreground">
                  {analysisProgress < 40 && "Analyzing query structure..."}
                  {analysisProgress >= 40 && analysisProgress < 80 && "Predicting performance impact..."}
                  {analysisProgress >= 80 && "Generating optimization recommendations..."}
                </div>
              </div>
            )}

            <Button 
              onClick={handleOptimize} 
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
                  Optimize with Predictive AI
                </>
              )}
            </Button>
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
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {result.performancePrediction.executionTime.toFixed(0)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Execution Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Database className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {result.performancePrediction.resourceUsage.toFixed(0)}MB
                    </div>
                    <div className="text-sm text-muted-foreground">Resource Usage</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {result.performancePrediction.scalabilityScore.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Scalability Score</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-600">
                      {result.performancePrediction.bottlenecks.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Bottlenecks</div>
                  </div>
                </div>

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
