
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Code, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  TrendingUp,
  Database
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface Query {
  id: string;
  file_path: string;
  line_number: number;
  query_content: string;
  status: string;
  optimization_suggestion: string;
  performance_impact: string;
  created_at: string;
  repository: {
    name: string;
    language: string;
  };
}

export default function Queries() {
  const { user } = useAuth();
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    if (user) {
      loadQueries();
    }
  }, [user]);

  const loadQueries = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('queries')
        .select(`
          *,
          repositories!inner(name, language, user_id)
        `)
        .eq('repositories.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      const transformedQueries = data?.map(query => ({
        ...query,
        repository: {
          name: query.repositories.name,
          language: query.repositories.language
        }
      })) || [];

      setQueries(transformedQueries);
    } catch (error) {
      console.error('Error loading queries:', error);
      enhancedToast.error({
        title: "Error Loading Queries",
        description: "Failed to load your queries. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizeQuery = async (queryId: string) => {
    try {
      const { error } = await supabase
        .from('queries')
        .update({ 
          status: 'optimizing',
          optimization_suggestion: 'AI optimization in progress...'
        })
        .eq('id', queryId);

      if (error) {
        throw error;
      }

      enhancedToast.success({
        title: "Optimization Started",
        description: "AI is analyzing your query for optimization opportunities.",
      });

      // Simulate optimization completion
      setTimeout(() => {
        supabase
          .from('queries')
          .update({ 
            status: 'optimized',
            optimization_suggestion: 'Consider adding an index on the user_id column to improve query performance by 65%.',
            performance_impact: 'High - Expected 65% performance improvement'
          })
          .eq('id', queryId)
          .then(() => loadQueries());
      }, 3000);
    } catch (error) {
      console.error('Error optimizing query:', error);
      enhancedToast.error({
        title: "Optimization Failed",
        description: "Failed to start query optimization.",
      });
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.query_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         query.file_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         query.repository.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'optimized' && query.status === 'optimized') ||
                      (selectedTab === 'pending' && query.status === 'pending');
    
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimized':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Optimized</Badge>;
      case 'optimizing':
        return <Badge variant="secondary"><Zap className="h-3 w-3 mr-1 animate-pulse" />Optimizing</Badge>;
      case 'needs_attention':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Needs Attention</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getPerformanceImpactColor = (impact: string) => {
    if (impact?.toLowerCase().includes('high')) return 'text-red-600';
    if (impact?.toLowerCase().includes('medium')) return 'text-yellow-600';
    if (impact?.toLowerCase().includes('low')) return 'text-green-600';
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Query Manager</h1>
          <p className="text-muted-foreground">
            Analyze and optimize your SQL queries with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50">
            <Database className="h-3 w-3 mr-1" />
            {queries.length} Queries
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search queries, files, or repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All ({queries.length})</TabsTrigger>
            <TabsTrigger value="optimized">Optimized ({queries.filter(q => q.status === 'optimized').length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({queries.filter(q => q.status === 'pending').length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Query List */}
      {filteredQueries.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No queries found</h3>
            <p className="text-muted-foreground mb-4">
              {queries.length === 0 
                ? "Connect repositories to start analyzing SQL queries"
                : "No queries match your search criteria"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQueries.map((query) => (
            <Card key={query.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {query.file_path}
                      </CardTitle>
                      {getStatusBadge(query.status)}
                    </div>
                    <CardDescription className="text-sm">
                      Line {query.line_number} • {query.repository.name} • {query.repository.language}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOptimizeQuery(query.id)}
                    disabled={query.status === 'optimizing'}
                  >
                    <Zap className={`h-4 w-4 mr-2 ${query.status === 'optimizing' ? 'animate-pulse' : ''}`} />
                    {query.status === 'optimizing' ? 'Optimizing...' : 'Optimize'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Query Content */}
                <div>
                  <h4 className="font-medium mb-2">SQL Query</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <code className="text-sm font-mono text-foreground">
                      {query.query_content.length > 200 
                        ? `${query.query_content.substring(0, 200)}...`
                        : query.query_content
                      }
                    </code>
                  </div>
                </div>

                {/* Optimization Suggestion */}
                {query.optimization_suggestion && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Optimization Suggestion
                    </h4>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
                      <p className="text-sm text-blue-800">{query.optimization_suggestion}</p>
                    </div>
                  </div>
                )}

                {/* Performance Impact */}
                {query.performance_impact && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Performance Impact:</span>
                    <span className={`font-medium ${getPerformanceImpactColor(query.performance_impact)}`}>
                      {query.performance_impact}
                    </span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t pt-3">
                  Analyzed: {new Date(query.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
