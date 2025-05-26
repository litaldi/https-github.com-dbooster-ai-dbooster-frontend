import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitBranch, Plus, RefreshCw, Trash2, Search, Github } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { githubService } from '@/services/github';
import { repositoryService, Repository } from '@/services/repository';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Repositories() {
  const [searchTerm, setSearchTerm] = useState('');
  const { githubAccessToken, user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch repositories from database
  const { data: repositories = [], isLoading, error } = useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryService.getRepositories,
    enabled: !!user
  });

  // Mutation for adding repository
  const addRepositoryMutation = useMutation({
    mutationFn: async (githubRepo: any) => {
      if (!user) throw new Error('User not authenticated');
      
      return repositoryService.createRepository({
        user_id: user.id,
        github_id: githubRepo.id,
        name: githubRepo.name,
        full_name: githubRepo.full_name,
        description: githubRepo.description,
        html_url: githubRepo.html_url,
        clone_url: githubRepo.clone_url,
        language: githubRepo.language,
        default_branch: githubRepo.default_branch || 'main'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast({
        title: "Repository Added",
        description: "Repository has been connected to DBooster.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Repository",
        description: error.message || "Failed to add repository.",
        variant: "destructive",
      });
    }
  });

  const scanRepositoryMutation = useMutation({
    mutationFn: repositoryService.scanRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast({
        title: "Scan Started",
        description: "Repository scan has been initiated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to start repository scan.",
        variant: "destructive",
      });
    }
  });

  const removeRepositoryMutation = useMutation({
    mutationFn: repositoryService.deleteRepository,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      toast({
        title: "Repository Removed",
        description: "Repository has been disconnected from DBooster.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Removing Repository",
        description: error.message || "Failed to remove repository.",
        variant: "destructive",
      });
    }
  });

  const handleAddRepo = async () => {
    if (!githubAccessToken) {
      toast({
        title: "GitHub Not Connected",
        description: "Please connect your GitHub account first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const repos = await githubService.getUserRepositories(githubAccessToken);
      
      // For demo purposes, let's add the first repository that's not already added
      const existingGithubIds = repositories.map(repo => repo.github_id);
      const availableRepo = repos.find(repo => !existingGithubIds.includes(repo.id));
      
      if (availableRepo) {
        addRepositoryMutation.mutate(availableRepo);
      } else {
        toast({
          title: "No New Repositories",
          description: "All your repositories are already connected.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error Fetching Repositories",
        description: error.message || "Failed to fetch GitHub repositories.",
        variant: "destructive",
      });
    }
  };

  const handleRescan = (repoId: string) => {
    scanRepositoryMutation.mutate(repoId);
  };

  const handleRemove = (repoId: string) => {
    removeRepositoryMutation.mutate(repoId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Connected</Badge>;
      case 'scanning':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scanning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading repositories: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage your connected repositories and their optimization status.
          </p>
        </div>
        <Button 
          onClick={handleAddRepo} 
          disabled={addRepositoryMutation.isPending || !githubAccessToken}
        >
          <Plus className="w-4 h-4 mr-2" />
          {addRepositoryMutation.isPending ? 'Adding...' : 'Add Repository'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Connected Repositories
          </CardTitle>
          <CardDescription>
            View and manage repositories connected to DBooster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading repositories...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Scan</TableHead>
                  <TableHead>Queries</TableHead>
                  <TableHead>Optimizations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepos.map((repo) => (
                  <TableRow key={repo.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="font-medium">{repo.name}</span>
                          <p className="text-sm text-muted-foreground">{repo.full_name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(repo.scan_status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {repo.last_scan_at 
                        ? new Date(repo.last_scan_at).toLocaleDateString()
                        : 'Never'
                      }
                    </TableCell>
                    <TableCell>{repo.queries_count}</TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">{repo.optimizations_count}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRescan(repo.id)}
                          disabled={repo.scan_status === 'scanning' || scanRepositoryMutation.isPending}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          {repo.scan_status === 'scanning' ? 'Scanning...' : 'Rescan'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(repo.id)}
                          disabled={removeRepositoryMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && filteredRepos.length === 0 && (
            <div className="text-center py-8">
              <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No repositories found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No repositories match your search criteria.' : 'Get started by connecting your first repository.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddRepo} disabled={!githubAccessToken}>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Repository
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
