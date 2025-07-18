
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

interface NavigationTest {
  name: string;
  path: string;
  expectedTitle?: string;
  shouldBeProtected?: boolean;
}

const navigationTests: NavigationTest[] = [
  { name: 'Home Page', path: '/', expectedTitle: 'DBooster' },
  { name: 'Product Page', path: '/product' },
  { name: 'Features Page', path: '/features' },
  { name: 'Pricing Page', path: '/pricing' },
  { name: 'Documentation', path: '/documentation' },
  { name: 'Blog', path: '/blog' },
  { name: 'About Page', path: '/about' },
  { name: 'Contact Page', path: '/contact' },
  { name: 'Login Page', path: '/login' },
  { name: 'Dashboard', path: '/app', shouldBeProtected: true },
  { name: 'Analytics', path: '/app/analytics', shouldBeProtected: true },
  { name: 'Queries', path: '/app/queries', shouldBeProtected: true },
  { name: 'Repositories', path: '/app/repositories', shouldBeProtected: true },
  { name: 'Settings', path: '/app/settings', shouldBeProtected: true },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Service', path: '/terms' },
  { name: 'Security', path: '/security' },
  { name: 'Accessibility', path: '/accessibility' }
];

interface NavigationTesterProps {
  onResults: (results: TestResult[]) => void;
}

export function NavigationTester({ onResults }: NavigationTesterProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    for (const test of navigationTests) {
      const result: TestResult = {
        id: `nav-${test.path}`,
        name: test.name,
        status: 'running'
      };
      
      testResults.push(result);
      setResults([...testResults]);

      const startTime = Date.now();
      
      try {
        // Test navigation
        navigate(test.path);
        
        // Wait for navigation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if we're on the expected path
        const currentPath = window.location.pathname;
        const duration = Date.now() - startTime;
        
        if (test.shouldBeProtected && !currentPath.startsWith('/app')) {
          // Should redirect to login if not authenticated
          result.status = currentPath === '/login' ? 'passed' : 'failed';
          result.message = currentPath === '/login' 
            ? 'Correctly redirected to login' 
            : `Expected redirect to login, got ${currentPath}`;
        } else if (currentPath === test.path || currentPath.startsWith(test.path)) {
          result.status = 'passed';
          result.message = 'Navigation successful';
        } else {
          result.status = 'failed';
          result.message = `Expected ${test.path}, got ${currentPath}`;
        }
        
        result.duration = duration;
      } catch (error) {
        result.status = 'failed';
        result.message = error instanceof Error ? error.message : 'Navigation failed';
        result.duration = Date.now() - startTime;
      }
      
      // Update the specific result
      const updatedResults = testResults.map(r => 
        r.id === result.id ? result : r
      );
      setResults(updatedResults);
      onResults(updatedResults);
    }

    setIsRunning(false);
  };

  const testSingleRoute = async (test: NavigationTest) => {
    const startTime = Date.now();
    
    try {
      navigate(test.path);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const currentPath = window.location.pathname;
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${test.name}: ${currentPath} (${duration}ms)`);
    } catch (error) {
      console.error(`❌ ${test.name}:`, error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Test all navigation links and routing functionality
        </p>
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Navigation Tests'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {navigationTests.map((test) => {
          const result = results.find(r => r.id === `nav-${test.path}`);
          
          return (
            <Card key={test.path} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{test.name}</span>
                    {test.shouldBeProtected && (
                      <Badge variant="secondary" className="text-xs">
                        Protected
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {test.path}
                    </code>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSingleRoute(test)}
                      className="text-xs"
                    >
                      Test Route
                    </Button>
                    
                    {result && (
                      <div className="flex items-center space-x-2">
                        {result.duration && (
                          <span className="text-xs text-muted-foreground">
                            {result.duration}ms
                          </span>
                        )}
                        {result.status === 'passed' && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {result.status === 'failed' && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        {result.status === 'running' && (
                          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {result?.message && (
                    <p className="text-xs text-muted-foreground">
                      {result.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
