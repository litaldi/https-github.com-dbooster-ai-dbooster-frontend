
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Award, BarChart3, Clock, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BenchmarkResult {
  overallRating: 'excellent' | 'good' | 'average' | 'poor';
  score: number;
  industryPercentile: number;
  metrics: PerformanceMetrics;
  comparisons: IndustryComparison[];
  recommendations: BenchmarkRecommendation[];
}

interface PerformanceMetrics {
  executionTime: number;
  cpuUsage: number;
  memoryUsage: number;
  ioOperations: number;
  complexity: number;
}

interface IndustryComparison {
  category: string;
  yourScore: number;
  industryAverage: number;
  topPercentile: number;
  status: 'above' | 'below' | 'average';
}

interface BenchmarkRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: 'performance' | 'optimization' | 'best-practice';
  title: string;
  description: string;
  expectedGain: string;
}

export function PerformanceBenchmarker() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [result, setResult] = useState<BenchmarkResult | null>(null);

  const runBenchmark = async () => {
    if (!query.trim()) return;
    
    setIsBenchmarking(true);
    
    // Simulate AI benchmarking analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResult: BenchmarkResult = {
      overallRating: 'good',
      score: Math.floor(Math.random() * 25) + 70,
      industryPercentile: Math.floor(Math.random() * 30) + 60,
      metrics: {
        executionTime: Math.random() * 500 + 50,
        cpuUsage: Math.random() * 40 + 20,
        memoryUsage: Math.random() * 60 + 30,
        ioOperations: Math.floor(Math.random() * 1000) + 100,
        complexity: Math.random() * 30 + 40
      },
      comparisons: [
        {
          category: 'E-commerce',
          yourScore: 78,
          industryAverage: 72,
          topPercentile: 92,
          status: 'above'
        },
        {
          category: 'SaaS Applications',
          yourScore: 65,
          industryAverage: 75,
          topPercentile: 88,
          status: 'below'
        },
        {
          category: 'Financial Services',
          yourScore: 82,
          industryAverage: 80,
          topPercentile: 95,
          status: 'above'
        }
      ],
      recommendations: [
        {
          priority: 'high',
          category: 'performance',
          title: 'Add composite index',
          description: 'Create a composite index on frequently queried columns',
          expectedGain: '45% faster execution'
        },
        {
          priority: 'medium',
          category: 'optimization',
          title: 'Query restructuring',
          description: 'Rewrite subqueries as JOINs for better performance',
          expectedGain: '25% improvement'
        }
      ]
    };
    
    setResult(mockResult);
    setIsBenchmarking(false);
    
    toast({
      title: "Benchmark analysis complete!",
      description: `Performance score: ${mockResult.score}/100 (${mockResult.industryPercentile}th percentile)`,
    });
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'average': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'above': return 'text-green-600';
      case 'below': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'above': return '↗️';
      case 'below': return '↘️';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Performance Benchmarker</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmark Analysis</CardTitle>
          <CardDescription>
            Compare your query performance against industry standards and best practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT u.id, u.name, u.email, 
       COUNT(o.id) as total_orders,
       SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'completed'
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING total_orders > 0
ORDER BY total_spent DESC
LIMIT 100;"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={6}
          />
          <Button onClick={runBenchmark} disabled={!query.trim() || isBenchmarking}>
            {isBenchmarking ? (
              <>
                <Target className="mr-2 h-4 w-4 animate-spin" />
                Running Benchmark...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Run Performance Benchmark
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Benchmark Results</span>
                <div className="flex gap-2">
                  <Badge className={getRatingColor(result.overallRating)}>
                    <Award className="h-3 w-3 mr-1" />
                    {result.overallRating}
                  </Badge>
                  <Badge variant="outline">
                    {result.industryPercentile}th percentile
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Performance Score</span>
                  <span className="font-semibold">{result.score}/100</span>
                </div>
                <Progress value={result.score} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Your query performs better than {result.industryPercentile}% of similar queries in the industry
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="metrics" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
              <TabsTrigger value="industry">Industry Comparison</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Detailed Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Execution Time</span>
                          <span>{result.metrics.executionTime.toFixed(1)}ms</span>
                        </div>
                        <Progress value={Math.min(result.metrics.executionTime / 10, 100)} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CPU Usage</span>
                          <span>{result.metrics.cpuUsage.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.metrics.cpuUsage} />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Memory Usage</span>
                          <span>{result.metrics.memoryUsage.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.metrics.memoryUsage} />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>I/O Operations</span>
                        <Badge variant="outline">{result.metrics.ioOperations}</Badge>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Query Complexity</span>
                        <Badge variant="outline">{result.metrics.complexity.toFixed(1)}/100</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="industry" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Industry Comparisons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.comparisons.map((comparison, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{comparison.category}</h4>
                          <span className={`text-sm font-semibold ${getStatusColor(comparison.status)}`}>
                            {getStatusIcon(comparison.status)} {comparison.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">{comparison.yourScore}</div>
                            <div className="text-muted-foreground">Your Score</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{comparison.industryAverage}</div>
                            <div className="text-muted-foreground">Industry Avg</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-600">{comparison.topPercentile}</div>
                            <div className="text-muted-foreground">Top 10%</div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Progress value={(comparison.yourScore / comparison.topPercentile) * 100} />
                          <div 
                            className="absolute top-0 w-0.5 h-full bg-gray-400"
                            style={{ left: `${(comparison.industryAverage / comparison.topPercentile) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Performance Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{rec.title}</h4>
                          <div className="flex gap-2">
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.priority} priority
                            </Badge>
                            <Badge variant="outline">{rec.category}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="text-sm font-medium text-green-600">
                          Expected improvement: {rec.expectedGain}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
