
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, XCircle, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

interface AuthTest {
  name: string;
  description: string;
  testFunction: () => Promise<{ passed: boolean; message: string }>;
}

interface AuthenticationTesterProps {
  onResults: (results: TestResult[]) => void;
}

export function AuthenticationTester({ onResults }: AuthenticationTesterProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user, session, loginDemo, signOut } = useAuth();

  const authTests: AuthTest[] = [
    {
      name: 'Session Persistence',
      description: 'Check if user session persists across page reloads',
      testFunction: async () => {
        const hasSession = !!session;
        return {
          passed: hasSession,
          message: hasSession ? 'Session found and valid' : 'No active session found'
        };
      }
    },
    {
      name: 'Demo Login Flow',
      description: 'Test demo login functionality',
      testFunction: async () => {
        try {
          await loginDemo();
          return {
            passed: true,
            message: 'Demo login successful'
          };
        } catch (error) {
          return {
            passed: false,
            message: error instanceof Error ? error.message : 'Demo login failed'
          };
        }
      }
    },
    {
      name: 'Protected Route Access',
      description: 'Verify protected routes require authentication',
      testFunction: async () => {
        const isAuthenticated = !!user;
        const currentPath = window.location.pathname;
        const isOnProtectedRoute = currentPath.startsWith('/app');
        
        if (isOnProtectedRoute && !isAuthenticated) {
          return {
            passed: false,
            message: 'Unauthenticated user can access protected route'
          };
        }
        
        return {
          passed: true,
          message: isAuthenticated 
            ? 'Authenticated user can access protected routes' 
            : 'Unauthenticated user properly redirected'
        };
      }
    },
    {
      name: 'User Data Integrity',
      description: 'Verify user data is properly loaded and structured',
      testFunction: async () => {
        if (!user) {
          return {
            passed: false,
            message: 'No user data available'
          };
        }
        
        const hasRequiredFields = !!(user.id && user.email);
        return {
          passed: hasRequiredFields,
          message: hasRequiredFields 
            ? 'User data structure is valid' 
            : 'User data missing required fields'
        };
      }
    },
    {
      name: 'Logout Functionality',
      description: 'Test user logout and session cleanup',
      testFunction: async () => {
        if (!user) {
          return {
            passed: true,
            message: 'No user logged in to test logout'
          };
        }
        
        try {
          await signOut();
          // Wait a moment for state to update
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return {
            passed: !user,
            message: user ? 'Logout failed - user still logged in' : 'Logout successful'
          };
        } catch (error) {
          return {
            passed: false,
            message: error instanceof Error ? error.message : 'Logout failed'
          };
        }
      }
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    for (const test of authTests) {
      const result: TestResult = {
        id: `auth-${test.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: test.name,
        status: 'running'
      };
      
      testResults.push(result);
      setResults([...testResults]);

      const startTime = Date.now();
      
      try {
        const testResult = await test.testFunction();
        result.status = testResult.passed ? 'passed' : 'failed';
        result.message = testResult.message;
        result.duration = Date.now() - startTime;
      } catch (error) {
        result.status = 'failed';
        result.message = error instanceof Error ? error.message : 'Test execution failed';
        result.duration = Date.now() - startTime;
      }
      
      const updatedResults = testResults.map(r => 
        r.id === result.id ? result : r
      );
      setResults(updatedResults);
      onResults(updatedResults);
    }

    setIsRunning(false);
  };

  const runSingleTest = async (test: AuthTest) => {
    console.log(`Running ${test.name}...`);
    try {
      const result = await test.testFunction();
      console.log(`${result.passed ? '✅' : '❌'} ${test.name}: ${result.message}`);
    } catch (error) {
      console.error(`❌ ${test.name}:`, error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Test authentication flows including login, logout, and session management
        </p>
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Auth Tests'}
        </Button>
      </div>

      {/* Current Auth Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Current Authentication Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="text-sm">
                User: {user ? (
                  <Badge variant="default" className="ml-1">Authenticated</Badge>
                ) : (
                  <Badge variant="secondary" className="ml-1">Not Authenticated</Badge>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">
                Session: {session ? (
                  <Badge variant="default" className="ml-1">Active</Badge>
                ) : (
                  <Badge variant="secondary" className="ml-1">Inactive</Badge>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                Email: {user?.email || 'Not available'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auth Test Results */}
      <div className="space-y-4">
        {authTests.map((test) => {
          const result = results.find(r => r.id === `auth-${test.name.toLowerCase().replace(/\s+/g, '-')}`);
          
          return (
            <Card key={test.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {test.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSingleTest(test)}
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
                </div>
                
                {result?.message && (
                  <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
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
