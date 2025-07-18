
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Zap, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface OptimizationResult {
  optimizedQuery: string;
  performancePrediction: {
    executionTime: number;
    resourceUsage: number;
    scalabilityScore: number;
    bottlenecks: string[];
  };
  indexRecommendations: Array<{
    table: string;
    columns: string[];
    type: string;
    impact: 'high' | 'medium' | 'low';
    estimatedImprovement: string;
  }>;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  confidenceScore: number;
}

export function PredictiveQueryOptimizer() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    if (!query.trim()) return;

    setIsOptimizing(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      const optimization = await nextGenAIService.optimizeQueryWithPrediction(query);
      setResult(optimization);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed');
      console.error('Query optimization failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Predictive Query Optimizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SQL Query to Optimize</label>
          <Textarea
            placeholder="Paste your SQL query here for AI-powered optimization and performance prediction..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        </div>
        
        <Button onClick={handleOptimize} disabled={isOptimizing || !query.trim()}>
          {isOptimizing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Optimizing & Predicting...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Optimize Query
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Estimated Time</p>
                      <p className="text-2xl font-bold">{result.performancePrediction.executionTime}ms</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-muted-foreground">Resource Usage</p>
                      <p className="text-2xl font-bold">{result.performancePrediction.resourceUsage}%</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-sm text-muted-foreground">Scalability</p>
                      <p className={`text-2xl font-bold ${getScoreColor(result.performancePrediction.scalabilityScore)}`}>
                        {result.performancePrediction.scalabilityScore}/100
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className={`text-2xl font-bold ${getScoreColor(result.confidenceScore * 100)}`}>
                        {Math.round(result.confidenceScore * 100)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Assessment */}
              <div className={`p-4 rounded-lg border-2 ${getRiskColor(result.riskAssessment.level)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-semibold capitalize">
                    Risk Level: {result.riskAssessment.level}
                  </span>
                </div>
                {result.riskAssessment.factors.length > 0 && (
                  <ul className="text-sm space-y-1">
                    {result.riskAssessment.factors.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Optimized Query */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Optimized Query</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">{result.optimizedQuery}</pre>
                </div>
              </div>

              {/* Bottlenecks */}
              {result.performancePrediction.bottlenecks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Identified Bottlenecks</h3>
                  <div className="space-y-2">
                    {result.performancePrediction.bottlenecks.map((bottleneck, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{bottleneck}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Index Recommendations */}
              {result.indexRecommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Index Recommendations</h3>
                  <div className="space-y-3">
                    {result.indexRecommendations.map((rec, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{rec.table}</span>
                            <Badge variant="outline">{rec.columns.join(', ')}</Badge>
                            <Badge variant="outline">{rec.type}</Badge>
                          </div>
                          <Badge variant={getImpactColor(rec.impact) as any}>
                            {rec.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-green-600">{rec.estimatedImprovement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
