
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, AlertTriangle, TrendingDown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface BottleneckAnalysis {
  bottlenecks: Array<{
    type: 'query' | 'index' | 'connection' | 'memory' | 'disk';
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    impact: number;
    recommendation: string;
    estimatedFix: string;
  }>;
  overallScore: number;
  trend: 'improving' | 'stable' | 'degrading';
}

export function PerformanceBottleneckAnalyzer() {
  const [analysis, setAnalysis] = useState<BottleneckAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeBottlenecks = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      
      // Mock analysis for demonstration
      const mockAnalysis: BottleneckAnalysis = {
        bottlenecks: [
          {
            type: 'query',
            severity: 'high',
            description: 'Slow SELECT queries on large tables without proper indexing',
            impact: 85,
            recommendation: 'Add composite indexes on frequently queried columns',
            estimatedFix: '60% performance improvement'
          },
          {
            type: 'connection',
            severity: 'medium',
            description: 'Connection pool exhaustion during peak hours',
            impact: 65,
            recommendation: 'Increase connection pool size and implement connection pooling',
            estimatedFix: '30% improvement in concurrent handling'
          },
          {
            type: 'memory',
            severity: 'low',
            description: 'Suboptimal buffer cache configuration',
            impact: 25,
            recommendation: 'Adjust shared_buffers and work_mem settings',
            estimatedFix: '15% memory efficiency gain'
          }
        ],
        overallScore: 72,
        trend: 'degrading'
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'query': return <Zap className="h-4 w-4" />;
      case 'index': return <TrendingDown className="h-4 w-4" />;
      case 'connection': return <AlertTriangle className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Performance Bottleneck Analyzer
          </CardTitle>
          <Button onClick={analyzeBottlenecks} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyze Performance
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{analysis.overallScore}</div>
                    <div className="text-sm text-muted-foreground">Performance Score</div>
                    <Progress value={analysis.overallScore} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{analysis.bottlenecks.length}</div>
                    <div className="text-sm text-muted-foreground">Issues Found</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Badge variant={analysis.trend === 'improving' ? 'default' : 'destructive'}>
                      {analysis.trend}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-2">Trend</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identified Bottlenecks</h3>
              {analysis.bottlenecks.map((bottleneck, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(bottleneck.type)}
                      <span className="capitalize font-medium">{bottleneck.type} Issue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${getSeverityColor(bottleneck.severity)} text-white`}>
                        {bottleneck.severity}
                      </Badge>
                      <Badge variant="outline">
                        {bottleneck.impact}% impact
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{bottleneck.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Recommendation:</strong>
                      <p className="text-muted-foreground">{bottleneck.recommendation}</p>
                    </div>
                    <div>
                      <strong>Expected Improvement:</strong>
                      <p className="text-green-600">{bottleneck.estimatedFix}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
