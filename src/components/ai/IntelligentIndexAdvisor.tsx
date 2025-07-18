
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, TrendingUp, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IndexRecommendation {
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist';
  impact: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedImprovement: string;
  queryPatterns: string[];
}

export function IntelligentIndexAdvisor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<IndexRecommendation[]>([]);

  const analyzeIndexes = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockRecommendations: IndexRecommendation[] = [
        {
          table: 'users',
          columns: ['email'],
          type: 'btree',
          impact: 'high',
          reasoning: 'Email lookups are frequent in authentication queries',
          estimatedImprovement: '85% faster login queries',
          queryPatterns: ['WHERE email = ?', 'JOIN ON users.email']
        },
        {
          table: 'orders',
          columns: ['user_id', 'created_at'],
          type: 'btree',
          impact: 'high',
          reasoning: 'Composite index for user order history queries',
          estimatedImprovement: '70% faster user dashboard',
          queryPatterns: ['WHERE user_id = ? ORDER BY created_at', 'WHERE user_id = ? AND created_at > ?']
        },
        {
          table: 'products',
          columns: ['category_id', 'price'],
          type: 'btree',
          impact: 'medium',
          reasoning: 'Frequently used in product filtering and sorting',
          estimatedImprovement: '45% faster product searches',
          queryPatterns: ['WHERE category_id = ? ORDER BY price', 'WHERE category_id = ? AND price BETWEEN ? AND ?']
        },
        {
          table: 'order_items',
          columns: ['product_id'],
          type: 'btree',
          impact: 'medium',
          reasoning: 'Join performance optimization for product analytics',
          estimatedImprovement: '40% faster analytics queries',
          queryPatterns: ['JOIN order_items ON product_id', 'WHERE product_id IN (...)']
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return AlertTriangle;
      case 'medium': return TrendingUp;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Intelligent Index Advisor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Database className="h-4 w-4" />
          <AlertDescription>
            AI analyzes your query patterns to recommend optimal indexes for better performance.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={analyzeIndexes} 
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Zap className="h-4 w-4 mr-2 animate-pulse" />
              Analyzing Query Patterns...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Analyze & Recommend Indexes
            </>
          )}
        </Button>

        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Index Recommendations</h4>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {recommendations.length} recommendations
                </Badge>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, index) => {
                  const ImpactIcon = getImpactIcon(rec.impact);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 bg-card"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ImpactIcon className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {rec.table}.({rec.columns.join(', ')})
                            </span>
                            <Badge className={`text-xs ${getImpactColor(rec.impact)}`}>
                              {rec.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {rec.type.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {rec.estimatedImprovement}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            Optimizes query patterns:
                          </span>
                          <div className="space-y-1">
                            {rec.queryPatterns.map((pattern, patternIndex) => (
                              <div
                                key={patternIndex}
                                className="text-xs font-mono bg-muted/50 p-1 rounded"
                              >
                                {pattern}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Generate SQL
                        </Button>
                        <Button size="sm" variant="outline">
                          Apply Index
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Apply All High Impact
                </Button>
                <Button size="sm" variant="outline">
                  Export Recommendations
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
