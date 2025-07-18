
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Clock, Database, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface CostPrediction {
  executionCost: {
    cpuCost: number;
    memoryUsage: number;
    diskIO: number;
    networkUsage: number;
  };
  performance: {
    estimatedTime: string;
    rowsProcessed: number;
    planComplexity: 'simple' | 'moderate' | 'complex' | 'very_complex';
  };
  optimization: {
    suggestions: string[];
    potentialSavings: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
  scalability: {
    score: number;
    dataGrowthImpact: string;
    recommendations: string[];
  };
}

export function QueryCostPredictor() {
  const [query, setQuery] = useState('');
  const [prediction, setPrediction] = useState<CostPrediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictCost = async () => {
    if (!query.trim()) return;

    setIsPredicting(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      
      // Mock prediction for demonstration
      const mockPrediction: CostPrediction = {
        executionCost: {
          cpuCost: 75,
          memoryUsage: 45,
          diskIO: 60,
          networkUsage: 25
        },
        performance: {
          estimatedTime: '120ms',
          rowsProcessed: 15000,
          planComplexity: 'moderate'
        },
        optimization: {
          suggestions: [
            'Add index on user_id column',
            'Consider using LIMIT for large result sets',
            'Use specific columns instead of SELECT *'
          ],
          potentialSavings: '40% reduction in execution time',
          riskLevel: 'low'
        },
        scalability: {
          score: 78,
          dataGrowthImpact: 'Linear increase with table size',
          recommendations: [
            'Implement query result caching',
            'Consider data partitioning for large tables'
          ]
        }
      };

      setPrediction(mockPrediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    } finally {
      setIsPredicting(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'complex': return 'bg-orange-500';
      case 'very_complex': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
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
          <DollarSign className="h-5 w-5 text-primary" />
          Query Cost Predictor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SQL Query</label>
          <Textarea
            placeholder="Enter your SQL query to predict execution cost and performance..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
            className="font-mono text-sm"
          />
        </div>

        <Button onClick={predictCost} disabled={isPredicting || !query.trim()}>
          {isPredicting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2" />
              Predict Cost
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-bold">{prediction.performance.estimatedTime}</div>
                    <div className="text-xs text-muted-foreground">Execution Time</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Database className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-lg font-bold">{prediction.performance.rowsProcessed.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Rows Processed</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Badge className={`${getComplexityColor(prediction.performance.planComplexity)} text-white mb-2`}>
                      {prediction.performance.planComplexity.replace('_', ' ')}
                    </Badge>
                    <div className="text-xs text-muted-foreground">Plan Complexity</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold">{prediction.scalability.score}%</div>
                    <div className="text-xs text-muted-foreground">Scalability Score</div>
                    <Progress value={prediction.scalability.score} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Resource Usage</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Cost</span>
                      <span>{prediction.executionCost.cpuCost}%</span>
                    </div>
                    <Progress value={prediction.executionCost.cpuCost} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>{prediction.executionCost.memoryUsage}%</span>
                    </div>
                    <Progress value={prediction.executionCost.memoryUsage} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disk I/O</span>
                      <span>{prediction.executionCost.diskIO}%</span>
                    </div>
                    <Progress value={prediction.executionCost.diskIO} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network Usage</span>
                      <span>{prediction.executionCost.networkUsage}%</span>
                    </div>
                    <Progress value={prediction.executionCost.networkUsage} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Optimization Opportunities</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getRiskColor(prediction.optimization.riskLevel)}>
                      {prediction.optimization.riskLevel} risk
                    </Badge>
                    <span className="text-sm text-green-600">{prediction.optimization.potentialSavings}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Suggestions:</h4>
                    <ul className="space-y-1">
                      {prediction.optimization.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Scalability:</h4>
                    <p className="text-sm text-muted-foreground">{prediction.scalability.dataGrowthImpact}</p>
                    <ul className="space-y-1">
                      {prediction.scalability.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
