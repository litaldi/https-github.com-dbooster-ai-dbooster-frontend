
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiService, type AIAnalysisResult } from '@/services/aiService';

export function SmartQueryAnalyzer() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const analyzeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a SQL query to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 20, 90));
      }, 300);

      const result = await aiService.analyzeQuery(query);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysis(result);

      toast({
        title: "Analysis Complete",
        description: `Found ${result.suggestions.length} suggestions and ${result.securityIssues.length} security considerations.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 1000);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Query Analyzer</h2>
        <Badge variant="outline" className="ml-2">Powered by AI</Badge>
      </div>

      {/* Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Smart Query Analysis
          </CardTitle>
          <CardDescription>
            Get AI-powered insights, optimization suggestions, and security analysis for your SQL queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT * FROM users WHERE created_at > '2024-01-01' ORDER BY created_at DESC LIMIT 100..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={6}
            className="font-mono"
          />
          
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing query...</span>
                <span>{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={analyzeQuery} 
            disabled={!query.trim() || isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-pulse" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Performance Prediction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Prediction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{analysis.performancePrediction.estimatedExecutionTime}</div>
                  <div className="text-sm text-muted-foreground">Est. Execution Time</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{Math.round(analysis.performancePrediction.scalabilityScore * 100)}%</div>
                  <div className="text-sm text-muted-foreground">Scalability Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{analysis.performancePrediction.indexRecommendations.length}</div>
                  <div className="text-sm text-muted-foreground">Index Suggestions</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">{analysis.performancePrediction.bottlenecks.length}</div>
                  <div className="text-sm text-muted-foreground">Bottlenecks Found</div>
                </div>
              </div>
              
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                  <strong>Optimization Potential:</strong> {analysis.performancePrediction.optimizationPotential}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Security Issues */}
          {analysis.securityIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.securityIssues.map((issue) => (
                    <div key={issue.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{issue.type.replace('-', ' ').toUpperCase()}</h4>
                          <Badge variant={getPriorityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                        <p className="text-sm font-medium text-green-600">{issue.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Optimization Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{suggestion.title}</h4>
                        <Badge variant={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <Badge variant="secondary">
                        {suggestion.expectedImprovement}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="font-medium mb-2">Original</h5>
                        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                          <code>{suggestion.originalCode}</code>
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Suggested</h5>
                        <pre className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 rounded text-xs overflow-x-auto">
                          <code>{suggestion.suggestedCode}</code>
                        </pre>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Implementation effort: <strong>{suggestion.implementationEffort}</strong>
                      </span>
                      <Button size="sm" variant="outline">
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{analysis.explanation}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
