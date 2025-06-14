
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Search, 
  Database, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Copy,
  ExternalLink
} from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { formatDistanceToNow } from 'date-fns';

interface QueryRecord {
  id: string;
  query: string;
  database: string;
  executionTime: number;
  status: 'success' | 'error' | 'optimized';
  timestamp: Date;
  optimizationSuggestions?: number;
}

export function QueryHistory() {
  const [queries, setQueries] = useState<QueryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading query history
    const loadHistory = async () => {
      setIsLoading(true);
      // Mock data
      const mockQueries: QueryRecord[] = [
        {
          id: '1',
          query: 'SELECT * FROM users WHERE created_at > NOW() - INTERVAL 30 DAY',
          database: 'production_db',
          executionTime: 245,
          status: 'optimized',
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          optimizationSuggestions: 3
        },
        {
          id: '2',
          query: 'SELECT COUNT(*) FROM orders JOIN customers ON orders.customer_id = customers.id',
          database: 'analytics_db',
          executionTime: 1200,
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: '3',
          query: 'UPDATE products SET price = price * 1.1 WHERE category = "electronics"',
          database: 'production_db',
          executionTime: 89,
          status: 'success',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQueries(mockQueries);
      setIsLoading(false);
    };

    loadHistory();
  }, []);

  const filteredQueries = queries.filter(query =>
    query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.database.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyQuery = (query: string) => {
    navigator.clipboard.writeText(query);
    enhancedToast.success({
      title: 'Query Copied',
      description: 'The query has been copied to your clipboard.'
    });
  };

  const getStatusColor = (status: QueryRecord['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'optimized':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPerformanceIcon = (executionTime: number) => {
    if (executionTime < 100) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (executionTime < 500) {
      return <Zap className="h-4 w-4 text-yellow-600" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Query History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Query History
        </CardTitle>
        <CardDescription>
          Recent database queries and their performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search queries or databases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredQueries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No queries found matching your search.' : 'No query history available.'}
                </div>
              ) : (
                filteredQueries.map((query) => (
                  <div
                    key={query.id}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{query.database}</span>
                          <Badge className={getStatusColor(query.status)}>
                            {query.status}
                          </Badge>
                          {query.optimizationSuggestions && (
                            <Badge variant="outline" className="text-blue-600">
                              {query.optimizationSuggestions} optimizations
                            </Badge>
                          )}
                        </div>
                        
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-hidden text-ellipsis whitespace-nowrap">
                          {query.query}
                        </code>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getPerformanceIcon(query.executionTime)}
                            {query.executionTime}ms
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(query.timestamp, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyQuery(query.query)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/queries/${query.id}`, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
