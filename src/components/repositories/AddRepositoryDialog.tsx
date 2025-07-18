
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Github } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface AddRepositoryDialogProps {
  onAdd: (repoUrl: string) => Promise<void>;
}

export function AddRepositoryDialog({ onAdd }: AddRepositoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoUrl.trim()) {
      enhancedToast.error({
        title: 'Invalid Repository',
        description: 'Please enter a valid GitHub repository URL'
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAdd(repoUrl.trim());
      setRepoUrl('');
      setOpen(false);
      enhancedToast.success({
        title: 'Repository Added',
        description: 'Repository has been added successfully'
      });
    } catch (error) {
      enhancedToast.error({
        title: 'Failed to Add Repository',
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Repository
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Add GitHub Repository
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              type="url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the full GitHub repository URL
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Repository'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
