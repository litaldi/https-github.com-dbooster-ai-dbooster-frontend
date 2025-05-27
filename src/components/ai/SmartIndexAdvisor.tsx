
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Database, TrendingUp, Lightbulb, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IndexRecommendation {
  id: string;
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'composite' | 'partial';
  impact: 'high' | 'medium' | 'low';
  reason: string;
  sql: string;
  estimatedImprovement: string;
  maintenance: 'low' | 'medium' | 'high';
}

const mockRecommendations: IndexRecommendation[] = [
  {
    id: '1',
    table: 'users',
    columns: ['email'],
    type: 'btree',
    impact: 'high',
    reason: 'Frequent lookups by email for authentication and user searches',
    sql: 'CREATE INDEX idx_users_email ON users(email);',
    estimatedImprovement: '85% faster login queries',
    maintenance: 'low'
  },
  {
    id: '2',
    table: 'orders',
    columns: ['user_id', 'created_at'],
    type: 'composite',
    impact: 'high',
    reason: 'Common pattern for user order history queries with date filtering',
    sql: 'CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);',
    estimatedImprovement: '70% faster order history',
    maintenance: 'medium'
  },
  {
    id: '3',
    table: 'products',
    columns: ['category_id'],
    type: 'btree',
    impact: 'medium',
    reason: 'Category-based product filtering is frequently used',
    sql: 'CREATE INDEX idx_products_category ON products(category_id) WHERE active = true;',
    estimatedImprovement: '45% faster category queries',
    maintenance: 'low'
  }
];

export function SmartIndexAdvisor() {
  const { toast } = useToast();
  const [schema, setSchema] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<IndexRecommendation[]>([]);

  const analyzeSchema = async () => {
    if (!schema.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
    
    toast({
      title: "Index analysis complete!",
      description: `Found ${mockRecommendations.length} optimization opportunities`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Index creation SQL has been copied.",
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'btree': return '🌳';
      case 'hash': return '#️⃣';
      case 'composite': return '🔗';
      case 'partial': return '📏';
      default: return '📊';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Smart Index Advisor</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Schema Analysis</CardTitle>
          <CardDescription>
            Paste your database schema or table definitions to get AI-powered index recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            rows={8}
          />
          <Button onClick={analyzeSchema} disabled={!schema.trim() || isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Database className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Schema...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Index Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Index Recommendations</h3>
          
          {recommendations.map((rec) => (
            <Card key={rec.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(rec.type)}</span>
                    <div>
                      <CardTitle className="text-base">
                        {rec.table}.{rec.columns.join(', ')}
                      </CardTitle>
                      <CardDescription>{rec.reason}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getImpactColor(rec.impact)}>
                      {rec.impact} impact
                    </Badge>
                    <Badge variant="outline">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {rec.estimatedImprovement}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">SQL Command</h4>
                  <div className="relative">
                    <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                      <code>{rec.sql}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1"
                      onClick={() => copyToClipboard(rec.sql)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <span className="text-sm font-medium">Index Type</span>
                    <p className="text-sm text-muted-foreground capitalize">{rec.type}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Maintenance Cost</span>
                    <p className="text-sm text-muted-foreground capitalize">{rec.maintenance}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Expected Improvement</span>
                    <p className="text-sm text-muted-foreground">{rec.estimatedImprovement}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Test in Sandbox
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="mr-2 h-3 w-3" />
                    Apply Index
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Consider implementing high-impact indexes first, but monitor their maintenance cost on write-heavy tables.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
