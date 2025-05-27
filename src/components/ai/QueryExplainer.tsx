
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Lightbulb, Clock, Layers, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryExplanation {
  summary: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  steps: ExplanationStep[];
  concepts: ConceptExplanation[];
  estimatedTime: string;
  tips: string[];
}

interface ExplanationStep {
  order: number;
  operation: string;
  description: string;
  example?: string;
  performance: 'fast' | 'medium' | 'slow';
}

interface ConceptExplanation {
  term: string;
  definition: string;
  category: 'sql-basics' | 'joins' | 'aggregation' | 'optimization';
}

export function QueryExplainer() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<QueryExplanation | null>(null);

  const explainQuery = async () => {
    if (!query.trim()) return;
    
    setIsExplaining(true);
    
    // Simulate AI query explanation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockExplanation: QueryExplanation = {
      summary: "This query retrieves user information along with their order count, filtering for users created in the last 30 days and showing only those with more than 5 orders.",
      complexity: 'intermediate',
      estimatedTime: '~0.15 seconds',
      steps: [
        {
          order: 1,
          operation: 'FROM users u',
          description: 'Start with the users table and give it an alias "u" for easier reference',
          performance: 'fast'
        },
        {
          order: 2,
          operation: 'LEFT JOIN orders o',
          description: 'Join with orders table to include all users, even those without orders',
          example: 'Users without orders will show NULL for order fields',
          performance: 'medium'
        },
        {
          order: 3,
          operation: 'WHERE u.created_at >= DATE_SUB',
          description: 'Filter to only include users created in the last 30 days',
          performance: 'fast'
        },
        {
          order: 4,
          operation: 'GROUP BY u.id, u.name',
          description: 'Group results by user to calculate aggregate values',
          performance: 'medium'
        },
        {
          order: 5,
          operation: 'HAVING COUNT(o.id) > 5',
          description: 'Filter grouped results to show only users with more than 5 orders',
          performance: 'fast'
        },
        {
          order: 6,
          operation: 'ORDER BY order_count DESC',
          description: 'Sort results by order count in descending order',
          performance: 'medium'
        }
      ],
      concepts: [
        {
          term: 'LEFT JOIN',
          definition: 'Returns all records from the left table and matching records from the right table',
          category: 'joins'
        },
        {
          term: 'GROUP BY',
          definition: 'Groups rows with the same values into summary rows for aggregate functions',
          category: 'aggregation'
        },
        {
          term: 'HAVING',
          definition: 'Filters grouped results (used with GROUP BY), similar to WHERE but for aggregated data',
          category: 'aggregation'
        }
      ],
      tips: [
        'Consider adding an index on users.created_at for better performance',
        'The LEFT JOIN ensures users without orders are still included in results',
        'HAVING is used instead of WHERE because we\'re filtering on an aggregate (COUNT)'
      ]
    };
    
    setExplanation(mockExplanation);
    setIsExplaining(false);
    
    toast({
      title: "Query explanation ready!",
      description: `Complexity level: ${mockExplanation.complexity}`,
    });
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'fast': return <Zap className="h-3 w-3 text-green-500" />;
      case 'medium': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'slow': return <Clock className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sql-basics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'joins': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'aggregation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'optimization': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        <h2 className="text-xl font-semibold">AI Query Explainer</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query Explanation</CardTitle>
          <CardDescription>
            Get detailed, step-by-step explanations of complex SQL queries
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
          <Button onClick={explainQuery} disabled={!query.trim() || isExplaining}>
            {isExplaining ? (
              <>
                <BookOpen className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Query...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Explain This Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {explanation && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Query Summary</span>
                <div className="flex gap-2">
                  <Badge className={getComplexityColor(explanation.complexity)}>
                    {explanation.complexity}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {explanation.estimatedTime}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{explanation.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Step-by-Step Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {explanation.steps.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {step.order}
                        </Badge>
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {step.operation}
                        </code>
                      </div>
                      <div className="flex items-center gap-1">
                        {getPerformanceIcon(step.performance)}
                        <span className="text-xs text-muted-foreground capitalize">
                          {step.performance}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">{step.description}</p>
                    {step.example && (
                      <div className="ml-8 text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        Example: {step.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Key Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {explanation.concepts.map((concept, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{concept.term}</span>
                        <Badge className={getCategoryColor(concept.category)} variant="secondary">
                          {concept.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{concept.definition}</p>
                      {index < explanation.concepts.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {explanation.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
