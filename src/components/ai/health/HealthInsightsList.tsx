
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { DatabaseHealthInsight } from '@/services/ai/nextGenAIService';

interface HealthInsightsListProps {
  insights: DatabaseHealthInsight[];
  onApplyRecommendation?: (insight: DatabaseHealthInsight) => void;
}

export function HealthInsightsList({ insights, onApplyRecommendation }: HealthInsightsListProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Info className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-red-100 text-red-800';
      case 'optimization': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">All Systems Healthy!</h3>
        <p className="text-muted-foreground">
          No health issues detected in your database. Keep up the good work!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Health Insights & Recommendations</h3>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getPriorityIcon(insight.priority)}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold">{insight.title}</h4>
                          <Badge variant={getPriorityColor(insight.priority) as any}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline" className={getCategoryColor(insight.category)}>
                            {insight.category}
                          </Badge>
                          {insight.automatable && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              <Zap className="h-3 w-3 mr-1" />
                              Auto-fixable
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-green-700">Recommendation:</strong>
                      <p className="text-muted-foreground mt-1">{insight.recommendation}</p>
                    </div>
                    <div>
                      <strong className="text-blue-700">Expected Impact:</strong>
                      <p className="text-muted-foreground mt-1">{insight.estimatedImpact}</p>
                    </div>
                  </div>

                  {onApplyRecommendation && (
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        variant={insight.automatable ? "default" : "outline"}
                        onClick={() => onApplyRecommendation(insight)}
                      >
                        {insight.automatable ? (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Auto-Apply Fix
                          </>
                        ) : (
                          'Mark as Reviewed'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
