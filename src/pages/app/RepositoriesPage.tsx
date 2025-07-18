
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Database, GitBranch } from 'lucide-react';
import { RepositoryCard } from '@/components/repositories/RepositoryCard';
import { AddRepositoryDialog } from '@/components/repositories/AddRepositoryDialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  language?: string;
  default_branch: string;
  last_scan?: string;
  queries_count: number;
  optimizations_count: number;
  scan_status: 'pending' | 'scanning' | 'completed' | 'error';
}

export default function RepositoriesPage() {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRepositories();
  }, [user]);

  const loadRepositories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('repositories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRepositories(data || []);
    } catch (error) {
      console.error('Error loading repositories:', error);
      enhancedToast.error({
        title: 'Failed to Load Repositories',
        description: 'Could not load your repositories. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRepository = async (repoUrl: string) => {
    if (!user) return;

    // Extract owner and repo name from URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub URL format');
    }

    const [, owner, repoName] = match;
    
    // Mock GitHub API response for demo
    const mockRepo = {
      user_id: user.id,
      github_id: Math.floor(Math.random() * 1000000),
      name: repoName,
      full_name: `${owner}/${repoName}`,
      description: `A sample repository for ${repoName}`,
      html_url: repoUrl,
      clone_url: `${repoUrl}.git`,
      language: 'JavaScript',
      default_branch: 'main',
      scan_status: 'pending'
    };

    const { data, error } = await supabase
      .from('repositories')
      .insert([mockRepo])
      .select()
      .single();

    if (error) throw error;
    
    await loadRepositories();
  };

  const handleScanRepository = async (repositoryId: string) => {
    try {
      // Update status to scanning
      await supabase
        .from('repositories')
        .update({ 
          scan_status: 'scanning',
          last_scan: new Date().toISOString()
        })
        .eq('id', repositoryId);

      await loadRepositories();

      // Simulate scanning process
      setTimeout(async () => {
        const mockQueriesCount = Math.floor(Math.random() * 50) + 10;
        const mockOptimizationsCount = Math.floor(mockQueriesCount * 0.3);

        await supabase
          .from('repositories')
          .update({ 
            scan_status: 'completed',
            queries_count: mockQueriesCount,
            optimizations_count: mockOptimizationsCount
          })
          .eq('id', repositoryId);

        await loadRepositories();
        
        enhancedToast.success({
          title: 'Scan Complete',
          description: `Found ${mockQueriesCount} queries with ${mockOptimizationsCount} optimization opportunities`
        });
      }, 3000);

    } catch (error) {
      console.error('Error scanning repository:', error);
      enhancedToast.error({
        title: 'Scan Failed',
        description: 'Could not scan repository. Please try again.'
      });
    }
  };

  const handleDeleteRepository = async (repositoryId: string) => {
    try {
      const { error } = await supabase
        .from('repositories')
        .delete()
        .eq('id', repositoryId);

      if (error) throw error;
      
      await loadRepositories();
      enhancedToast.success({
        title: 'Repository Deleted',
        description: 'Repository has been removed successfully'
      });
    } catch (error) {
      console.error('Error deleting repository:', error);
      enhancedToast.error({
        title: 'Delete Failed',
        description: 'Could not delete repository. Please try again.'
      });
    }
  };

  const filteredRepositories = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repo.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || repo.scan_status === statusFilter;
    const matchesLanguage = languageFilter === 'all' || repo.language === languageFilter;
    
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const uniqueLanguages = [...new Set(repositories.map(r => r.language).filter(Boolean))];
  const statusCounts = repositories.reduce((acc, repo) => {
    acc[repo.scan_status] = (acc[repo.scan_status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Repository Management</h1>
          <p className="text-muted-foreground mt-2">
            Connect and manage your GitHub repositories for database optimization analysis.
          </p>
        </div>
        <AddRepositoryDialog onAdd={handleAddRepository} />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{repositories.length}</p>
              <p className="text-sm text-muted-foreground">Total Repositories</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{statusCounts.completed || 0}</p>
              <p className="text-sm text-muted-foreground">Scanned</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">
                {repositories.reduce((sum, repo) => sum + repo.queries_count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Queries</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">
                {repositories.reduce((sum, repo) => sum + repo.optimizations_count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Optimizations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scanning">Scanning</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={languageFilter} onValueChange={setLanguageFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {uniqueLanguages.map(language => (
              <SelectItem key={language} value={language!}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Repository Grid */}
      {filteredRepositories.length === 0 ? (
        <div className="text-center py-12">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Repositories Found</h3>
          <p className="text-muted-foreground mb-4">
            {repositories.length === 0 
              ? "Get started by adding your first GitHub repository"
              : "No repositories match your current filters"
            }
          </p>
          {repositories.length === 0 && (
            <AddRepositoryDialog onAdd={handleAddRepository} />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRepositories.map(repository => (
            <RepositoryCard
              key={repository.id}
              repository={repository}
              onScan={handleScanRepository}
              onDelete={handleDeleteRepository}
            />
          ))}
        </div>
      )}
    </div>
  );
}
