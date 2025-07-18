
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle2, XCircle, AlertTriangle, Zap, Clock, HardDrive } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  message?: string;
  duration?: number;
  value?: number;
}

interface PerformanceMetric {
  name: string;
  description: string;
  unit: string;
  goodThreshold: number;
  warningThreshold: number;
  testFunction: () => Promise<number>;
}

interface PerformanceTesterProps {
  onResults: (results: TestResult[]) => void;
}

export function PerformanceTester({ onResults }: PerformanceTesterProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(0);

  const performanceMetrics: PerformanceMetric[] = [
    {
      name: 'First Contentful Paint',
      description: 'Time until first DOM element is rendered',
      unit: 'ms',
      goodThreshold: 1800,
      warningThreshold: 3000,
      testFunction: async () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : 0;
      }
    },
    {
      name: 'Largest Contentful Paint',
      description: 'Time until largest content element is rendered',
      unit: 'ms',
      goodThreshold: 2500,
      warningThreshold: 4000,
      testFunction: async () => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            resolve(lastEntry ? lastEntry.startTime : 0);
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          
          // Fallback after 5 seconds
          setTimeout(() => resolve(0), 5000);
        });
      }
    },
    {
      name: 'Time to Interactive',
      description: 'Time until page becomes fully interactive',
      unit: 'ms',
      goodThreshold: 3800,
      warningThreshold: 7300,
      testFunction: async () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return navigation ? navigation.domInteractive - navigation.fetchStart : 0;
      }
    },
    {
      name: 'Bundle Size',
      description: 'Total JavaScript bundle size',
      unit: 'KB',
      goodThreshold: 250,
      warningThreshold: 500,
      testFunction: async () => {
        const resources = performance.getEntriesByType('resource');
        const jsResources = resources.filter(r => r.name.includes('.js'));
        const totalSize = jsResources.reduce((sum, resource) => {
          return sum + ((resource as PerformanceResourceTiming).transferSize || 0);
        }, 0);
        return Math.round(totalSize / 1024); // Convert to KB
      }
    },
    {
      name: 'Memory Usage',
      description: 'Current JavaScript heap memory usage',
      unit: 'MB',
      goodThreshold: 50,
      warningThreshold: 100,
      testFunction: async () => {
        const memoryInfo = (performance as any).memory;
        if (memoryInfo) {
          return Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
        }
        return 0;
      }
    },
    {
      name: 'DOM Nodes',
      description: 'Total number of DOM elements',
      unit: 'nodes',
      goodThreshold: 1500,
      warningThreshold: 3000,
      testFunction: async () => {
        return document.querySelectorAll('*').length;
      }
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];
    let totalScore = 0;
    let scoredTests = 0;

    for (const metric of performanceMetrics) {
      const result: TestResult = {
        id: `perf-${metric.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: metric.name,
        status: 'running'
      };
      
      testResults.push(result);
      setResults([...testResults]);

      const startTime = Date.now();
      
      try {
        const value = await metric.testFunction();
        result.value = value;
        result.duration = Date.now() - startTime;
        
        // Determine status based on thresholds
        if (value <= metric.goodThreshold) {
          result.status = 'passed';
          result.message = `${value}${metric.unit} (Good)`;
          totalScore += 100;
        } else if (value <= metric.warningThreshold) {
          result.status = 'warning';
          result.message = `${value}${metric.unit} (Needs Improvement)`;
          totalScore += 50;
        } else {
          result.status = 'failed';
          result.message = `${value}${metric.unit} (Poor)`;
          totalScore += 0;
        }
        
        scoredTests++;
      } catch (error) {
        result.status = 'failed';
        result.message = error instanceof Error ? error.message : 'Performance test failed';
        result.duration = Date.now() - startTime;
      }
      
      const updatedResults = testResults.map(r => 
        r.id === result.id ? result : r
      );
      setResults(updatedResults);
      onResults(updatedResults);
    }

    // Calculate overall performance score
    const averageScore = scoredTests > 0 ? Math.round(totalScore / scoredTests) : 0;
    setPerformanceScore(averageScore);
    setIsRunning(false);
  };

  const runSingleTest = async (metric: PerformanceMetric) => {
    console.log(`Testing ${metric.name}...`);
    try {
      const value = await metric.testFunction();
      const status = value <= metric.goodThreshold ? 'Good' : 
                    value <= metric.warningThreshold ? 'Warning' : 'Poor';
      console.log(`${status === 'Good' ? '✅' : status === 'Warning' ? '⚠️' : '❌'} ${metric.name}: ${value}${metric.unit} (${status})`);
    } catch (error) {
      console.error(`❌ ${metric.name}:`, error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return CheckCircle2;
      case 'failed': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Test performance metrics including Core Web Vitals and resource optimization
        </p>
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Performance Tests'}
        </Button>
      </div>

      {/* Performance Score */}
      {performanceScore > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-2">Overall Performance Score</h3>
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl font-bold ${getScoreColor(performanceScore)}`}>
                    {performanceScore}
                  </div>
                  <div className="flex-1">
                    <Progress 
                      value={performanceScore} 
                      className={`h-3 bg-gradient-to-r ${getScoreGradient(performanceScore)}`}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {performanceScore >= 80 ? 'Excellent' : 
                       performanceScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </p>
                  </div>
                </div>
              </div>
              <Zap className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals Info */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Core Web Vitals Thresholds</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good: Meeting performance targets</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Warning: Needs improvement</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Poor: Below performance targets</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Tests */}
      <div className="space-y-4">
        {performanceMetrics.map((metric) => {
          const result = results.find(r => r.id === `perf-${metric.name.toLowerCase().replace(/\s+/g, '-')}`);
          const StatusIcon = getStatusIcon(result?.status || 'pending');
          
          return (
            <Card key={metric.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{metric.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {metric.unit}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {metric.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Good: ≤{metric.goodThreshold}{metric.unit} • 
                      Warning: ≤{metric.warningThreshold}{metric.unit}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSingleTest(metric)}
                      className="text-xs"
                    >
                      Test
                    </Button>
                    
                    {result && (
                      <div className="flex items-center space-x-2">
                        {result.duration && (
                          <span className="text-xs text-muted-foreground">
                            {result.duration}ms
                          </span>
                        )}
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(result.status)}`} />
                      </div>
                    )}
                  </div>
                </div>
                
                {result?.message && (
                  <p className={`text-xs mt-2 p-2 rounded font-mono ${
                    result.status === 'passed' ? 'bg-green-50 text-green-700 dark:bg-green-950/30' :
                    result.status === 'failed' ? 'bg-red-50 text-red-700 dark:bg-red-950/30' :
                    result.status === 'warning' ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30' :
                    'bg-muted'
                  }`}>
                    {result.message}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
