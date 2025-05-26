
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus } from 'lucide-react';
import { useRepositories } from '@/hooks/useRepositories';
import { RepositoryTable } from '@/components/repositories/RepositoryTable';
import { RepositoryEmptyState } from '@/components/repositories/RepositoryEmptyState';
import { RepositorySearch } from '@/components/repositories/RepositorySearch';

export default function Repositories() {
  const {
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
  } = useRepositories();

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
          <RepositorySearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading repositories...</p>
            </div>
          ) : filteredRepos.length === 0 ? (
            <RepositoryEmptyState
              searchTerm={searchTerm}
              githubAccessToken={githubAccessToken}
              onAddRepo={handleAddRepo}
            />
          ) : (
            <RepositoryTable
              repositories={filteredRepos}
              onRescan={handleRescan}
              onRemove={handleRemove}
              isScanning={scanRepositoryMutation.isPending}
              isRemoving={removeRepositoryMutation.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
