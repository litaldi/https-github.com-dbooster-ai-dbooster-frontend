
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, X, Eye, Clock, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Approvals() {
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      query: "SELECT * FROM users WHERE created_at > '2023-01-01'",
      file: "user_service.py",
      line: 45,
      improvement: "Add index on created_at column",
      expectedImprovement: "85% faster",
      status: "pending"
    },
    {
      id: 2,
      query: "SELECT COUNT(*) FROM orders WHERE status = 'pending'",
      file: "order_controller.js",
      line: 78,
      improvement: "Replace COUNT(*) with EXISTS",
      expectedImprovement: "60% faster",
      status: "pending"
    },
    {
      id: 3,
      query: "SELECT u.*, p.* FROM users u JOIN profiles p ON u.id = p.user_id",
      file: "profile_service.rb",
      line: 23,
      improvement: "Add composite index on join columns",
      expectedImprovement: "40% faster",
      status: "pending"
    }
  ]);

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.filter(approval => approval.id !== id));
    toast({
      title: "Optimization approved",
      description: "The query optimization will be applied to your repository.",
    });
  };

  const handleReject = (id: number) => {
    setApprovals(prev => prev.filter(approval => approval.id !== id));
    toast({
      title: "Optimization rejected",
      description: "The query optimization has been rejected.",
    });
  };

  const handleApproveAll = () => {
    setApprovals([]);
    toast({
      title: "All optimizations approved",
      description: "All pending optimizations will be applied to your repositories.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Query Approvals</h1>
          <p className="text-muted-foreground">Review and approve pending query optimizations</p>
        </div>
        {approvals.length > 0 && (
          <Button onClick={handleApproveAll} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approve All ({approvals.length})
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{approvals.length}</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Approved This Week</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">65%</p>
                <p className="text-sm text-muted-foreground">Avg. Improvement</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {approvals.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending approvals at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pending Optimizations</CardTitle>
            <CardDescription>
              Review the proposed optimizations and their expected performance improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Improvement</TableHead>
                  <TableHead>Expected Gain</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="max-w-xs">
                      <code className="text-xs bg-muted p-1 rounded">
                        {approval.query.length > 50 
                          ? `${approval.query.substring(0, 50)}...` 
                          : approval.query
                        }
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{approval.file}</div>
                        <div className="text-muted-foreground">Line {approval.line}</div>
                      </div>
                    </TableCell>
                    <TableCell>{approval.improvement}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-green-600">
                        {approval.expectedImprovement}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Query Optimization Details</DialogTitle>
                              <DialogDescription>
                                Review the proposed changes and performance impact
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Original Query</h4>
                                <code className="block p-3 bg-muted rounded text-sm">
                                  {approval.query}
                                </code>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Proposed Improvement</h4>
                                <p className="text-sm">{approval.improvement}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Expected Performance Gain</h4>
                                <Badge variant="secondary" className="text-green-600">
                                  {approval.expectedImprovement}
                                </Badge>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReject(approval.id)}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
