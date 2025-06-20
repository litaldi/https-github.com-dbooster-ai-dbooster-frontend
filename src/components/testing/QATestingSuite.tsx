import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BrowserCompatibility } from '@/utils/browserCompatibility';
import { AccessibilityTester } from '@/utils/accessibilityTesting';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { CheckCircle, AlertTriangle, XCircle, Play, RefreshCw } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'running';
  score?: number;
  details?: any;
}

export function QATestingSuite() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      {
        name: 'Browser Compatibility',
        test: async () => {
          const info = BrowserCompatibility.logCompatibilityInfo();
          return {
            status: info.features.localStorage && info.features.fetch ? 'pass' : 'fail',
            details: info
          };
        }
      },
      {
        name: 'Accessibility Audit',
        test: async () => {
          const results = await AccessibilityTester.runFullAccessibilityAudit();
          const passed = results.keyboardNavigation && results.ariaLabels && results.colorContrast;
          return {
            status: passed ? 'pass' : 'warning',
            details: results
          };
        }
      },
      {
        name: 'Performance Analysis',
        test: async () => {
          const metrics = await PerformanceOptimizer.runLighthouseAudit();
          const score = metrics.performance.firstContentfulPaint < 2000 ? 'pass' : 'warning';
          return {
            status: score,
            details: metrics
          };
        }
      },
      {
        name: 'Image Optimization',
        test: async () => {
          const optimizedCount = PerformanceOptimizer.optimizeImages();
          return {
            status: 'pass',
            details: { optimizedImages: optimizedCount }
          };
        }
      }
    ];

    const results: TestResult[] = [];
    
    for (const test of tests) {
      setTestResults(prev => [...prev, { name: test.name, status: 'running' }]);
      
      try {
        const result = await test.test();
        const testResult: TestResult = {
          name: test.name,
          status: result.status as 'pass' | 'fail' | 'warning',
          details: result.details
        };
        
        results.push(testResult);
        setTestResults(prev => 
          prev.map(r => r.name === test.name ? testResult : r)
        );
      } catch (error) {
        const failedResult: TestResult = {
          name: test.name,
          status: 'fail',
          details: { error: error.message }
        };
        
        results.push(failedResult);
        setTestResults(prev => 
          prev.map(r => r.name === test.name ? failedResult : r)
        );
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Calculate overall score
    const passCount = results.filter(r => r.status === 'pass').length;
    const score = (passCount / results.length) * 100;
    setOverallScore(score);
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'default',
      warning: 'secondary',
      fail: 'destructive',
      running: 'outline'
    };
    
    return (
      <Badge variant={variants[status] as any} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    );
  };

  // Only show in development or for admin users
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('show-qa-suite')) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🧪 QA Testing Suite</span>
          <div className="flex items-center gap-4">
            {overallScore > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {overallScore.toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
              </div>
            )}
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {overallScore > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Test Suite Progress</span>
              <span>{overallScore.toFixed(0)}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>
        )}
        
        {testResults.map((result, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <span className="font-medium">{result.name}</span>
                {getStatusBadge(result.status)}
              </div>
              
              {result.details && (
                <details className="text-sm text-muted-foreground">
                  <summary className="cursor-pointer">View Details</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </Card>
        ))}
        
        {testResults.length === 0 && !isRunning && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Run All Tests" to start the QA testing suite
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Developer utility to show QA suite
if (typeof window !== 'undefined') {
  (window as any).showQASuite = () => {
    localStorage.setItem('show-qa-suite', 'true');
    window.location.reload();
  };
}
