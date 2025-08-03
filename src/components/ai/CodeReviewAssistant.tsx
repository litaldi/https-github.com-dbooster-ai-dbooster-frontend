
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, AlertCircle, CheckCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { nextGenAIService } from '@/services/ai/nextGenAIService';
import { productionLogger } from '@/utils/productionLogger';

interface CodeReviewResult {
  issues: Array<{
    type: 'error' | 'warning' | 'suggestion';
    line?: number;
    message: string;
    fix?: string;
  }>;
  score: number;
  suggestions: string[];
  complexity: 'low' | 'medium' | 'high';
}

export function CodeReviewAssistant() {
  const [code, setCode] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);
  const [result, setResult] = useState<CodeReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!code.trim()) return;

    setIsReviewing(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      const reviewResult = await nextGenAIService.reviewCode(code);
      setResult(reviewResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Code review failed');
      productionLogger.error('Code review failed', err, 'CodeReviewAssistant');
    } finally {
      setIsReviewing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'suggestion': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          AI Code Review Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">SQL Code to Review</label>
          <Textarea
            placeholder="Paste your SQL code here for AI-powered review..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
        </div>
        
        <Button onClick={handleReview} disabled={isReviewing || !code.trim()}>
          {isReviewing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Reviewing Code...
            </>
          ) : (
            <>
              <Code className="h-4 w-4 mr-2" />
              Review Code
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Code Quality Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Issues Found</p>
                      <p className="text-3xl font-bold">{result.issues.length}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Complexity</p>
                      <Badge variant={result.complexity === 'high' ? 'destructive' : result.complexity === 'medium' ? 'default' : 'secondary'}>
                        {result.complexity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {result.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Issues & Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {result.issues.map((issue, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-start gap-3">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    {issue.type.toUpperCase()}
                                  </Badge>
                                  {issue.line && (
                                    <Badge variant="outline" className="text-xs">
                                      Line {issue.line}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm mb-2">{issue.message}</p>
                                {issue.fix && (
                                  <div className="bg-muted p-2 rounded text-xs font-mono">
                                    <strong>Suggested fix:</strong> {issue.fix}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {result.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      General Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
