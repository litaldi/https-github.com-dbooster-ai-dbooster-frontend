
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileCode, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Lightbulb,
  Clock,
  Shield,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion' | 'security';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
}

export function AICodeReview() {
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Code Required",
        description: "Please paste your SQL code for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock analysis results
      const mockIssues: CodeIssue[] = [
        {
          id: '1',
          type: 'security',
          severity: 'critical',
          title: 'Potential SQL Injection',
          description: 'Direct string concatenation detected. Use parameterized queries.',
          line: 3,
          suggestion: 'Use prepared statements with placeholders'
        },
        {
          id: '2',
          type: 'warning',
          severity: 'medium',
          title: 'Missing Index Usage',
          description: 'Query may benefit from an index on the user_id column.',
          line: 5,
          suggestion: 'CREATE INDEX idx_user_id ON users(user_id)'
        },
        {
          id: '3',
          type: 'suggestion',
          severity: 'low',
          title: 'Code Style',
          description: 'Consider using consistent indentation.',
          line: 8,
          suggestion: 'Use 2 or 4 spaces consistently'
        }
      ];

      setIssues(mockIssues);
      setScore(75);

      toast({
        title: "Code Analysis Complete",
        description: `Found ${mockIssues.length} issues. Overall score: ${75}/100`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileCode className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Code Review</h2>
        <Badge variant="outline" className="ml-2">Quality Analysis</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Code Input */}
        <Card>
          <CardHeader>
            <CardTitle>Code Analysis</CardTitle>
            <CardDescription>
              Paste your SQL code for comprehensive AI-powered review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your SQL code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            
            <Button 
              onClick={analyzeCode} 
              disabled={!code.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Code...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Analyze Code Quality
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Analysis Results
              {score > 0 && (
                <Badge variant={score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"}>
                  Score: {score}/100
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              AI-powered code quality assessment and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issues.length > 0 ? (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge className={getSeverityColor(issue.severity)}>
                            {issue.severity}
                          </Badge>
                          {issue.line && (
                            <Badge variant="outline">Line {issue.line}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {issue.description}
                        </p>
                        {issue.suggestion && (
                          <div className="bg-muted p-2 rounded text-sm">
                            <strong>Suggestion:</strong> {issue.suggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Analysis Yet</h3>
                <p className="text-muted-foreground">
                  Paste your code and click analyze to get AI-powered insights.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
