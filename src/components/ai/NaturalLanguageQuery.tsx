
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Database, Copy, Play, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryExample {
  question: string;
  sql: string;
  description: string;
}

const exampleQueries: QueryExample[] = [
  {
    question: "Show me all users who signed up last month",
    sql: "SELECT u.id, u.name, u.email, u.created_at\nFROM users u\nWHERE u.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')\n  AND u.created_at < DATE_TRUNC('month', CURRENT_DATE)\nORDER BY u.created_at DESC;",
    description: "Finds users created in the previous calendar month"
  },
  {
    question: "What are the top 5 products by sales revenue?",
    sql: "SELECT p.id, p.name, SUM(oi.quantity * oi.price) as total_revenue\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nJOIN orders o ON oi.order_id = o.id\nWHERE o.status = 'completed'\nGROUP BY p.id, p.name\nORDER BY total_revenue DESC\nLIMIT 5;",
    description: "Calculates revenue per product from completed orders"
  },
  {
    question: "Find customers who haven't ordered in the last 90 days",
    sql: "SELECT u.id, u.name, u.email, MAX(o.created_at) as last_order\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name, u.email\nHAVING MAX(o.created_at) < CURRENT_DATE - INTERVAL '90 days'\n   OR MAX(o.created_at) IS NULL\nORDER BY last_order DESC NULLS LAST;",
    description: "Identifies inactive customers for re-engagement campaigns"
  }
];

export function NaturalLanguageQuery() {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [confidence, setConfidence] = useState(0);

  const generateSQL = async () => {
    if (!question.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI SQL generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock SQL generation based on question patterns
    let mockSQL = '';
    let mockConfidence = 85;
    
    if (question.toLowerCase().includes('user') && question.toLowerCase().includes('last')) {
      mockSQL = `SELECT u.id, u.name, u.email, u.created_at
FROM users u
WHERE u.created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY u.created_at DESC;`;
    } else if (question.toLowerCase().includes('top') || question.toLowerCase().includes('best')) {
      mockSQL = `SELECT p.name, COUNT(*) as order_count, SUM(oi.quantity * oi.price) as revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 10;`;
    } else {
      mockSQL = `-- AI generated query based on: "${question}"
SELECT *
FROM relevant_table
WHERE condition_based_on_question = 'value'
ORDER BY relevant_column
LIMIT 100;`;
      mockConfidence = 70;
    }
    
    setGeneratedSQL(mockSQL);
    setConfidence(mockConfidence);
    setIsGenerating(false);
    
    toast({
      title: "SQL generated successfully!",
      description: `Generated with ${mockConfidence}% confidence`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "SQL query has been copied.",
    });
  };

  const useExample = (example: QueryExample) => {
    setQuestion(example.question);
    setGeneratedSQL(example.sql);
    setConfidence(95);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Natural Language to SQL</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ask Your Database Questions</CardTitle>
          <CardDescription>
            Type your question in plain English and get optimized SQL queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Show me all users who placed orders this week..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateSQL()}
          />
          <Button onClick={generateSQL} disabled={!question.trim() || isGenerating}>
            {isGenerating ? (
              <>
                <Database className="mr-2 h-4 w-4 animate-spin" />
                Generating SQL...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Generate SQL Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedSQL && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Generated SQL Query</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Confidence: {confidence}%
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(generatedSQL)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
              <code>{generatedSQL}</code>
            </pre>
            <div className="flex gap-2 mt-4">
              <Button size="sm">
                <Play className="mr-2 h-3 w-3" />
                Execute Query
              </Button>
              <Button size="sm" variant="outline">
                Optimize Further
              </Button>
              <Button size="sm" variant="outline">
                Explain Query
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Example Questions
          </CardTitle>
          <CardDescription>
            Try these example questions to see how natural language converts to SQL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {exampleQueries.map((example, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{example.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">{example.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => useExample(example)}
                >
                  Try This
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
