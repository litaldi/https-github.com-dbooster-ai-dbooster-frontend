
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Database, TrendingUp } from 'lucide-react';

export default function AIStudio() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Studio</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered database optimization tools
          </p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <Brain className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Query Optimizer
            </CardTitle>
            <CardDescription>
              Intelligent SQL query optimization with AI recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Analyze and optimize your database queries using advanced AI algorithms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-600" />
              Schema Analyzer
            </CardTitle>
            <CardDescription>
              AI-driven database schema optimization suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get intelligent recommendations for improving your database structure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Performance Predictor
            </CardTitle>
            <CardDescription>
              Predict query performance before execution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use AI to predict and optimize query performance metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
