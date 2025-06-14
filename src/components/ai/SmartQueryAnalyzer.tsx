
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingState } from '@/components/ui/enhanced-loading-states';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Database,
  ArrowRight
} from 'lucide-react';

interface AnalysisResult {
  performance: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  complexity: {
    level: 'Simple' | 'Moderate' | 'Complex' | 'Advanced';
    metrics: {
      joins: number;
      subqueries: number;
      aggregations: number;
    };
  };
  optimization: {
    indexSuggestions: string[];
    queryRewrite: string;
    estimatedImprovement: string;
  };
}

export function SmartQueryAnalyzer() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const analyzeQuery = async () => {
    if (!query.trim()) {
      enhancedToast.warning({
        title: 'Query Required',
        description: 'Please enter a SQL query to analyze.'
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockAnalysis: AnalysisResult = {
        performance: {
          score: Math.floor(Math.random() * 40) + 60, // 60-100
          issues: [
            'Missing index on user_id column',
            'Full table scan detected',
            'Inefficient JOIN order'
          ],
          suggestions: [
            'Add composite index on (user_id, created_at)',
            'Use EXISTS instead of IN for subquery',
            'Consider query rewriting for better performance'
          ]
        },
        complexity: {
          level: query.length > 200 ? 'Complex' : query.length > 100 ? 'Moderate' : 'Simple',
          metrics: {
            joins: (query.match(/JOIN/gi) || []).length,
            subqueries: (query.match(/\(/g) || []).length,
            aggregations: (query.match(/(COUNT|SUM|AVG|MAX|MIN)/gi) || []).length
          }
        },
        optimization: {
          indexSuggestions: [
            'CREATE INDEX idx_user_created ON users(user_id, created_at)',
            'CREATE INDEX idx_order_status ON orders(status)'
          ],
          queryRewrite: `-- Optimized version
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id 
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC;`,
          estimatedImprovement: '65% faster execution'
        }
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
      
      enhancedToast.success({
        title: 'Analysis Complete',
        description: `Performance score: ${mockAnalysis.performance.score}/100`
      });
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'Simple': return 'default';
      case 'Moderate': return 'secondary';
      case 'Complex': return 'outline';
      case 'Advanced': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Smart Query Analyzer
          </CardTitle>
          <CardDescription>
            Get AI-powered insights and optimization suggestions for your SQL queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="query-input" className="text-sm font-medium">
              SQL Query
            </label>
            <textarea
              id="query-input"
              className="w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
              placeholder="SELECT * FROM users WHERE created_at > '2024-01-01'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={analyzeQuery} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Query...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Analyze Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <LoadingState 
          message="Analyzing your query for performance insights..."
          variant="analysis"
        />
      )}

      {analysis && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Performance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.performance.score)}`}>
                    {analysis.performance.score}/100
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Complexity</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant={getComplexityColor(analysis.complexity.level)}>
                    {analysis.complexity.level}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Potential Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {analysis.optimization.estimatedImprovement}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Query Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">JOINs:</span>
                    <span className="font-medium">{analysis.complexity.metrics.joins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Subqueries:</span>
                    <span className="font-medium">{analysis.complexity.metrics.subqueries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aggregations:</span>
                    <span className="font-medium">{analysis.complexity.metrics.aggregations}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Issues Found
                  </h4>
                  <ul className="space-y-1">
                    {analysis.performance.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {analysis.performance.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Index Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.optimization.indexSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-muted rounded-md">
                      <code className="text-sm">{suggestion}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Optimized Query
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                  {analysis.optimization.queryRewrite}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Implementing these suggestions could improve query performance by up to{' '}
                <strong>{analysis.optimization.estimatedImprovement}</strong>
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              {[
                'Consider adding appropriate indexes for frequently queried columns',
                'Review JOIN order and conditions for optimal execution',
                'Use EXPLAIN PLAN to understand actual execution costs',
                'Monitor query performance in production environments',
                'Consider query caching for frequently executed queries'
              ].map((tip, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm">{tip}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
