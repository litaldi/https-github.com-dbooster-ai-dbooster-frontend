
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, CheckCircle, AlertTriangle, TrendingUp, Copy, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuerySuggestion {
  id: string;
  type: 'index' | 'rewrite' | 'caching' | 'partitioning';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  originalQuery: string;
  optimizedQuery: string;
  estimatedImprovement: string;
  effort: string;
}

const mockSuggestions: QuerySuggestion[] = [
  {
    id: '1',
    type: 'index',
    priority: 'high',
    title: 'Add composite index for user queries',
    description: 'Adding a composite index on (user_id, created_at) will significantly improve query performance for user activity lookups.',
    originalQuery: 'SELECT * FROM activities WHERE user_id = ? AND created_at > ? ORDER BY created_at DESC;',
    optimizedQuery: 'CREATE INDEX idx_activities_user_created ON activities(user_id, created_at DESC);',
    estimatedImprovement: '85% faster',
    effort: 'Low'
  },
  {
    id: '2',
    type: 'rewrite',
    priority: 'medium',
    title: 'Optimize JOIN with EXISTS clause',
    description: 'Replace the LEFT JOIN with an EXISTS clause to avoid unnecessary data retrieval and improve performance.',
    originalQuery: 'SELECT u.* FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NOT NULL;',
    optimizedQuery: 'SELECT u.* FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);',
    estimatedImprovement: '40% faster',
    effort: 'Medium'
  },
  {
    id: '3',
    type: 'caching',
    priority: 'low',
    title: 'Cache frequently accessed lookup data',
    description: 'This query retrieves static reference data that changes infrequently. Consider implementing application-level caching.',
    originalQuery: 'SELECT * FROM categories WHERE active = true ORDER BY sort_order;',
    optimizedQuery: '-- Implement Redis caching with 1-hour TTL\n-- Cache key: "active_categories"\n-- Invalidate on category updates',
    estimatedImprovement: '95% faster',
    effort: 'High'
  }
];

export function QuerySuggestionEngine() {
  const { toast } = useToast();
  const [userQuery, setUserQuery] = useState('');
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>(mockSuggestions);
  const [analyzingQuery, setAnalyzingQuery] = useState(false);

  const analyzeQuery = async () => {
    if (!userQuery.trim()) return;
    
    setAnalyzingQuery(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add a new suggestion based on the user's query
    const newSuggestion: QuerySuggestion = {
      id: Date.now().toString(),
      type: 'rewrite',
      priority: 'medium',
      title: 'Custom optimization suggestion',
      description: 'Based on your query pattern, we recommend these optimizations to improve performance.',
      originalQuery: userQuery,
      optimizedQuery: userQuery.replace(/SELECT \*/g, 'SELECT specific_columns').replace(/WHERE/g, 'WHERE indexed_column = ? AND'),
      estimatedImprovement: '60% faster',
      effort: 'Medium'
    };
    
    setSuggestions(prev => [newSuggestion, ...prev]);
    setAnalyzingQuery(false);
    setUserQuery('');
    
    toast({
      title: "Query analyzed!",
      description: "New optimization suggestions have been generated.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Query has been copied to your clipboard.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'index': return '📊';
      case 'rewrite': return '✏️';
      case 'caching': return '🚀';
      case 'partitioning': return '📁';
      default: return '💡';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />
        <h2 className="text-xl font-semibold">AI Query Suggestion Engine</h2>
      </div>

      {/* Query Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Query</CardTitle>
          <CardDescription>
            Paste your SQL query below and get AI-powered optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT * FROM users WHERE created_at > '2024-01-01' ORDER BY created_at DESC..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            rows={4}
          />
          <Button onClick={analyzeQuery} disabled={!userQuery.trim() || analyzingQuery}>
            {analyzingQuery ? (
              <>
                <Play className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Analyze Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Suggestions List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Optimization Suggestions</h3>
        
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                  <div>
                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    <CardDescription>{suggestion.description}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority} priority
                  </Badge>
                  <Badge variant="outline">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {suggestion.estimatedImprovement}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Original Query</h4>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                      <code>{suggestion.originalQuery}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1"
                      onClick={() => copyToClipboard(suggestion.originalQuery)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Optimized Solution</h4>
                  <div className="relative">
                    <pre className="bg-green-50 border border-green-200 p-3 rounded text-sm overflow-x-auto">
                      <code>{suggestion.optimizedQuery}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1"
                      onClick={() => copyToClipboard(suggestion.optimizedQuery)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Implementation effort: <strong>{suggestion.effort}</strong></span>
                  <span>Expected improvement: <strong>{suggestion.estimatedImprovement}</strong></span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Test in Sandbox
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-3 w-3" />
                    Apply Suggestion
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {suggestions.length === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No optimization suggestions available. Analyze a query above to get started!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
