
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, TrendingUp, Database, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealTimeMetrics } from '@/components/dashboard/RealTimeMetrics';
import { QuerySuggestionEngine } from '@/components/optimization/QuerySuggestionEngine';

export default function QueryOptimization() {
  const [optimizationProgress, setOptimizationProgress] = useState(75);

  const performanceComparison = {
    before: {
      executionTime: '2.3s',
      cpuUsage: '85%',
      memoryUsage: '1.2GB',
      indexScans: 12,
      tableLocks: 8
    },
    after: {
      executionTime: '0.4s',
      cpuUsage: '25%',
      memoryUsage: '0.3GB',
      indexScans: 3,
      tableLocks: 1
    }
  };

  const optimizationSteps = [
    { step: 'Query Analysis', status: 'completed', description: 'Analyzed query structure and patterns' },
    { step: 'Index Recommendations', status: 'completed', description: 'Generated optimal index suggestions' },
    { step: 'Query Rewriting', status: 'in-progress', description: 'Optimizing query logic and joins' },
    { step: 'Performance Testing', status: 'pending', description: 'Testing optimized query performance' },
    { step: 'Deployment', status: 'pending', description: 'Deploy optimizations to production' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/queries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Queries
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Query Optimization</h1>
          <p className="text-muted-foreground">
            Optimizing user activity lookup query in activities table
          </p>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Before vs After</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          {/* Optimization Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Optimization Progress
              </CardTitle>
              <CardDescription>
                Current optimization status and next steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{optimizationProgress}%</span>
                </div>
                <Progress value={optimizationProgress} className="w-full" />
              </div>

              <div className="space-y-4">
                {optimizationSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2">
                      {step.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : step.status === 'in-progress' ? (
                        <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{step.step}</h4>
                        <Badge variant={
                          step.status === 'completed' ? 'default' :
                          step.status === 'in-progress' ? 'secondary' : 'outline'
                        }>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Query Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Query Analysis Results</CardTitle>
              <CardDescription>
                Detailed analysis of the current query performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">High</div>
                  <div className="text-sm text-muted-foreground">CPU Usage</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">2.3s</div>
                  <div className="text-sm text-muted-foreground">Execution Time</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-muted-foreground">Index Scans</div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Original Query</h4>
                <pre className="text-sm overflow-x-auto">
                  <code>
{`SELECT a.*, u.name, u.email 
FROM activities a 
LEFT JOIN users u ON a.user_id = u.id 
WHERE a.user_id = ? 
  AND a.created_at > ? 
ORDER BY a.created_at DESC 
LIMIT 50;`}
                  </code>
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Identified Issues</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Missing composite index on (user_id, created_at)</li>
                  <li>• Unnecessary JOIN for basic user info</li>
                  <li>• Full table scan on activities table</li>
                  <li>• Inefficient sorting without proper index</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <QuerySuggestionEngine />
        </TabsContent>

        <TabsContent value="performance">
          <RealTimeMetrics />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Comparison
              </CardTitle>
              <CardDescription>
                Before and after optimization metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-600">Before Optimization</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Execution Time</span>
                      <span className="font-bold">{performanceComparison.before.executionTime}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>CPU Usage</span>
                      <span className="font-bold">{performanceComparison.before.cpuUsage}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Memory Usage</span>
                      <span className="font-bold">{performanceComparison.before.memoryUsage}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Index Scans</span>
                      <span className="font-bold">{performanceComparison.before.indexScans}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Table Locks</span>
                      <span className="font-bold">{performanceComparison.before.tableLocks}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-green-600">After Optimization</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Execution Time</span>
                      <span className="font-bold">{performanceComparison.after.executionTime}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>CPU Usage</span>
                      <span className="font-bold">{performanceComparison.after.cpuUsage}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Memory Usage</span>
                      <span className="font-bold">{performanceComparison.after.memoryUsage}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Index Scans</span>
                      <span className="font-bold">{performanceComparison.after.indexScans}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Table Locks</span>
                      <span className="font-bold">{performanceComparison.after.tableLocks}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Optimization Results</h4>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">82%</div>
                    <div className="text-muted-foreground">Faster Execution</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">70%</div>
                    <div className="text-muted-foreground">Less CPU Usage</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">75%</div>
                    <div className="text-muted-foreground">Memory Savings</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimized Query</CardTitle>
              <CardDescription>
                The final optimized version with performance improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>
{`-- Create optimized composite index
CREATE INDEX CONCURRENTLY idx_activities_user_created 
ON activities(user_id, created_at DESC);

-- Optimized query with better performance
SELECT a.id, a.activity_type, a.description, a.created_at,
       u.name, u.email
FROM activities a
INNER JOIN users u ON a.user_id = u.id
WHERE a.user_id = ?
  AND a.created_at > ?
ORDER BY a.created_at DESC
LIMIT 50;`}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
