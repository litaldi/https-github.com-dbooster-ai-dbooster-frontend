
import { Button } from '@/components/ui/button';
import { GitBranch, Plus } from 'lucide-react';

interface RepositoryEmptyStateProps {
  searchTerm: string;
  githubAccessToken: string | null;
  onAddRepo: () => void;
}

export function RepositoryEmptyState({ 
  searchTerm, 
  githubAccessToken, 
  onAddRepo 
}: RepositoryEmptyStateProps) {
  return (
    <div className="text-center py-8">
      <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No repositories found</h3>
      <p className="text-muted-foreground mb-4">
        {searchTerm ? 'No repositories match your search criteria.' : 'Get started by connecting your first repository.'}
      </p>
      {!searchTerm && (
        <Button onClick={onAddRepo} disabled={!githubAccessToken}>
          <Plus className="w-4 h-4 mr-2" />
          Connect Repository
        </Button>
      )}
    </div>
  );
}
