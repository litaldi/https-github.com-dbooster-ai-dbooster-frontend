
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { nextGenAIService, AIOptimizationResult } from '@/services/ai/nextGenAIService';

export function PredictiveQueryOptimizer() {
  const [query, setQuery] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<AIOptimizationResult | null>(null);

  const handleOptimize = async () => {
    if (!query.trim()) return;

    setIsOptimizing(true);
    try {
      await nextGenAIService.initialize();
      const result = await nextGenAIService.optimizeQueryWithPrediction(query);
      setOptimization(result);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Predictive Query Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SQL Query to Optimize</label>
          <Textarea
            placeholder="Enter your SQL query for AI-powered optimization and performance prediction..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="font-mono text-sm"
          />
        </div>

        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing || !query.trim()}
          className="w-full"
        >
          {isOptimizing ? (
            <>
              <Brain className="h-4 w-4 mr-2 animate-pulse" />
              Analyzing & Optimizing...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Optimize with AI Prediction
            </>
          )}
        </Button>

        <AnimatePresence>
          {optimization && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Optimized Query */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Optimized Query</h4>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {Math.round(optimization.confidenceScore * 100)}% confidence
                  </Badge>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {optimization.optimizedQuery}
                  </pre>
                </div>
              </div>

              {/* Performance Prediction */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Prediction
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {optimization.performancePrediction.executionTime}ms
                    </div>
                    <div className="text-sm text-blue-600">Execution Time</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {optimization.performancePrediction.resourceUsage}%
                    </div>
                    <div className="text-sm text-green-600">Resource Usage</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {optimization.performancePrediction.scalabilityScore}/100
                    </div>
                    <div className="text-sm text-purple-600">Scalability Score</div>
                  </div>
                </div>

                {optimization.performancePrediction.bottlenecks.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Potential Bottlenecks</h5>
                    <div className="space-y-1">
                      {optimization.performancePrediction.bottlenecks.map((bottleneck, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          <span>{bottleneck}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Index Recommendations */}
              {optimization.indexRecommendations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Index Recommendations</h4>
                  <div className="space-y-2">
                    {optimization.indexRecommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{rec.table}</span>
                          <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'}>
                            {rec.impact} impact
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Columns: {rec.columns.join(', ')} ({rec.type})
                        </div>
                        <div className="text-sm text-green-600">
                          {rec.estimatedImprovement}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Assessment */}
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${getRiskColor(optimization.riskAssessment.level)}`} />
                  Risk Assessment
                </h4>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={optimization.riskAssessment.level === 'low' ? 'secondary' : 'destructive'}>
                      {optimization.riskAssessment.level.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {optimization.riskAssessment.factors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
