
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, Brain, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ComplexityMetrics {
  overallScore: number;
  readabilityScore: number;
  maintainabilityScore: number;
  performanceScore: number;
  cyclomatic: number;
  issues: ComplexityIssue[];
  suggestions: string[];
}

interface ComplexityIssue {
  type: 'warning' | 'error' | 'info';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export function QueryComplexityAnalyzer() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState<ComplexityMetrics | null>(null);

  const analyzeComplexity = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI complexity analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockMetrics: ComplexityMetrics = {
      overallScore: Math.floor(Math.random() * 40) + 60,
      readabilityScore: Math.floor(Math.random() * 30) + 70,
      maintainabilityScore: Math.floor(Math.random() * 35) + 65,
      performanceScore: Math.floor(Math.random() * 25) + 75,
      cyclomatic: Math.floor(Math.random() * 8) + 3,
      issues: [
        {
          type: 'warning',
          message: 'Nested subquery detected - consider using JOINs',
          severity: 'medium'
        },
        {
          type: 'info',
          message: 'Query contains complex aggregations',
          severity: 'low'
        }
      ],
      suggestions: [
        'Break down complex WHERE clauses into smaller parts',
        'Consider using Common Table Expressions (CTEs)',
        'Add meaningful aliases for better readability'
      ]
    };
    
    setMetrics(mockMetrics);
    setIsAnalyzing(false);
    
    toast({
      title: "Complexity analysis complete!",
      description: `Overall complexity score: ${mockMetrics.overallScore}/100`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', variant: 'default' as const };
    if (score >= 60) return { label: 'Good', variant: 'secondary' as const };
    return { label: 'Needs Work', variant: 'destructive' as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Query Complexity Analyzer</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complexity Analysis</CardTitle>
          <CardDescription>
            Analyze your SQL query's complexity, readability, and maintainability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY order_count DESC;"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={6}
          />
          <Button onClick={analyzeComplexity} disabled={!query.trim() || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Complexity...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analyze Query Complexity
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
                <Zap className="h-4 w-4" />
                Complexity Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Score</span>
                  <Badge variant={getScoreBadge(metrics.overallScore).variant}>
                    {getScoreBadge(metrics.overallScore).label}
                  </Badge>
                </div>
                <Progress value={metrics.overallScore} className="h-2" />
                <div className={`text-right text-sm font-semibold ${getScoreColor(metrics.overallScore)}`}>
                  {metrics.overallScore}/100
                </div>
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Readability</span>
                    <span className={getScoreColor(metrics.readabilityScore)}>{metrics.readabilityScore}/100</span>
                  </div>
                  <Progress value={metrics.readabilityScore} className="h-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Maintainability</span>
                    <span className={getScoreColor(metrics.maintainabilityScore)}>{metrics.maintainabilityScore}/100</span>
                  </div>
                  <Progress value={metrics.maintainabilityScore} className="h-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance</span>
                    <span className={getScoreColor(metrics.performanceScore)}>{metrics.performanceScore}/100</span>
                  </div>
                  <Progress value={metrics.performanceScore} className="h-1" />
                </div>

                <div className="flex justify-between text-sm pt-2 border-t">
                  <span>Cyclomatic Complexity</span>
                  <Badge variant="outline">{metrics.cyclomatic}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Issues & Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Detected Issues</h4>
                <div className="space-y-2">
                  {metrics.issues.map((issue, index) => (
                    <Alert key={index} className={
                      issue.type === 'error' ? 'border-red-200' :
                      issue.type === 'warning' ? 'border-yellow-200' : 'border-blue-200'
                    }>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <div className="flex justify-between items-start">
                          <span>{issue.message}</span>
                          <Badge variant="outline" className="text-xs ml-2">
                            {issue.severity}
                          </Badge>
                        </div>
                      </AlertDescription>
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
