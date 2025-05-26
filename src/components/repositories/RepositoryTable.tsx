
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { RepositoryStatusBadge } from './RepositoryStatusBadge';
import { MoreHorizontal, RefreshCw, Trash2, ExternalLink } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Repository {
  id: string;
  name: string;
  full_name: string;
  scan_status: string;
  last_scan: string | null;
  queries_count: number;
  html_url?: string;
  created_at: string;
}

interface RepositoryTableProps {
  repositories: Repository[];
  onRescan: (repoId: string) => void;
  onRemove: (repoId: string) => void;
  isScanning: boolean;
  isRemoving: boolean;
}

export function RepositoryTable({ 
  repositories, 
  onRescan, 
  onRemove, 
  isScanning, 
  isRemoving 
}: RepositoryTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Repository</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Queries</TableHead>
            <TableHead>Last Scan</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repositories.map((repo) => (
            <TableRow key={repo.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{repo.name}</div>
                  <div className="text-sm text-muted-foreground">{repo.full_name}</div>
                </div>
              </TableCell>
              <TableCell>
                <RepositoryStatusBadge status={repo.scan_status} />
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{repo.queries_count}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(repo.last_scan)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onRescan(repo.id)}
                      disabled={isScanning}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rescan
                    </DropdownMenuItem>
                    {repo.html_url && (
                      <DropdownMenuItem asChild>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on GitHub
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onRemove(repo.id)}
                      disabled={isRemoving}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
