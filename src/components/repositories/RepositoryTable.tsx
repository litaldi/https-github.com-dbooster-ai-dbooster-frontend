
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2, Github } from 'lucide-react';
import { Repository } from '@/services/repository';
import { RepositoryStatusBadge } from './RepositoryStatusBadge';

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
  return (
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
        {repositories.map((repo) => (
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
            <TableCell>
              <RepositoryStatusBadge status={repo.scan_status} />
            </TableCell>
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
                  onClick={() => onRescan(repo.id)}
                  disabled={repo.scan_status === 'scanning' || isScanning}
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {repo.scan_status === 'scanning' ? 'Scanning...' : 'Rescan'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemove(repo.id)}
                  disabled={isRemoving}
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
  );
}
