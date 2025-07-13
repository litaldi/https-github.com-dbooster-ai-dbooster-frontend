
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface QueryItem {
  id: string;
  query: string;
  file: string;
  line: number;
  status: 'pending' | 'optimized' | 'rejected';
  improvement: number;
  executionTime: number;
}

export default function QueriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const mockQueries: QueryItem[] = [
    {
      id: '1',
      query: 'SELECT * FROM users WHERE email = ? AND status = ?',
      file: 'user.service.js',
      line: 45,
      status: 'optimized',
      improvement: 65,
      executionTime: 120
    },
    {
      id: '2', 
      query: 'SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id',
      file: 'profile.controller.js',
      line: 78,
      status: 'pending',
      improvement: 0,
      executionTime: 340
    },
    {
      id: '3',
      query: 'UPDATE orders SET status = ? WHERE id IN (?)',
      file: 'order.service.js',
      line: 156,
      status: 'optimized',
      improvement: 42,
      executionTime: 85
    }
  ];

  const filteredQueries = mockQueries.filter(query => {
    const matchesSearch = query.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         query.file.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || query.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Query Manager</h1>
          <p className="text-muted-foreground mt-2">
            Optimize and manage your SQL queries with AI-powered recommendations.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Query
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockQueries.length}</div>
            <p className="text-xs text-muted-foreground">
              Tracked queries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimized</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockQueries.filter(q => q.status === 'optimized').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully optimized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(mockQueries.reduce((sum, q) => sum + q.improvement, 0) / mockQueries.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Performance boost
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockQueries.filter(q => q.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting optimization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Query List</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search queries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Queries</TabsTrigger>
              <TabsTrigger value="optimized">Optimized</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredQueries.length > 0 ? (
                <div className="space-y-4">
                  {filteredQueries.map((query) => (
                    <Card key={query.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(query.status)}
                              <Badge className={getStatusColor(query.status)}>
                                {query.status}
                              </Badge>
                              {query.improvement > 0 && (
                                <Badge variant="outline" className="text-green-600">
                                  +{query.improvement}% faster
                                </Badge>
                              )}
                            </div>
                            
                            <div className="bg-muted/50 p-3 rounded-lg font-mono text-sm">
                              {query.query}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{query.file}:{query.line}</span>
                              <span>•</span>
                              <span>{query.executionTime}ms execution time</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Optimize
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No queries found matching your criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
