
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Database,
  Shield,
  Wrench,
  Zap,
  Bot
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/animations';
import type { DatabaseHealthInsight } from '@/services/ai/nextGenAIService';

interface HealthInsightsListProps {
  insights: DatabaseHealthInsight[];
}

export const HealthInsightsList: React.FC<HealthInsightsListProps> = React.memo(({ insights }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'optimization': return <TrendingUp className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2 text-green-600">All Clear!</h3>
          <p className="text-muted-foreground">
            No health issues detected in your database system
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <StaggerContainer>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI Health Insights</h3>
        
        {insights.map((insight, index) => (
          <StaggerItem key={index} delay={index * 0.1}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-lg bg-gray-50">
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <Badge variant={getPriorityColor(insight.priority) as any}>
                          {getPriorityIcon(insight.priority)}
                          {insight.priority}
                        </Badge>
                        {insight.automatable && (
                          <Badge variant="outline" className="text-xs">
                            <Bot className="h-3 w-3 mr-1" />
                            Auto-fixable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                      <Alert className="mt-2">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Recommendation:</strong> {insight.recommendation}
                          <br />
                          <strong>Impact:</strong> {insight.estimatedImpact}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {insight.automatable && (
                    <Button size="sm" className="flex-1">
                      <Zap className="mr-2 h-3 w-3" />
                      Auto-Fix
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </div>
    </StaggerContainer>
  );
});

HealthInsightsList.displayName = 'HealthInsightsList';
