import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Wand2, TrendingUp, User, Zap, Target, Database } from 'lucide-react';
import { SmartQueryAnalyzer } from '@/components/ai/SmartQueryAnalyzer';
import { PersonalizedRecommendations } from '@/components/ai/PersonalizedRecommendations';
import { PredictivePerformanceMonitor } from '@/components/ai/PredictivePerformanceMonitor';
import { AIQueryGenerator } from '@/components/ai/AIQueryGenerator';
import { AICodeReview } from '@/components/ai/AICodeReview';
import { SmartSchemaAnalyzer } from '@/components/ai/SmartSchemaAnalyzer';
import { IntelligentQueryBuilder } from '@/components/ai/IntelligentQueryBuilder';

export default function AIFeatures() {
  const features = [
    {
      icon: Brain,
      title: "Smart Query Analysis",
      description: "AI-powered analysis of your SQL queries with optimization suggestions and security insights",
      count: "Advanced AI"
    },
    {
      icon: Wand2,
      title: "Natural Language to SQL",
      description: "Generate optimized SQL queries from plain English descriptions",
      count: "Magic ✨"
    },
    {
      icon: TrendingUp,
      title: "Predictive Monitoring",
      description: "Machine learning-powered performance predictions and proactive alerts",
      count: "Future-Ready"
    },
    {
      icon: User,
      title: "Personalized Recommendations",
      description: "Tailored suggestions based on your query patterns and skill level",
      count: "Just for You"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI-Powered Features
          </h1>
          <p className="text-muted-foreground">
            Harness the power of artificial intelligence to optimize your database performance
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Zap className="h-3 w-3 mr-1" />
          Powered by Advanced AI
        </Badge>
      </div>

      {/* Feature Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <feature.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-2">{feature.description}</CardDescription>
              <Badge variant="secondary" className="text-xs">
                {feature.count}
              </Badge>
            </CardContent>
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full -mr-8 -mt-8" />
          </Card>
        ))}
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="analyzer" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Query Analyzer</span>
            <span className="sm:hidden">Analyzer</span>
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">Query Generator</span>
            <span className="sm:hidden">Generator</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Performance Monitor</span>
            <span className="sm:hidden">Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Recommendations</span>
            <span className="sm:hidden">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="code-review" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Code Review</span>
            <span className="sm:hidden">Review</span>
          </TabsTrigger>
          <TabsTrigger value="schema" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Schema Analyzer</span>
            <span className="sm:hidden">Schema</span>
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Query Builder</span>
            <span className="sm:hidden">Builder</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer">
          <SmartQueryAnalyzer />
        </TabsContent>

        <TabsContent value="generator">
          <AIQueryGenerator />
        </TabsContent>

        <TabsContent value="monitor">
          <PredictivePerformanceMonitor />
        </TabsContent>

        <TabsContent value="recommendations">
          <PersonalizedRecommendations />
        </TabsContent>

        <TabsContent value="code-review">
          <AICodeReview />
        </TabsContent>

        <TabsContent value="schema">
          <SmartSchemaAnalyzer />
        </TabsContent>

        <TabsContent value="builder">
          <IntelligentQueryBuilder />
        </TabsContent>
      </Tabs>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Getting Started with AI Features
          </CardTitle>
          <CardDescription>
            Make the most of DBooster's AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">1. Analyze Your Queries</h3>
              <p className="text-sm text-muted-foreground">
                Start by analyzing your existing SQL queries to identify optimization opportunities
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">2. Monitor Performance</h3>
              <p className="text-sm text-muted-foreground">
                Enable predictive monitoring to get ahead of performance issues
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <User className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">3. Follow Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Implement personalized suggestions to continuously improve your database performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
