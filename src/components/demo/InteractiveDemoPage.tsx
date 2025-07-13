
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

interface QueryOptimization {
  id: string;
  originalQuery: string;
  optimizedQuery: string;
  improvementPercent: number;
  status: 'analyzing' | 'optimized' | 'applied';
  executionTime: { before: number; after: number };
}

const mockQueries: QueryOptimization[] = [
  {
    id: '1',
    originalQuery: 'SELECT * FROM users WHERE email LIKE "%@gmail.com%"',
    optimizedQuery: 'SELECT id, name, email FROM users WHERE email LIKE "%@gmail.com%" AND status = "active"',
    improvementPercent: 73,
    status: 'optimized',
    executionTime: { before: 2400, after: 650 }
  },
  {
    id: '2', 
    originalQuery: 'SELECT u.*, p.* FROM users u LEFT JOIN profiles p ON u.id = p.user_id ORDER BY u.created_at',
    optimizedQuery: 'SELECT u.id, u.name, p.bio FROM users u LEFT JOIN profiles p ON u.id = p.user_id WHERE u.status = "active" ORDER BY u.created_at LIMIT 100',
    improvementPercent: 84,
    status: 'analyzing',
    executionTime: { before: 5200, after: 832 }
  },
  {
    id: '3',
    originalQuery: 'SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()',
    optimizedQuery: 'SELECT COUNT(*) FROM orders WHERE created_at >= CURDATE() AND created_at < CURDATE() + INTERVAL 1 DAY',
    improvementPercent: 91,
    status: 'applied',
    executionTime: { before: 1800, after: 162 }
  }
];

const mockMetrics = {
  totalQueries: 1247,
  optimizedQueries: 892,
  avgImprovement: 67,
  timeSaved: '142 hours'
};

export function InteractiveDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { user, loginDemo } = useAuth();

  const demoSteps = [
    { title: 'Query Analysis', description: 'AI scans your database queries for optimization opportunities' },
    { title: 'Performance Insights', description: 'Identifies bottlenecks and suggests improvements' },
    { title: 'Optimization Results', description: 'Shows before/after performance metrics' },
    { title: 'Implementation', description: 'One-click application of optimized queries' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStep(s => (s + 1) % demoSteps.length);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSteps.length]);

  const handleStartDemo = async () => {
    try {
      if (!user) {
        await loginDemo();
      }
      navigate('/app');
    } catch (error) {
      console.error('Demo start error:', error);
    }
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Database className="h-4 w-4 mr-2" />
                Interactive Demo
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                See DBooster in Action
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Experience how AI-powered database optimization can transform your query performance by up to 10x.
                No setup required - start exploring immediately.
              </p>
            </motion.div>
          </div>

          {/* Demo Controls */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button
              onClick={togglePlayback}
              variant="outline"
              size="lg"
              className="min-w-[120px]"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'} Demo
            </Button>
            <Button onClick={resetDemo} variant="ghost" size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Demo Progress */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex justify-between items-center mb-4">
              {demoSteps.map((step, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center text-center ${
                    index === currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index === currentStep ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-sm font-medium">{step.title}</div>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              {demoSteps[currentStep]?.description}
            </p>
          </div>

          {/* Interactive Demo Content */}
          <Tabs defaultValue="queries" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="queries">Query Optimization</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="queries" className="space-y-6">
              <div className="grid gap-6">
                {mockQueries.map((query) => (
                  <motion.div
                    key={query.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Query Optimization #{query.id}</CardTitle>
                          <Badge 
                            variant={query.status === 'applied' ? 'default' : 'secondary'}
                            className={
                              query.status === 'applied' ? 'bg-green-100 text-green-800' :
                              query.status === 'optimized' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {query.status === 'applied' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {query.status === 'analyzing' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {query.status === 'optimized' && <Zap className="h-3 w-3 mr-1" />}
                            {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          Performance improved by {query.improvementPercent}% 
                          ({query.executionTime.before}ms → {query.executionTime.after}ms)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Original Query</div>
                            <div className="bg-muted p-3 rounded-md font-mono text-sm">
                              {query.originalQuery}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">Optimized Query</div>
                            <div className="bg-green-50 border border-green-200 p-3 rounded-md font-mono text-sm">
                              {query.optimizedQuery}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                {query.improvementPercent}% faster
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-sm text-muted-foreground">
                                Saved {query.executionTime.before - query.executionTime.after}ms per execution
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockMetrics.totalQueries.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Analyzed this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Optimized</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{mockMetrics.optimizedQueries}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((mockMetrics.optimizedQueries / mockMetrics.totalQueries) * 100)}% success rate
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg Improvement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{mockMetrics.avgImprovement}%</div>
                    <div className="text-xs text-muted-foreground">Performance boost</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Time Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{mockMetrics.timeSaved}</div>
                    <div className="text-xs text-muted-foreground">Developer time</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>
                    Advanced analysis of your database performance patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-blue-900">Index Optimization Opportunity</div>
                        <div className="text-sm text-blue-700">
                          Adding composite index on (user_id, created_at) could improve 23 queries by ~65%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-green-900">Query Pattern Detected</div>
                        <div className="text-sm text-green-700">
                          Frequent LIKE operations could benefit from full-text search implementation
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <div className="font-medium text-yellow-900">N+1 Query Warning</div>
                        <div className="text-sm text-yellow-700">
                          Detected potential N+1 pattern in user profile queries - consider eager loading
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">Ready to optimize your database?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This is just a preview. Get started with your own database and see real optimization results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={handleStartDemo}
                  size="lg"
                  className="min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl"
                >
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="min-w-[200px] h-12 text-base font-semibold"
                >
                  Sign Up
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
