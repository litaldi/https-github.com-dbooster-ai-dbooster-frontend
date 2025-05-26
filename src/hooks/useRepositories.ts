
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { githubService } from '@/services/github';
import { repositoryService } from '@/services/repository';

export function useRepositories() {
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

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    repositories,
    filteredRepos,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    githubAccessToken,
    addRepositoryMutation,
    scanRepositoryMutation,
    removeRepositoryMutation,
    handleAddRepo,
    handleRescan,
    handleRemove
  };
}
