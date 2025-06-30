
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Heart, 
  Eye, 
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PredictiveQueryOptimizer } from '@/components/ai/PredictiveQueryOptimizer';
import { NaturalLanguageQueryBuilder } from '@/components/ai/NaturalLanguageQueryBuilder';
import { DatabaseHealthAssistant } from '@/components/ai/DatabaseHealthAssistant';
import { IntelligentAnomalyDetector } from '@/components/ai/IntelligentAnomalyDetector';
import { FadeIn } from '@/components/ui/animations';

export default function AIOptimizationStudio() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/app">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              AI Optimization Studio
              <Badge variant="secondary" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                Next-Gen AI
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Revolutionary AI-powered database optimization with predictive analytics and intelligent insights
            </p>
          </div>
        </div>
      </FadeIn>

      <Tabs defaultValue="optimizer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="optimizer" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Predictive Optimizer
          </TabsTrigger>
          <TabsTrigger value="natural-language" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Natural Language
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Health Assistant
          </TabsTrigger>
          <TabsTrigger value="anomaly" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Anomaly Detection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimizer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Predictive Query Optimization
              </CardTitle>
              <CardDescription>
                Advanced AI that predicts performance impact and optimizes queries before execution with machine learning-based recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PredictiveQueryOptimizer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="natural-language" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Natural Language to SQL
              </CardTitle>
              <CardDescription>
                Convert plain English descriptions into optimized SQL queries with context-aware AI understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NaturalLanguageQueryBuilder />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-600" />
                Database Health Assistant
              </CardTitle>
              <CardDescription>
                AI-powered health monitoring that proactively identifies issues and provides automated solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseHealthAssistant />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomaly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-orange-600" />
                Intelligent Anomaly Detection
              </CardTitle>
              <CardDescription>
                Machine learning-based anomaly detection with predictive forecasting and automated alerting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IntelligentAnomalyDetector />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
