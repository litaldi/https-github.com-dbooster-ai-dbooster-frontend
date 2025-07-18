
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Database, 
  Brain, 
  Shield, 
  Activity,
  Users,
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';

interface FeatureTest {
  category: string;
  name: string;
  description: string;
  status: 'implemented' | 'partial' | 'missing';
  component?: string;
  route?: string;
}

export function FeatureVerifier() {
  const [activeCategory, setActiveCategory] = useState('core');

  const features: FeatureTest[] = [
    // Core Optimization Features
    {
      category: 'core',
      name: 'AI-Powered Query Analysis',
      description: 'Intelligent analysis of SQL queries with optimization recommendations',
      status: 'implemented',
      component: 'QueryOptimizer',
      route: '/ai-studio'
    },
    {
      category: 'core',
      name: 'Real-Time Performance Monitoring',
      description: 'Live metrics and performance tracking across all connected databases',
      status: 'implemented',
      component: 'EnhancedRealTimeDashboard',
      route: '/app'
    },
    {
      category: 'core',
      name: 'Automated Index Recommendations',
      description: 'Smart indexing suggestions based on query patterns and usage',
      status: 'implemented',
      component: 'IndexRecommendations'
    },
    {
      category: 'core',
      name: 'Query Performance Benchmarking',
      description: 'Compare query performance before and after optimizations',
      status: 'implemented',
      component: 'PerformanceBenchmark'
    },

    // Database Support
    {
      category: 'database',
      name: 'PostgreSQL Support',
      description: 'Full support for PostgreSQL databases',
      status: 'implemented'
    },
    {
      category: 'database',
      name: 'MySQL Support',
      description: 'Full support for MySQL databases',
      status: 'partial'
    },
    {
      category: 'database',
      name: 'MongoDB Support',
      description: 'Full support for MongoDB databases',
      status: 'partial'
    },
    {
      category: 'database',
      name: 'SQL Server Support',
      description: 'Full support for SQL Server databases',
      status: 'partial'
    },
    {
      category: 'database',
      name: 'Oracle Database Support',
      description: 'Full support for Oracle databases',
      status: 'partial'
    },
    {
      category: 'database',
      name: 'Redis Support',
      description: 'Full support for Redis databases',
      status: 'partial'
    },

    // Enterprise Features
    {
      category: 'enterprise',
      name: 'Multi-Database Management',
      description: 'Centralized dashboard for all database connections',
      status: 'implemented',
      component: 'DatabaseManager'
    },
    {
      category: 'enterprise',
      name: 'Team Collaboration',
      description: 'Share optimizations and insights across development teams',
      status: 'partial',
      component: 'TeamCollaboration'
    },
    {
      category: 'enterprise',
      name: 'Security & Compliance',
      description: 'SOC2 Type II certified with enterprise-grade security',
      status: 'implemented',
      component: 'SecurityMonitoringDashboard',
      route: '/security'
    },
    {
      category: 'enterprise',
      name: 'Custom Integrations',
      description: 'API access for custom workflows and CI/CD integration',
      status: 'partial'
    },

    // AI Studio Features
    {
      category: 'ai',
      name: 'Natural Language Queries',
      description: 'Convert plain English to optimized SQL',
      status: 'implemented',
      component: 'NaturalLanguageQuery',
      route: '/ai-studio'
    },
    {
      category: 'ai',
      name: 'Interactive Query Builder',
      description: 'Visual query construction with AI assistance',
      status: 'implemented',
      component: 'QueryBuilder',
      route: '/ai-studio'
    },
    {
      category: 'ai',
      name: 'Performance Prediction',
      description: 'Forecast query performance before execution',
      status: 'implemented',
      component: 'PerformancePredictor'
    },
    {
      category: 'ai',
      name: 'Automated Code Review',
      description: 'AI-powered SQL code quality analysis',
      status: 'implemented',
      component: 'CodeReview'
    },

    // Authentication & User Management
    {
      category: 'auth',
      name: 'Email & Password Authentication',
      description: 'Standard secure authentication',
      status: 'implemented',
      route: '/login'
    },
    {
      category: 'auth',
      name: 'Demo Mode',
      description: 'Try all features with sample data',
      status: 'implemented',
      route: '/demo'
    },
    {
      category: 'auth',
      name: 'Social Authentication',
      description: 'Google and GitHub login integration',
      status: 'partial'
    },
    {
      category: 'auth',
      name: 'Password Recovery',
      description: 'Secure password reset functionality',
      status: 'implemented'
    },
    {
      category: 'auth',
      name: 'Account Registration',
      description: 'New user signup with email verification',
      status: 'implemented',
      route: '/login'
    }
  ];

  const getStatusIcon = (status: FeatureTest['status']) => {
    switch (status) {
      case 'implemented':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: FeatureTest['status']) => {
    switch (status) {
      case 'implemented':
        return <Badge variant="outline" className="text-green-600 border-green-600">Implemented</Badge>;
      case 'partial':
        return <Badge variant="secondary">Partial</Badge>;
      default:
        return <Badge variant="destructive">Missing</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core':
        return <Zap className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'enterprise':
        return <Shield className="h-4 w-4" />;
      case 'ai':
        return <Brain className="h-4 w-4" />;
      case 'auth':
        return <Users className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const categories = [
    { key: 'core', name: 'Core Features', icon: <Zap className="h-4 w-4" /> },
    { key: 'database', name: 'Database Support', icon: <Database className="h-4 w-4" /> },
    { key: 'enterprise', name: 'Enterprise', icon: <Shield className="h-4 w-4" /> },
    { key: 'ai', name: 'AI Studio', icon: <Brain className="h-4 w-4" /> },
    { key: 'auth', name: 'Authentication', icon: <Users className="h-4 w-4" /> }
  ];

  const getFeaturesByCategory = (category: string) => {
    return features.filter(f => f.category === category);
  };

  const getCategorySummary = (category: string) => {
    const categoryFeatures = getFeaturesByCategory(category);
    const implemented = categoryFeatures.filter(f => f.status === 'implemented').length;
    const partial = categoryFeatures.filter(f => f.status === 'partial').length;
    const total = categoryFeatures.length;

    return { implemented, partial, total };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Feature Implementation Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5">
            {categories.map(category => {
              const summary = getCategorySummary(category.key);
              return (
                <TabsTrigger 
                  key={category.key} 
                  value={category.key}
                  className="flex flex-col gap-1 min-h-[60px]"
                >
                  <div className="flex items-center gap-1">
                    {category.icon}
                    <span className="hidden sm:inline text-xs">{category.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {summary.implemented}/{summary.total}
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.key} value={category.key} className="space-y-4">
              <div className="grid gap-3">
                {getFeaturesByCategory(category.key).map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(feature.status)}
                      <div className="flex-1">
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-sm text-muted-foreground">{feature.description}</div>
                        {feature.component && (
                          <div className="text-xs text-blue-600 mt-1">
                            Component: {feature.component}
                          </div>
                        )}
                        {feature.route && (
                          <div className="text-xs text-purple-600 mt-1">
                            Route: {feature.route}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(feature.status)}
                      {feature.route && (
                        <Button asChild variant="ghost" size="sm">
                          <a href={feature.route} target="_blank" rel="noopener noreferrer">
                            <Activity className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Overall Summary */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-3">Overall Implementation Status</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {features.filter(f => f.status === 'implemented').length}
              </div>
              <div className="text-sm text-muted-foreground">Implemented</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {features.filter(f => f.status === 'partial').length}
              </div>
              <div className="text-sm text-muted-foreground">Partial</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {features.filter(f => f.status === 'missing').length}
              </div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
