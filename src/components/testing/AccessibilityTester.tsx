
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle2, XCircle, AlertTriangle, Eye, Keyboard, Volume2 } from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'warning';
  message?: string;
  duration?: number;
}

interface AccessibilityTest {
  name: string;
  description: string;
  category: 'visual' | 'keyboard' | 'screen-reader' | 'color';
  testFunction: () => Promise<{ status: 'passed' | 'failed' | 'warning'; message: string }>;
}

interface AccessibilityTesterProps {
  onResults: (results: TestResult[]) => void;
}

export function AccessibilityTester({ onResults }: AccessibilityTesterProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const accessibilityTests: AccessibilityTest[] = [
    {
      name: 'Alt Text for Images',
      description: 'Check if all images have descriptive alt text',
      category: 'visual',
      testFunction: async () => {
        const images = document.querySelectorAll('img');
        const imagesWithoutAlt = Array.from(images).filter(img => !img.alt || img.alt.trim() === '');
        
        if (imagesWithoutAlt.length === 0) {
          return { status: 'passed', message: `All ${images.length} images have alt text` };
        } else {
          return { 
            status: 'failed', 
            message: `${imagesWithoutAlt.length} of ${images.length} images missing alt text` 
          };
        }
      }
    },
    {
      name: 'Heading Hierarchy',
      description: 'Verify proper heading structure (h1, h2, h3, etc.)',
      category: 'screen-reader',
      testFunction: async () => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
        
        let hasH1 = headingLevels.includes(1);
        let properOrder = true;
        
        for (let i = 1; i < headingLevels.length; i++) {
          if (headingLevels[i] > headingLevels[i-1] + 1) {
            properOrder = false;
            break;
          }
        }
        
        if (!hasH1) {
          return { status: 'failed', message: 'No h1 element found on page' };
        } else if (!properOrder) {
          return { status: 'warning', message: 'Heading hierarchy may skip levels' };
        } else {
          return { status: 'passed', message: `Proper heading hierarchy with ${headings.length} headings` };
        }
      }
    },
    {
      name: 'Keyboard Navigation',
      description: 'Test if all interactive elements are keyboard accessible',
      category: 'keyboard',
      testFunction: async () => {
        const focusableElements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        let keyboardAccessible = 0;
        focusableElements.forEach(element => {
          if (element instanceof HTMLElement) {
            const style = window.getComputedStyle(element);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
              keyboardAccessible++;
            }
          }
        });
        
        return {
          status: keyboardAccessible > 0 ? 'passed' : 'failed',
          message: `${keyboardAccessible} keyboard-accessible elements found`
        };
      }
    },
    {
      name: 'Color Contrast',
      description: 'Check color contrast ratios for readability',
      category: 'color',
      testFunction: async () => {
        // Simplified contrast check - would need more sophisticated logic in real implementation
        const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
        let contrastIssues = 0;
        
        textElements.forEach(element => {
          const style = window.getComputedStyle(element);
          const color = style.color;
          const backgroundColor = style.backgroundColor;
          
          // Very basic check - in practice, you'd calculate actual contrast ratios
          if (color === backgroundColor) {
            contrastIssues++;
          }
        });
        
        return {
          status: contrastIssues === 0 ? 'passed' : 'warning',
          message: contrastIssues === 0 
            ? 'No obvious contrast issues detected' 
            : `${contrastIssues} potential contrast issues found`
        };
      }
    },
    {
      name: 'Form Labels',
      description: 'Ensure all form inputs have associated labels',
      category: 'screen-reader',
      testFunction: async () => {
        const inputs = document.querySelectorAll('input, select, textarea');
        const inputsWithoutLabels = Array.from(inputs).filter(input => {
          const id = input.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = input.hasAttribute('aria-label');
          const hasAriaLabelledBy = input.hasAttribute('aria-labelledby');
          
          return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy;
        });
        
        return {
          status: inputsWithoutLabels.length === 0 ? 'passed' : 'failed',
          message: inputsWithoutLabels.length === 0
            ? `All ${inputs.length} form inputs have labels`
            : `${inputsWithoutLabels.length} of ${inputs.length} inputs missing labels`
        };
      }
    },
    {
      name: 'Skip Links',
      description: 'Check for skip navigation links',
      category: 'keyboard',
      testFunction: async () => {
        const skipLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        const mainContent = document.querySelector('#main-content, main, [role="main"]');
        
        return {
          status: skipLinks.length > 0 && mainContent ? 'passed' : 'warning',
          message: skipLinks.length > 0 
            ? `Found ${skipLinks.length} skip links` 
            : 'No skip links found - consider adding for keyboard users'
        };
      }
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    for (const test of accessibilityTests) {
      const result: TestResult = {
        id: `a11y-${test.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: test.name,
        status: 'running'
      };
      
      testResults.push(result);
      setResults([...testResults]);

      const startTime = Date.now();
      
      try {
        const testResult = await test.testFunction();
        result.status = testResult.status;
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

  const runSingleTest = async (test: AccessibilityTest) => {
    console.log(`Running ${test.name}...`);
    try {
      const result = await test.testFunction();
      const icon = result.status === 'passed' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      console.log(`${icon} ${test.name}: ${result.message}`);
    } catch (error) {
      console.error(`❌ ${test.name}:`, error);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'visual': return Eye;
      case 'keyboard': return Keyboard;
      case 'screen-reader': return Volume2;
      case 'color': return Eye;
      default: return CheckCircle2;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return CheckCircle2;
      case 'failed': return XCircle;
      case 'warning': return AlertTriangle;
      default: return CheckCircle2;
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
          Test accessibility compliance including WCAG 2.1 guidelines
        </p>
        <Button onClick={runTests} disabled={isRunning}>
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run A11y Tests'}
        </Button>
      </div>

      {/* Accessibility Guidelines */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">WCAG 2.1 Guidelines Being Tested</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Visual</span>
            </div>
            <div className="flex items-center space-x-2">
              <Keyboard className="h-4 w-4" />
              <span className="text-sm">Keyboard</span>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <span className="text-sm">Screen Reader</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Color Contrast</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Tests */}
      <div className="space-y-4">
        {accessibilityTests.map((test) => {
          const result = results.find(r => r.id === `a11y-${test.name.toLowerCase().replace(/\s+/g, '-')}`);
          const CategoryIcon = getCategoryIcon(test.category);
          const StatusIcon = getStatusIcon(result?.status || 'pending');
          
          return (
            <Card key={test.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{test.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {test.category}
                      </Badge>
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
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(result.status)}`} />
                      </div>
                    )}
                  </div>
                </div>
                
                {result?.message && (
                  <p className={`text-xs mt-2 p-2 rounded ${
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
