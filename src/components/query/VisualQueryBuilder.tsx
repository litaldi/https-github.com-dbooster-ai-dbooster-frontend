import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Zap, 
  Wand2, 
  Play, 
  Code, 
  Lightbulb,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

export function VisualQueryBuilder() {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [optimization, setOptimization] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerateQuery = async () => {
    if (!naturalLanguage.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI query generation
    setTimeout(() => {
      const sampleQuery = `SELECT u.name, u.email, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC
LIMIT 100;`;
      
      const sampleOptimization = `✨ AI Optimization Suggestions:
      
• Add index on users.created_at for 73% faster filtering
• Consider partitioning orders table by date for large datasets
• Use EXISTS instead of LEFT JOIN for better performance on large tables
• Estimated performance improvement: 2.3x faster execution`;

      setGeneratedQuery(sampleQuery);
      setOptimization(sampleOptimization);
      setIsAnalyzing(false);
    }, 2000);
  };

  const exampleQueries = [
    "Find all customers who made orders in the last month",
    "Show top 10 products by revenue this quarter",
    "Get users with high activity but no recent purchases",
    "Find duplicate records in the customers table"
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Natural Language to SQL
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Describe what you want in plain English, and our AI will generate optimized SQL
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="natural-query">Describe your query</Label>
              <Textarea
                id="natural-query"
                placeholder="Example: Show me all users who signed up in the last 30 days with their order counts..."
                value={naturalLanguage}
                onChange={(e) => setNaturalLanguage(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {exampleQueries.map((example, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => setNaturalLanguage(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>

            <EnhancedButton 
              onClick={handleGenerateQuery}
              disabled={!naturalLanguage.trim() || isAnalyzing}
              loading={isAnalyzing}
              loadingText="Generating optimized SQL..."
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Generate Optimized SQL
            </EnhancedButton>
          </CardContent>
        </Card>
      </FadeIn>

      {generatedQuery && (
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Generated SQL Query
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Optimized
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{generatedQuery}</code>
                </pre>
              </div>
              
              <div className="flex gap-2">
                <EnhancedButton size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Execute Query
                </EnhancedButton>
                <EnhancedButton size="sm" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Explain Plan
                </EnhancedButton>
                <EnhancedButton size="sm" variant="outline">
                  Save to Library
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {optimization && (
        <FadeIn delay={0.4}>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Lightbulb className="h-5 w-5" />
                AI Performance Recommendations
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  73% Faster
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border border-amber-200">
                <pre className="text-sm text-amber-900 whitespace-pre-wrap font-sans">
                  {optimization}
                </pre>
              </div>
              
              <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">
                  These optimizations can improve query performance by up to 2.3x
                </span>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}
    </div>
  );
}
