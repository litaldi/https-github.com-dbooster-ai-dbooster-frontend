
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Play, Save, Share, Clock, Database, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Sandbox() {
  const [query, setQuery] = useState('SELECT * FROM users WHERE created_at > NOW() - INTERVAL \'7 days\';');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const savedQueries = [
    {
      id: 1,
      name: "Recent Users",
      query: "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'",
      lastRun: "2 hours ago",
      performance: "245ms"
    },
    {
      id: 2,
      name: "Order Summary",
      query: "SELECT COUNT(*), SUM(total) FROM orders WHERE status = 'completed'",
      lastRun: "1 day ago",
      performance: "89ms"
    },
    {
      id: 3,
      name: "User Activity",
      query: "SELECT u.email, COUNT(l.id) as login_count FROM users u LEFT JOIN logins l ON u.id = l.user_id GROUP BY u.id",
      lastRun: "3 days ago",
      performance: "456ms"
    }
  ];

  const mockResults = [
    { id: 1, email: 'user1@example.com', created_at: '2024-01-15' },
    { id: 2, email: 'user2@example.com', created_at: '2024-01-14' },
    { id: 3, email: 'user3@example.com', created_at: '2024-01-13' },
  ];

  const handleRunQuery = async () => {
    setIsRunning(true);
    // Simulate query execution
    setTimeout(() => {
      setResults(mockResults);
      setIsRunning(false);
      toast({
        title: "Query executed",
        description: "Query completed in 234ms",
      });
    }, 2000);
  };

  const handleSaveQuery = () => {
    toast({
      title: "Query saved",
      description: "Your query has been saved to your collection.",
    });
  };

  const handleShareQuery = () => {
    toast({
      title: "Query shared",
      description: "Share link copied to clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Query Sandbox</h1>
        <p className="text-muted-foreground">Test and optimize your SQL queries in a safe environment</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Query Editor
              </CardTitle>
              <CardDescription>
                Write and test your SQL queries safely
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your SQL query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={8}
                className="font-mono"
              />
              <div className="flex gap-2">
                <Button onClick={handleRunQuery} disabled={isRunning}>
                  {isRunning ? (
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Run Query
                </Button>
                <Button variant="outline" onClick={handleSaveQuery}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleShareQuery}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="results" className="space-y-4">
            <TabsList>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="explain">Execution Plan</TabsTrigger>
              <TabsTrigger value="optimization">Optimization Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="results">
              <Card>
                <CardHeader>
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>
                    {results.length > 0 ? `${results.length} rows returned` : 'No results yet'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {results.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.created_at}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Run a query to see results here
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="explain">
              <Card>
                <CardHeader>
                  <CardTitle>Execution Plan</CardTitle>
                  <CardDescription>
                    Understanding how your query will be executed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge>Seq Scan</Badge>
                      <span className="text-sm">on users (cost=0.00..35.50 rows=1000 width=64)</span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline">Filter</Badge>
                      <span className="text-sm">created_at > (now() - '7 days'::interval)</span>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        💡 Consider adding an index on created_at for better performance
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimization">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Optimization Suggestions
                  </CardTitle>
                  <CardDescription>
                    Recommendations to improve query performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Add Index on created_at</h4>
                      <Badge className="bg-green-100 text-green-800">+75% faster</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Adding an index on the created_at column will significantly improve query performance for date-based filters.
                    </p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      CREATE INDEX idx_users_created_at ON users(created_at);
                    </code>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Consider Query Rewrite</h4>
                      <Badge className="bg-blue-100 text-blue-800">+25% faster</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Using a more specific date range can help the query planner choose better execution strategies.
                    </p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      SELECT * FROM users WHERE created_at >= '2024-01-08'::date;
                    </code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Queries</CardTitle>
              <CardDescription>
                Your collection of tested queries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {savedQueries.map((savedQuery) => (
                <div key={savedQuery.id} className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <div className="font-medium text-sm mb-1">{savedQuery.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {savedQuery.query.length > 40 
                      ? `${savedQuery.query.substring(0, 40)}...` 
                      : savedQuery.query
                    }
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{savedQuery.lastRun}</span>
                    <Badge variant="outline" className="text-xs">
                      {savedQuery.performance}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Queries Run Today</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Execution Time</span>
                <span className="font-medium">234ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Saved Queries</span>
                <span className="font-medium">{savedQueries.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
