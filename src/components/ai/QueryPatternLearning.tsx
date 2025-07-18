
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, TrendingUp, Target, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Pattern {
  id: string;
  name: string;
  description: string;
  usage: number;
  performance: 'excellent' | 'good' | 'fair' | 'poor';
  example: string;
}

interface QueryPatternLearningProps {
  onApplyPattern: (pattern: string) => void;
}

export function QueryPatternLearning({ onApplyPattern }: QueryPatternLearningProps) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLearning, setIsLearning] = useState(false);

  useEffect(() => {
    loadPatterns();
  }, []);

  const loadPatterns = async () => {
    setIsLearning(true);
    
    // Simulate pattern learning
    setTimeout(() => {
      const mockPatterns: Pattern[] = [
        {
          id: '1',
          name: 'User Activity Query',
          description: 'Common pattern for fetching active users with recent activity',
          usage: 85,
          performance: 'excellent',
          example: 'SELECT u.* FROM users u WHERE u.last_login > NOW() - INTERVAL \'30 days\' AND u.status = \'active\''
        },
        {
          id: '2',
          name: 'Paginated Results',
          description: 'Efficient pagination pattern with offset and limit',
          usage: 72,
          performance: 'good',
          example: 'SELECT * FROM products ORDER BY created_at DESC LIMIT 20 OFFSET 0'
        },
        {
          id: '3',
          name: 'Aggregated Reports',
          description: 'Pattern for generating summary reports with grouping',
          usage: 56,
          performance: 'good',
          example: 'SELECT DATE(created_at) as date, COUNT(*) as count FROM orders GROUP BY DATE(created_at)'
        },
        {
          id: '4',
          name: 'Nested Subqueries',
          description: 'Complex queries with subqueries - needs optimization',
          usage: 23,
          performance: 'fair',
          example: 'SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE status = \'completed\')'
        }
      ];
      setPatterns(mockPatterns);
      setIsLearning(false);
    }, 1500);
  };

  const getPerformanceBadge = (performance: string) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800',
      good: 'bg-blue-100 text-blue-800',
      fair: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800'
    };
    return colors[performance as keyof typeof colors] || colors.fair;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Query Pattern Learning
          </CardTitle>
          <Button 
            onClick={loadPatterns} 
            disabled={isLearning}
            variant="outline"
            size="sm"
          >
            {isLearning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Learning...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Refresh Patterns
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{pattern.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getPerformanceBadge(pattern.performance)}>
                        {pattern.performance}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{pattern.usage}% usage</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {pattern.example}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onApplyPattern(pattern.example)}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Use Pattern
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
