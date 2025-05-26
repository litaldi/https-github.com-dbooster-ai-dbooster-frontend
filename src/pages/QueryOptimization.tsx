
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, Copy, GitPullRequest, X, Clock, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function QueryOptimization() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would be fetched based on ID
  const queryData = {
    id: 1,
    file: 'user-service.ts',
    line: 45,
    repository: 'my-awesome-app',
    originalQuery: `SELECT u.id, u.name, u.email, u.created_at, u.updated_at, 
       p.id as profile_id, p.bio, p.avatar_url,
       s.status, s.last_login
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id  
LEFT JOIN user_status s ON u.id = s.user_id
WHERE u.status = 'active' 
  AND u.created_at > '2023-01-01'
ORDER BY u.created_at DESC
LIMIT 100`,
    optimizedQuery: `SELECT u.id, u.name, u.email, u.created_at, u.updated_at, 
       p.id as profile_id, p.bio, p.avatar_url,
       s.status, s.last_login
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id  
LEFT JOIN user_status s ON u.id = s.user_id
WHERE u.status = 'active' 
  AND u.created_at > '2023-01-01'
ORDER BY u.created_at DESC
LIMIT 100`,
    explanation: 'Added composite index on (status, created_at) to optimize the WHERE clause and ORDER BY operation. This eliminates the need for a full table scan and expensive sorting.',
    metrics: {
      runtimeBefore: '245ms',
      runtimeAfter: '12ms',
      improvementPercent: 95,
      recordCount: 1250000,
      indexSuggestion: 'CREATE INDEX idx_users_status_created ON users(status, created_at)'
    },
    status: 'pending'
  };

  const handleApprove = () => {
    toast({
      title: "Optimization Approved",
      description: "A pull request will be created with the optimization changes.",
    });
  };

  const handleReject = () => {
    toast({
      title: "Optimization Rejected",
      description: "This optimization has been marked as rejected.",
      variant: "destructive",
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Query has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/queries')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Queries
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Query Optimization</h1>
            <p className="text-muted-foreground">
              {queryData.file}:{queryData.line} • {queryData.repository}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReject}>
            <X className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button onClick={handleApprove}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Approve & Create PR
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runtime Before</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{queryData.metrics.runtimeBefore}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Runtime After</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{queryData.metrics.runtimeAfter}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{queryData.metrics.improvementPercent}%</div>
            <p className="text-xs text-muted-foreground">
              {queryData.metrics.recordCount.toLocaleString()} records analyzed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Query Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Query Comparison</CardTitle>
          <CardDescription>
            Compare the original query with the optimized version
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="diff" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diff">Diff View</TabsTrigger>
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="optimized">Optimized</TabsTrigger>
            </TabsList>
            
            <TabsContent value="diff" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-red-600">Original Query</h4>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(queryData.originalQuery)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <pre className="text-sm bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 overflow-auto">
                    <code>{queryData.originalQuery}</code>
                  </pre>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-green-600">Optimized Query</h4>
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(queryData.optimizedQuery)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <pre className="text-sm bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 overflow-auto">
                    <code>{queryData.optimizedQuery}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="original">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Original Query</h4>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(queryData.originalQuery)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="text-sm bg-muted border rounded-lg p-4 overflow-auto">
                <code>{queryData.originalQuery}</code>
              </pre>
            </TabsContent>
            
            <TabsContent value="optimized">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Optimized Query</h4>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(queryData.optimizedQuery)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="text-sm bg-muted border rounded-lg p-4 overflow-auto">
                <code>{queryData.optimizedQuery}</code>
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Explanation and Index Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{queryData.explanation}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">SQL to create the index:</p>
              <Button variant="ghost" size="sm" onClick={() => handleCopy(queryData.metrics.indexSuggestion)}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="text-sm bg-muted border rounded-lg p-3 overflow-auto">
              <code>{queryData.metrics.indexSuggestion}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
