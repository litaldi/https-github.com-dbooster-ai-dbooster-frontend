
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wrench, CheckCircle, AlertTriangle, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryIssue {
  type: 'syntax' | 'performance' | 'security' | 'best-practice';
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  suggestion: string;
}

interface FixResult {
  originalQuery: string;
  fixedQuery: string;
  issues: QueryIssue[];
  confidence: number;
  improvements: string[];
}

export function AutomatedQueryFixer() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isFixing, setIsFixing] = useState(false);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);

  const fixQuery = async () => {
    if (!query.trim()) return;
    
    setIsFixing(true);
    
    // Simulate AI query fixing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult: FixResult = {
      originalQuery: query,
      fixedQuery: query
        .replace(/SELECT \*/g, 'SELECT u.id, u.name, u.email')
        .replace(/WHERE/g, 'WHERE u.active = true AND')
        .replace(/;$/, '\nLIMIT 1000;'),
      issues: [
        {
          type: 'performance',
          severity: 'warning',
          message: 'SELECT * can be inefficient',
          line: 1,
          suggestion: 'Specify only needed columns'
        },
        {
          type: 'security',
          severity: 'error',
          message: 'Missing input validation',
          suggestion: 'Use parameterized queries'
        },
        {
          type: 'best-practice',
          severity: 'info',
          message: 'Consider adding LIMIT clause',
          suggestion: 'Add LIMIT to prevent large result sets'
        }
      ],
      confidence: 92,
      improvements: [
        'Reduced data transfer by 60%',
        'Added security protection',
        'Improved query readability',
        'Added result set limit'
      ]
    };
    
    setFixResult(mockResult);
    setIsFixing(false);
    
    toast({
      title: "Query fixed successfully!",
      description: `Fixed ${mockResult.issues.length} issues with ${mockResult.confidence}% confidence`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Fixed query has been copied.",
    });
  };

  const appleFix = () => {
    setQuery(fixResult?.fixedQuery || '');
    toast({
      title: "Fix applied!",
      description: "The fixed query has been applied to the editor.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'syntax': return '📝';
      case 'performance': return '⚡';
      case 'security': return '🔒';
      case 'best-practice': return '✨';
      default: return '🔧';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Automated Query Fixer</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SQL Query Repair</CardTitle>
          <CardDescription>
            Paste your SQL query below and let AI automatically detect and fix issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="SELECT * FROM users WHERE name = 'John';"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={6}
          />
          <Button onClick={fixQuery} disabled={!query.trim() || isFixing}>
            {isFixing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing & Fixing...
              </>
            ) : (
              <>
                <Wrench className="mr-2 h-4 w-4" />
                Auto-Fix Query
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {fixResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Fix Results</h3>
            <Badge variant="outline">
              Confidence: {fixResult.confidence}%
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Original Query</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-red-50 border border-red-200 p-3 rounded text-sm overflow-x-auto">
                  <code>{fixResult.originalQuery}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  Fixed Query
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(fixResult.fixedQuery)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-green-50 border border-green-200 p-3 rounded text-sm overflow-x-auto">
                  <code>{fixResult.fixedQuery}</code>
                </pre>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Issues Detected & Fixed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fixResult.issues.map((issue, index) => (
                <Alert key={index}>
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getTypeIcon(issue.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <span className="text-sm font-medium capitalize">{issue.type}</span>
                        {issue.line && (
                          <Badge variant="outline" className="text-xs">
                            Line {issue.line}
                          </Badge>
                        )}
                      </div>
                      <AlertDescription className="mb-2">
                        <strong>Issue:</strong> {issue.message}
                      </AlertDescription>
                      <AlertDescription>
                        <strong>Fix:</strong> {issue.suggestion}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {fixResult.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={appleFix}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Apply Fixed Query
            </Button>
            <Button variant="outline">
              Test in Sandbox
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
