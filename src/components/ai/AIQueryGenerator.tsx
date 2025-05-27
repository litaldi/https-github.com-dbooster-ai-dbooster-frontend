
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Wand2, 
  Code, 
  Copy, 
  Play, 
  Download,
  Brain,
  Database,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AIQueryGenerator() {
  const { toast } = useToast();
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [databaseType, setDatabaseType] = useState('postgresql');
  const [complexity, setComplexity] = useState('medium');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuery = async () => {
    if (!naturalLanguage.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe what you want to query.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI query generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock generated query based on input
      const mockQuery = generateMockQuery(naturalLanguage, databaseType, complexity);
      const mockExplanation = generateMockExplanation(naturalLanguage, mockQuery);

      setGeneratedQuery(mockQuery);
      setExplanation(mockExplanation);

      toast({
        title: "Query Generated!",
        description: "AI has successfully generated your SQL query.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate query. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockQuery = (description: string, dbType: string, complexity: string): string => {
    const lower = description.toLowerCase();
    
    if (lower.includes('user') && lower.includes('order')) {
      return `-- Find users with their order information
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = true
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC, last_order_date DESC
LIMIT 100;`;
    }
    
    if (lower.includes('product') && lower.includes('sale')) {
      return `-- Get product sales analytics
SELECT 
    p.name as product_name,
    p.category,
    COUNT(oi.id) as units_sold,
    SUM(oi.quantity * oi.price) as total_revenue,
    AVG(oi.price) as avg_selling_price,
    RANK() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity * oi.price) DESC) as category_rank
FROM products p
INNER JOIN order_items oi ON p.id = oi.product_id
INNER JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
    AND o.status = 'completed'
GROUP BY p.id, p.name, p.category
ORDER BY total_revenue DESC;`;
    }

    return `-- Query generated from: "${description}"
SELECT 
    column1,
    column2,
    COUNT(*) as count
FROM table_name
WHERE condition = 'value'
    AND created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY column1, column2
ORDER BY count DESC
LIMIT 50;`;
  };

  const generateMockExplanation = (description: string, query: string): string => {
    return `This query was generated based on your description: "${description}"

**Query Breakdown:**
• **SELECT clause**: Selects relevant columns and calculates aggregations
• **FROM/JOIN clauses**: Combines necessary tables with appropriate join types
• **WHERE clause**: Filters data based on conditions and date ranges
• **GROUP BY**: Groups results for aggregation functions
• **ORDER BY**: Sorts results by relevance/importance
• **LIMIT**: Restricts result set for performance

**Performance Considerations:**
• Uses appropriate indexes on join columns
• Includes date range filtering for performance
• Limits result set to prevent large data transfers
• Uses efficient join types based on data relationships

**Optimization Tips:**
• Consider adding indexes on filtered columns
• Monitor execution plan for large datasets
• Adjust LIMIT based on your needs`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedQuery);
    toast({
      title: "Copied!",
      description: "Query copied to clipboard.",
    });
  };

  const examplePrompts = [
    "Show me all users who made purchases in the last 30 days with their total spending",
    "Find the top 10 best-selling products by category this month",
    "Get a list of customers who haven't placed an order in 6 months",
    "Show daily sales trends for the current quarter",
    "Find duplicate email addresses in the users table"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wand2 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Query Generator</h2>
        <Badge variant="outline" className="ml-2">Natural Language to SQL</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Describe Your Query
            </CardTitle>
            <CardDescription>
              Tell the AI what data you need in plain English
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">What do you want to query?</Label>
              <Textarea
                id="description"
                placeholder="e.g., Show me all users who made purchases in the last 30 days with their total spending..."
                value={naturalLanguage}
                onChange={(e) => setNaturalLanguage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="database">Database Type</Label>
                <Select value={databaseType} onValueChange={setDatabaseType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="mssql">SQL Server</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="complexity">Query Complexity</Label>
                <Select value={complexity} onValueChange={setComplexity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="complex">Complex</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateQuery} 
              disabled={!naturalLanguage.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  Generating Query...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate SQL Query
                </>
              )}
            </Button>

            {/* Example Prompts */}
            <div>
              <Label className="text-sm font-medium">Example Prompts:</Label>
              <div className="mt-2 space-y-2">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setNaturalLanguage(prompt)}
                    className="w-full text-left p-2 text-sm border rounded hover:bg-muted transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generated Query Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Generated SQL Query
            </CardTitle>
            <CardDescription>
              AI-generated SQL based on your description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedQuery ? (
              <>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto max-h-64">
                    <code>{generatedQuery}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Play className="mr-2 h-4 w-4" />
                    Test Query
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="mr-2 h-4 w-4" />
                    Optimize
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                {explanation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Query Explanation</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm">{explanation}</pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Query Generated Yet</h3>
                <p className="text-muted-foreground">
                  Describe what you want to query and the AI will generate optimized SQL for you.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
