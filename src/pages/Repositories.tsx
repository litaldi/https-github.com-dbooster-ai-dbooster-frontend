
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Plus, 
  Search, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Trash2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  language: string;
  default_branch: string;
  scan_status: string;
  queries_count: number;
  optimizations_count: number;
  last_scan: string;
  created_at: string;
}

export default function Repositories() {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    if (user) {
      loadRepositories();
    }
  }, [user]);

  const loadRepositories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRepositories(data || []);
    } catch (error) {
      console.error('Error loading repositories:', error);
      enhancedToast.error({
        title: "Error Loading Repositories",
        description: "Failed to load your repositories. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRepository = () => {
    enhancedToast.info({
      title: "Add Repository",
      description: "Repository connection wizard will be available soon.",
    });
  };

  const handleDeleteRepository = async (id: string) => {
    try {
      const { error } = await supabase
        .from('repositories')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setRepositories(prev => prev.filter(repo => repo.id !== id));
      enhancedToast.success({
        title: "Repository Deleted",
        description: "Repository has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting repository:', error);
      enhancedToast.error({
        title: "Delete Failed",
        description: "Failed to delete repository. Please try again.",
      });
    }
  };

  const handleScanRepository = async (id: string) => {
    try {
      const { error } = await supabase
        .from('repositories')
        .update({ scan_status: 'scanning', last_scan: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      enhancedToast.success({
        title: "Scan Started",
        description: "Repository scan has been initiated.",
      });
      
      // Simulate scan completion after 3 seconds
      setTimeout(() => {
        supabase
          .from('repositories')
          .update({ scan_status: 'completed' })
          .eq('id', id)
          .then(() => loadRepositories());
      }, 3000);
    } catch (error) {
      console.error('Error scanning repository:', error);
      enhancedToast.error({
        title: "Scan Failed",
        description: "Failed to start repository scan.",
      });
    }
  };

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         repo.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'scanned' && repo.scan_status === 'completed') ||
                      (selectedTab === 'pending' && repo.scan_status === 'pending');
    
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Scanned</Badge>;
      case 'scanning':
        return <Badge variant="secondary"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />Scanning</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
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
          <h1 className="text-3xl font-bold">Repository Manager</h1>
          <p className="text-muted-foreground">
            Connect and manage your database repositories for AI-powered optimization
          </p>
        </div>
        <Button onClick={handleAddRepository}>
          <Plus className="h-4 w-4 mr-2" />
          Add Repository
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">All ({repositories.length})</TabsTrigger>
            <TabsTrigger value="scanned">Scanned ({repositories.filter(r => r.scan_status === 'completed').length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({repositories.filter(r => r.scan_status === 'pending').length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Repository List */}
      {filteredRepositories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No repositories found</h3>
            <p className="text-muted-foreground mb-4">
              {repositories.length === 0 
                ? "Get started by connecting your first repository"
                : "No repositories match your search criteria"
              }
            </p>
            {repositories.length === 0 && (
              <Button onClick={handleAddRepository}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Repository
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRepositories.map((repo) => (
            <Card key={repo.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{repo.name}</CardTitle>
                      {getStatusBadge(repo.scan_status)}
                    </div>
                    <CardDescription className="text-sm">
                      {repo.description || 'No description available'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleScanRepository(repo.id)}
                      disabled={repo.scan_status === 'scanning'}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${repo.scan_status === 'scanning' ? 'animate-spin' : ''}`} />
                      Scan
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(repo.html_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRepository(repo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Language</div>
                    <div className="text-muted-foreground">{repo.language || 'Not specified'}</div>
                  </div>
                  <div>
                    <div className="font-medium">Branch</div>
                    <div className="text-muted-foreground flex items-center">
                      <GitBranch className="h-3 w-3 mr-1" />
                      {repo.default_branch}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Queries Found</div>
                    <div className="text-muted-foreground">{repo.queries_count}</div>
                  </div>
                  <div>
                    <div className="font-medium">Optimizations</div>
                    <div className="text-muted-foreground">{repo.optimizations_count}</div>
                  </div>
                </div>
                {repo.last_scan && (
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                    Last scanned: {new Date(repo.last_scan).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Alert */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          Connect your repositories to analyze SQL queries and get AI-powered optimization suggestions. 
          All scans are performed securely and your code remains private.
        </AlertDescription>
      </Alert>
    </div>
  );
}
