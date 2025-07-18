
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Navigation, 
  FormInput, 
  Shield, 
  Smartphone, 
  Accessibility,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { NavigationTester } from './NavigationTester';
import { FormTester } from './FormTester';
import { AuthenticationTester } from './AuthenticationTester';
import { ResponsiveTester } from './ResponsiveTester';
import { AccessibilityTester } from './AccessibilityTester';
import { PerformanceTester } from './PerformanceTester';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

interface TestSuite {
  name: string;
  icon: React.ElementType;
  component: React.ComponentType<{ onResults: (results: TestResult[]) => void }>;
  results: TestResult[];
}

export function TestingDashboard() {
  const [activeTab, setActiveTab] = useState('navigation');
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      name: 'Navigation',
      icon: Navigation,
      component: NavigationTester,
      results: []
    },
    {
      name: 'Forms',
      icon: FormInput,
      component: FormTester,
      results: []
    },
    {
      name: 'Authentication',
      icon: Shield,
      component: AuthenticationTester,
      results: []
    },
    {
      name: 'Responsive Design',
      icon: Smartphone,
      component: ResponsiveTester,
      results: []
    },
    {
      name: 'Accessibility',
      icon: Accessibility,
      component: AccessibilityTester,
      results: []
    },
    {
      name: 'Performance',
      icon: RefreshCw,
      component: PerformanceTester,
      results: []
    }
  ]);

  const updateSuiteResults = (suiteName: string, results: TestResult[]) => {
    setTestSuites(prev => prev.map(suite => 
      suite.name === suiteName ? { ...suite, results } : suite
    ));
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    setOverallProgress(0);
    
    // Reset all results
    setTestSuites(prev => prev.map(suite => ({ ...suite, results: [] })));
    
    // Simulate running all tests
    for (let i = 0; i <= 100; i += 10) {
      setOverallProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setIsRunningAll(false);
  };

  const getTotalTests = () => {
    return testSuites.reduce((total, suite) => total + suite.results.length, 0);
  };

  const getPassedTests = () => {
    return testSuites.reduce((total, suite) => 
      total + suite.results.filter(r => r.status === 'passed').length, 0
    );
  };

  const getFailedTests = () => {
    return testSuites.reduce((total, suite) => 
      total + suite.results.filter(r => r.status === 'failed').length, 0
    );
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'running':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Running</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quality Assurance Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive testing and validation suite</p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isRunningAll}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isRunningAll ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run All Tests'
          )}
        </Button>
      </div>

      {/* Overall Progress */}
      {isRunningAll && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{getPassedTests()}</p>
                <p className="text-xs text-muted-foreground">Tests Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{getFailedTests()}</p>
                <p className="text-xs text-muted-foreground">Tests Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{getTotalTests()}</p>
                <p className="text-xs text-muted-foreground">Total Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {getTotalTests() > 0 ? Math.round((getPassedTests() / getTotalTests()) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Suites */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          {testSuites.map((suite) => {
            const Icon = suite.icon;
            const passed = suite.results.filter(r => r.status === 'passed').length;
            const failed = suite.results.filter(r => r.status === 'failed').length;
            
            return (
              <TabsTrigger key={suite.name.toLowerCase()} value={suite.name.toLowerCase()}>
                <div className="flex items-center space-x-1">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{suite.name}</span>
                  {suite.results.length > 0 && (
                    <div className="flex space-x-1">
                      {passed > 0 && (
                        <span className="text-xs bg-green-500 text-white rounded-full px-1">
                          {passed}
                        </span>
                      )}
                      {failed > 0 && (
                        <span className="text-xs bg-red-500 text-white rounded-full px-1">
                          {failed}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {testSuites.map((suite) => {
          const Component = suite.component;
          return (
            <TabsContent key={suite.name.toLowerCase()} value={suite.name.toLowerCase()}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <suite.icon className="h-5 w-5" />
                    <span>{suite.name} Testing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Component 
                    onResults={(results) => updateSuiteResults(suite.name, results)} 
                  />
                  
                  {/* Results Summary */}
                  {suite.results.length > 0 && (
                    <div className="mt-6 space-y-2">
                      <h4 className="font-medium">Test Results</h4>
                      <div className="space-y-2">
                        {suite.results.map((result) => (
                          <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium">{result.name}</span>
                              {result.message && (
                                <span className="text-sm text-muted-foreground">
                                  {result.message}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {result.duration && (
                                <span className="text-xs text-muted-foreground">
                                  {result.duration}ms
                                </span>
                              )}
                              {getStatusBadge(result.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
