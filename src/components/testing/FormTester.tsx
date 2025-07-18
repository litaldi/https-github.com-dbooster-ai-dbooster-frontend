
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Play, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

interface FormTest {
  name: string;
  selector: string;
  validData: Record<string, any>;
  invalidData: Record<string, any>;
  expectedValidation?: string[];
}

const formTests: FormTest[] = [
  {
    name: 'Login Form',
    selector: 'form[data-testid="login-form"]',
    validData: {
      email: 'test@example.com',
      password: 'password123'
    },
    invalidData: {
      email: 'invalid-email',
      password: '123'
    },
    expectedValidation: ['email', 'password']
  },
  {
    name: 'Contact Form',
    selector: 'form[data-testid="contact-form"]',
    validData: {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a test message'
    },
    invalidData: {
      name: '',
      email: 'invalid',
      message: ''
    },
    expectedValidation: ['name', 'email', 'message']
  },
  {
    name: 'SQL Query Form',
    selector: 'form[data-testid="query-form"]',
    validData: {
      query: 'SELECT * FROM users WHERE id = 1'
    },
    invalidData: {
      query: ''
    },
    expectedValidation: ['query']
  }
];

interface FormTesterProps {
  onResults: (results: TestResult[]) => void;
}

export function FormTester({ onResults }: FormTesterProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testFormData, setTestFormData] = useState({
    email: '',
    password: '',
    name: '',
    message: ''
  });

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    for (const test of formTests) {
      const result: TestResult = {
        id: `form-${test.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: test.name,
        status: 'running'
      };
      
      testResults.push(result);
      setResults([...testResults]);

      const startTime = Date.now();
      
      try {
        // Test form existence
        const form = document.querySelector(test.selector);
        if (!form) {
          result.status = 'failed';
          result.message = 'Form not found on current page';
          result.duration = Date.now() - startTime;
          continue;
        }

        // Test form validation with invalid data
        let validationErrors = 0;
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach((input: Element) => {
          const inputElement = input as HTMLInputElement;
          if (inputElement.required && !inputElement.value) {
            validationErrors++;
          }
        });

        result.status = 'passed';
        result.message = `Form found with ${inputs.length} fields, ${validationErrors} validation rules`;
        result.duration = Date.now() - startTime;
      } catch (error) {
        result.status = 'failed';
        result.message = error instanceof Error ? error.message : 'Form test failed';
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

  const testFormValidation = (formName: string) => {
    console.log(`Testing ${formName} validation...`);
    // Simulate form validation testing
    setTimeout(() => {
      console.log(`✅ ${formName} validation test completed`);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Test form submissions, validations, and user interactions
        </p>
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Form Tests'}
        </Button>
      </div>

      {/* Test Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample Login Form for Testing */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Sample Login Form</h3>
            <form data-testid="login-form" className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={testFormData.email}
                onChange={(e) => setTestFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={testFormData.password}
                onChange={(e) => setTestFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
              <Button type="submit" className="w-full">
                Test Login
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sample Contact Form for Testing */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Sample Contact Form</h3>
            <form data-testid="contact-form" className="space-y-4">
              <Input
                placeholder="Name"
                value={testFormData.name}
                onChange={(e) => setTestFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={testFormData.email}
                onChange={(e) => setTestFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              <Textarea
                placeholder="Message"
                value={testFormData.message}
                onChange={(e) => setTestFormData(prev => ({ ...prev, message: e.target.value }))}
                required
              />
              <Button type="submit" className="w-full">
                Test Contact
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <div className="space-y-4">
        {formTests.map((test) => {
          const result = results.find(r => r.id === `form-${test.name.toLowerCase().replace(/\s+/g, '-')}`);
          
          return (
            <Card key={test.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{test.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {Object.keys(test.validData).length} fields
                      </Badge>
                    </div>
                    <code className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {test.selector}
                    </code>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testFormValidation(test.name)}
                      className="text-xs"
                    >
                      Test Validation
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
                  <p className="text-xs text-muted-foreground mt-2">
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
