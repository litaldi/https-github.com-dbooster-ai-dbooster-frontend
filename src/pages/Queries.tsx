
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Queries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fileFilter, setFileFilter] = useState('all');

  const queries = [
    {
      id: 1,
      file: 'user-service.ts',
      line: 45,
      content: 'SELECT * FROM users WHERE status = ?',
      status: 'optimized',
      timeSaved: '2.3s',
      improvement: 'Added index on status column',
    },
    {
      id: 2,
      file: 'order-controller.js',
      line: 123,
      content: 'SELECT o.*, u.name FROM orders o JOIN users u...',
      status: 'pending',
      timeSaved: '1.8s',
      improvement: 'Optimize JOIN order',
    },
    {
      id: 3,
      file: 'analytics.py',
      line: 67,
      content: 'SELECT COUNT(*) FROM events GROUP BY date',
      status: 'review',
      timeSaved: '4.1s',
      improvement: 'Add covering index',
    },
    {
      id: 4,
      file: 'product-service.ts',
      line: 89,
      content: 'SELECT * FROM products WHERE category IN (...)',
      status: 'error',
      timeSaved: '0s',
      improvement: 'Query analysis failed',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimized':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Optimized
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'review':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Review
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.file.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter;
    const matchesFile = fileFilter === 'all' || query.file.includes(fileFilter);
    
    return matchesSearch && matchesStatus && matchesFile;
  });

  const uniqueFiles = [...new Set(queries.map(q => q.file))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Query Analysis</h1>
          <p className="text-muted-foreground">
            Review and optimize your database queries for better performance.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Database Queries
          </CardTitle>
          <CardDescription>
            Analyze and optimize queries found in your repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search queries or files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="optimized">Optimized</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fileFilter} onValueChange={setFileFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by file" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                {uniqueFiles.map(file => (
                  <SelectItem key={file} value={file}>{file}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Line</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Saved</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQueries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">{query.file}</code>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{query.line}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <code className="text-sm">{query.content}</code>
                      <p className="text-xs text-muted-foreground mt-1">{query.improvement}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(query.status)}</TableCell>
                  <TableCell>
                    <span className={query.timeSaved !== '0s' ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                      {query.timeSaved}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/queries/${query.id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredQueries.length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No queries found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || fileFilter !== 'all' 
                  ? 'No queries match your current filters.' 
                  : 'Connect a repository to start analyzing your database queries.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
