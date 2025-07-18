
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Settings, 
  CheckCircle,
  ExternalLink,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DatabaseHealthInsight } from '@/services/ai/nextGenAIService';

interface HealthInsightsListProps {
  insights: DatabaseHealthInsight[];
  onApplyRecommendation?: (insight: DatabaseHealthInsight) => void;
}

export function HealthInsightsList({ insights, onApplyRecommendation }: HealthInsightsListProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'optimization': return <Settings className="h-4 w-4" />;
      case 'maintenance': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'text-blue-600 bg-blue-50';
      case 'security': return 'text-red-600 bg-red-50';
      case 'optimization': return 'text-green-600 bg-green-50';
      case 'maintenance': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">All Systems Healthy</h3>
          <p className="text-muted-foreground text-center">
            No critical issues detected. Your database is performing optimally.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-l-4" 
                style={{ 
                  borderLeftColor: insight.priority === 'critical' ? '#ef4444' : 
                                  insight.priority === 'high' ? '#f97316' : 
                                  insight.priority === 'medium' ? '#eab308' : '#22c55e' 
                }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(insight.category)}`}>
                    {getCategoryIcon(insight.category)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getPriorityColor(insight.priority)}>
                        {insight.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {insight.category}
                      </Badge>
                      {insight.automatable && (
                        <Badge variant="secondary" className="text-xs">
                          Auto-fixable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{insight.description}</p>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Recommendation
                </h4>
                <p className="text-sm">{insight.recommendation}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Expected Impact:</span> {insight.estimatedImpact}
                </div>
                <div className="flex gap-2">
                  {insight.automatable && onApplyRecommendation && (
                    <Button 
                      size="sm" 
                      onClick={() => onApplyRecommendation(insight)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Auto-Apply
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Learn More
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
