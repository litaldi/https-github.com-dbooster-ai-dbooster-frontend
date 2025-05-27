
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Wand2, TrendingUp, User, Zap, Target, Database, Activity, Wrench, MessageSquare } from 'lucide-react';
import { SmartQueryAnalyzer } from '@/components/ai/SmartQueryAnalyzer';
import { PersonalizedRecommendations } from '@/components/ai/PersonalizedRecommendations';
import { PredictivePerformanceMonitor } from '@/components/ai/PredictivePerformanceMonitor';
import { AIQueryGenerator } from '@/components/ai/AIQueryGenerator';
import { AICodeReview } from '@/components/ai/AICodeReview';
import { SmartSchemaAnalyzer } from '@/components/ai/SmartSchemaAnalyzer';
import { IntelligentQueryBuilder } from '@/components/ai/IntelligentQueryBuilder';
import { AIPerformancePredictor } from '@/components/ai/AIPerformancePredictor';
import { SmartIndexAdvisor } from '@/components/ai/SmartIndexAdvisor';
import { AutomatedQueryFixer } from '@/components/ai/AutomatedQueryFixer';
import { NaturalLanguageQuery } from '@/components/ai/NaturalLanguageQuery';

export default function AIFeatures() {
  const features = [
    {
      icon: Brain,
      title: "Smart Query Analysis",
      description: "AI-powered analysis of your SQL queries with optimization suggestions and security insights",
      count: "Advanced AI"
    },
    {
      icon: MessageSquare,
      title: "Natural Language to SQL",
      description: "Generate optimized SQL queries from plain English descriptions",
      count: "Magic ✨"
    },
    {
      icon: Activity,
      title: "Performance Prediction",
      description: "Predict query performance before execution with detailed metrics",
      count: "Future-Ready"
    },
    {
      icon: Database,
      title: "Smart Index Advisor",
      description: "AI-powered index recommendations for optimal database performance",
      count: "Intelligent"
    },
    {
      icon: Wrench,
      title: "Automated Query Fixer",
      description: "Automatically detect and fix SQL issues, security vulnerabilities, and performance problems",
      count: "Auto-Fix"
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      <Tabs defaultValue="natural-language" className="space-y-6">
        <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-5 xl:grid-cols-10">
          <TabsTrigger value="natural-language" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Natural Language</span>
            <span className="sm:hidden">NL2SQL</span>
          </TabsTrigger>
          <TabsTrigger value="performance-predictor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Performance Predictor</span>
            <span className="sm:hidden">Predictor</span>
          </TabsTrigger>
          <TabsTrigger value="query-fixer" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Query Fixer</span>
            <span className="sm:hidden">Fixer</span>
          </TabsTrigger>
          <TabsTrigger value="index-advisor" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Index Advisor</span>
            <span className="sm:hidden">Indexes</span>
          </TabsTrigger>
          <TabsTrigger value="analyzer" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Query Analyzer</span>
            <span className="sm:hidden">Analyzer</span>
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">Generator</span>
            <span className="sm:hidden">Gen</span>
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Monitor</span>
            <span className="sm:hidden">Mon</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Personal</span>
            <span className="sm:hidden">Rec</span>
          </TabsTrigger>
          <TabsTrigger value="code-review" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Review</span>
            <span className="sm:hidden">Rev</span>
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Builder</span>
            <span className="sm:hidden">Build</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="natural-language">
          <NaturalLanguageQuery />
        </TabsContent>

        <TabsContent value="performance-predictor">
          <AIPerformancePredictor />
        </TabsContent>

        <TabsContent value="query-fixer">
          <AutomatedQueryFixer />
        </TabsContent>

        <TabsContent value="index-advisor">
          <SmartIndexAdvisor />
        </TabsContent>

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
            Make the most of DBooster's comprehensive AI capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">1. Ask Questions</h3>
              <p className="text-sm text-muted-foreground">
                Start by asking questions in plain English to generate SQL queries instantly
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Activity className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">2. Predict Performance</h3>
              <p className="text-sm text-muted-foreground">
                Analyze query performance before execution to avoid costly operations
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Wrench className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">3. Auto-Fix Issues</h3>
              <p className="text-sm text-muted-foreground">
                Let AI automatically detect and fix SQL issues, security problems, and performance bottlenecks
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Database className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium mb-2">4. Optimize Indexes</h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent index recommendations to maximize your database performance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
