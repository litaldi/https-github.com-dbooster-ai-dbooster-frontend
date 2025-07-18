
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, History, Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface QueryPattern {
  id: string;
  pattern: string;
  frequency: number;
  avgPerformance: number;
  lastUsed: string;
  category: 'frequent' | 'high-performance' | 'recent';
  template: string;
}

interface QueryPatternLearningProps {
  onApplyPattern: (pattern: string) => void;
}

export function QueryPatternLearning({ onApplyPattern }: QueryPatternLearningProps) {
  const [patterns, setPatterns] = useState<QueryPattern[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'frequent' | 'high-performance' | 'recent'>('all');

  useEffect(() => {
    // Simulate loading learned patterns
    const mockPatterns: QueryPattern[] = [
      {
        id: '1',
        pattern: 'User activity lookup',
        frequency: 45,
        avgPerformance: 95,
        lastUsed: '2 hours ago',
        category: 'frequent',
        template: 'SELECT u.name, u.email, COUNT(a.id) as activity_count FROM users u LEFT JOIN activities a ON u.id = a.user_id WHERE u.created_at > ? GROUP BY u.id ORDER BY activity_count DESC'
      },
      {
        id: '2',
        pattern: 'Monthly revenue analysis',
        frequency: 12,
        avgPerformance: 88,
        lastUsed: '1 day ago',
        category: 'high-performance',
        template: 'SELECT DATE_TRUNC(\'month\', created_at) as month, SUM(amount) as revenue FROM orders WHERE status = \'completed\' GROUP BY month ORDER BY month DESC'
      },
      {
        id: '3',
        pattern: 'Recent user signups',
        frequency: 23,
        avgPerformance: 92,
        lastUsed: '30 minutes ago',
        category: 'recent',
        template: 'SELECT * FROM users WHERE created_at >= NOW() - INTERVAL \'7 days\' ORDER BY created_at DESC'
      }
    ];
    
    setPatterns(mockPatterns);
  }, []);

  const filteredPatterns = patterns.filter(pattern => 
    activeCategory === 'all' || pattern.category === activeCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frequent': return Star;
      case 'high-performance': return TrendingUp;
      case 'recent': return History;
      default: return Brain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'frequent': return 'bg-yellow-100 text-yellow-800';
      case 'high-performance': return 'bg-green-100 text-green-800';
      case 'recent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Learned Query Patterns
        </CardTitle>
        <div className="flex gap-2 mt-3">
          {['all', 'frequent', 'high-performance', 'recent'].map((category) => (
            <Button
              key={category}
              size="sm"
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category as any)}
              className="text-xs capitalize"
            >
              {category.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredPatterns.map((pattern, index) => {
          const Icon = getCategoryIcon(pattern.category);
          return (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-sm">{pattern.pattern}</h4>
                    <Badge className={`text-xs ${getCategoryColor(pattern.category)}`}>
                      {pattern.category}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Used:</span> {pattern.frequency} times
                    </div>
                    <div>
                      <span className="font-medium">Performance:</span> {pattern.avgPerformance}%
                    </div>
                    <div>
                      <span className="font-medium">Last used:</span> {pattern.lastUsed}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                    {pattern.template.length > 100 
                      ? `${pattern.template.substring(0, 100)}...`
                      : pattern.template
                    }
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onApplyPattern(pattern.template)}
                  className="text-xs"
                >
                  Use Pattern
                </Button>
              </div>
            </motion.div>
          );
        })}
        
        {filteredPatterns.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No patterns found for this category</p>
            <p className="text-xs">AI will learn from your query usage over time</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
