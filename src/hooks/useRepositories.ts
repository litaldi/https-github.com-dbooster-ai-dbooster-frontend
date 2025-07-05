
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';

export function useRepositories() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Mock data for demo purposes
  const repositories = [
    {
      id: '1',
      name: 'my-awesome-app',
      full_name: 'user/my-awesome-app',
      description: 'A sample repository for testing',
      html_url: 'https://github.com/user/my-awesome-app',
      clone_url: 'https://github.com/user/my-awesome-app.git',
      language: 'JavaScript',
      default_branch: 'main',
      github_id: 123456,
      user_id: user?.id || 'demo-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_scan: new Date().toISOString(),
      scan_status: 'completed',
      queries_count: 15,
      optimizations_count: 3
    }
  ];

  // Mutation for adding repository
  const addRepositoryMutation = useMutation({
    mutationFn: async (githubRepo: any) => {
      if (!user) throw new Error('User not authenticated');
      
      // Mock implementation
      console.log('Adding repository:', githubRepo);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      console.log('Repository added successfully');
    },
    onError: (error: any) => {
      console.error('Error adding repository:', error);
    }
  });

  const scanRepositoryMutation = useMutation({
    mutationFn: async (repoId: string) => {
      // Mock implementation
      console.log('Scanning repository:', repoId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      console.log('Repository scan started');
    },
    onError: (error: any) => {
      console.error('Scan failed:', error);
    }
  });

  const removeRepositoryMutation = useMutation({
    mutationFn: async (repoId: string) => {
      // Mock implementation
      console.log('Removing repository:', repoId);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositories'] });
      console.log('Repository removed');
    },
    onError: (error: any) => {
      console.error('Error removing repository:', error);
    }
  });

  const handleAddRepo = async () => {
    console.log('Add repository functionality coming soon');
  };

  const handleRescan = (repoId: string) => {
    scanRepositoryMutation.mutate(repoId);
  };

  const handleRemove = (repoId: string) => {
    removeRepositoryMutation.mutate(repoId);
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    repositories,
    filteredRepos,
    isLoading: false,
    error: null,
    searchTerm,
    setSearchTerm,
    githubAccessToken: null,
    addRepositoryMutation,
    scanRepositoryMutation,
    removeRepositoryMutation,
    handleAddRepo,
    handleRescan,
    handleRemove
  };
}
