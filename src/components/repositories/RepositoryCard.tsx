
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Calendar, 
  Database, 
  TrendingUp, 
  AlertCircle,
  ExternalLink,
  Trash2,
  RefreshCw
} from 'lucide-react';

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
  scan_status: string; // Changed from union type to string
}

interface RepositoryCardProps {
  repository: Repository;
  onScan: (id: string) => void;
  onDelete: (id: string) => void;
}

export function RepositoryCard({ repository, onScan, onDelete }: RepositoryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'scanning': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Scan Complete';
      case 'scanning': return 'Scanning...';
      case 'error': return 'Scan Failed';
      default: return 'Pending Scan';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {repository.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {repository.full_name}
            </p>
            {repository.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {repository.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={`${getStatusColor(repository.scan_status)} text-white`}
            >
              {getStatusText(repository.scan_status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {repository.language && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>{repository.language}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              <span>{repository.default_branch}</span>
            </div>
          </div>
          
          {repository.last_scan && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Last scan: {new Date(repository.last_scan).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{repository.queries_count}</p>
              <p className="text-xs text-muted-foreground">Queries Found</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">{repository.optimizations_count}</p>
              <p className="text-xs text-muted-foreground">Optimizations</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            size="sm"
            onClick={() => onScan(repository.id)}
            disabled={repository.scan_status === 'scanning'}
            className="flex-1"
          >
            {repository.scan_status === 'scanning' ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                {repository.scan_status === 'completed' ? 'Re-scan' : 'Scan Repository'}
              </>
            )}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(repository.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
