
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitBranch, Plus, RefreshCw, Trash2, Search, Github } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Repositories() {
  const [searchTerm, setSearchTerm] = useState('');

  const repositories = [
    {
      id: 1,
      name: 'my-awesome-app',
      status: 'connected',
      lastScan: '2 hours ago',
      queriesFound: 145,
      optimizations: 12,
    },
    {
      id: 2,
      name: 'e-commerce-backend',
      status: 'scanning',
      lastScan: 'In progress',
      queriesFound: 89,
      optimizations: 7,
    },
    {
      id: 3,
      name: 'analytics-service',
      status: 'error',
      lastScan: '1 day ago',
      queriesFound: 67,
      optimizations: 0,
    },
  ];

  const handleAddRepo = () => {
    toast({
      title: "Repository Connection",
      description: "GitHub OAuth integration would open here.",
    });
  };

  const handleRescan = (repoId: number) => {
    toast({
      title: "Rescan Started",
      description: "Repository scan has been initiated.",
    });
  };

  const handleRemove = (repoId: number) => {
    toast({
      title: "Repository Removed",
      description: "Repository has been disconnected from DBooster.",
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Connected</Badge>;
      case 'scanning':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scanning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">
            Manage your connected repositories and their optimization status.
          </p>
        </div>
        <Button onClick={handleAddRepo}>
          <Plus className="w-4 h-4 mr-2" />
          Add Repository
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
                      <span className="font-medium">{repo.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(repo.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{repo.lastScan}</TableCell>
                  <TableCell>{repo.queriesFound}</TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">{repo.optimizations}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRescan(repo.id)}
                        disabled={repo.status === 'scanning'}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Rescan
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemove(repo.id)}
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

          {filteredRepos.length === 0 && (
            <div className="text-center py-8">
              <GitBranch className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No repositories found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'No repositories match your search criteria.' : 'Get started by connecting your first repository.'}
              </p>
              <Button onClick={handleAddRepo}>
                <Plus className="w-4 h-4 mr-2" />
                Connect Repository
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
