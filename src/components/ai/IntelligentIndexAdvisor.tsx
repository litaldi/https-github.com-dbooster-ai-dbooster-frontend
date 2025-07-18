
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, TrendingUp, Database, RefreshCw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IndexRecommendation {
  table: string;
  columns: string[];
  type: string;
  impact: 'high' | 'medium' | 'low';
  estimatedImprovement: string;
  reasoning: string;
  sqlCommand: string;
}

export function IntelligentIndexAdvisor() {
  const [recommendations, setRecommendations] = useState<IndexRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [appliedIndexes, setAppliedIndexes] = useState<Set<string>>(new Set());

  const analyzeIndexes = async () => {
    setIsAnalyzing(true);
    
    // Simulate index analysis
    setTimeout(() => {
      const mockRecommendations: IndexRecommendation[] = [
        {
          table: 'users',
          columns: ['email', 'status'],
          type: 'btree',
          impact: 'high',
          estimatedImprovement: '75% faster login queries',
          reasoning: 'Frequent WHERE clauses on email and status combination',
          sqlCommand: 'CREATE INDEX idx_users_email_status ON users(email, status);'
        },
        {
          table: 'orders',
          columns: ['user_id', 'created_at'],
          type: 'btree',
          impact: 'high',
          estimatedImprovement: '60% faster user order history',
          reasoning: 'Common pattern for fetching user orders ordered by date',
          sqlCommand: 'CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);'
        },
        {
          table: 'products',
          columns: ['category_id', 'price'],
          type: 'btree',
          impact: 'medium',
          estimatedImprovement: '40% faster category browsing',
          reasoning: 'Products are often filtered by category and sorted by price',
          sqlCommand: 'CREATE INDEX idx_products_category_price ON products(category_id, price);'
        },
        {
          table: 'search_logs',
          columns: ['search_term'],
          type: 'gin',
          impact: 'medium',
          estimatedImprovement: '50% faster text search',
          reasoning: 'GIN index optimal for full-text search operations',
          sqlCommand: 'CREATE INDEX idx_search_logs_term_gin ON search_logs USING gin(to_tsvector(\'english\', search_term));'
        }
      ];
      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  const applyIndex = (recommendation: IndexRecommendation) => {
    // Simulate applying the index
    const key = `${recommendation.table}_${recommendation.columns.join('_')}`;
    setAppliedIndexes(prev => new Set([...prev, key]));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      case 'low': return <TrendingUp className="h-4 w-4 text-green-600" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Intelligent Index Advisor
          </CardTitle>
          <Button 
            onClick={analyzeIndexes} 
            disabled={isAnalyzing}
            variant="outline"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Analyze Database
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Database className="h-4 w-4 animate-pulse" />
            <span>Analyzing query patterns and table statistics...</span>
          </div>
        )}

        <AnimatePresence>
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-sm text-muted-foreground mb-4">
                Found {recommendations.length} optimization opportunities
              </div>

              {recommendations.map((rec, index) => {
                const key = `${rec.table}_${rec.columns.join('_')}`;
                const isApplied = appliedIndexes.has(key);

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${isApplied ? 'bg-green-50 border-green-200' : ''}`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          <span className="font-semibold">{rec.table}</span>
                          <Badge variant="outline" className="font-mono text-xs">
                            {rec.columns.join(', ')}
                          </Badge>
                          <Badge variant="outline">{rec.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getImpactColor(rec.impact) as any}>
                            {getImpactIcon(rec.impact)}
                            {rec.impact} impact
                          </Badge>
                          {isApplied && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-green-600">
                            Expected improvement: {rec.estimatedImprovement}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rec.reasoning}
                        </p>
                      </div>

                      <Alert>
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="font-mono text-xs bg-muted p-2 rounded">
                              {rec.sqlCommand}
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => applyIndex(rec)}
                          disabled={isApplied}
                          variant={isApplied ? "outline" : "default"}
                        >
                          {isApplied ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Applied
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Apply Index
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {!isAnalyzing && recommendations.length === 0 && (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Click "Analyze Database" to get intelligent index recommendations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
