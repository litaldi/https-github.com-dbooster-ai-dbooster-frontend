
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  issues: RiskIssue[];
  recommendations: string[];
  estimatedImpact: string;
}

interface RiskIssue {
  type: 'performance' | 'security' | 'data-integrity' | 'resource-usage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  solution: string;
}

interface QueryRiskAssessmentProps {
  query: string;
}

export function QueryRiskAssessment({ query }: QueryRiskAssessmentProps) {
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (query.trim().length > 10) {
      analyzeQueryRisk(query);
    } else {
      setAssessment(null);
    }
  }, [query]);

  const analyzeQueryRisk = async (queryText: string) => {
    setIsAnalyzing(true);
    
    // Simulate risk analysis
    setTimeout(() => {
      const issues: RiskIssue[] = [];
      
      // Check for common risk patterns
      if (queryText.toLowerCase().includes('select *')) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          description: 'SELECT * can impact performance and increase memory usage',
          solution: 'Specify only the columns you need'
        });
      }
      
      if (queryText.toLowerCase().includes('delete') && !queryText.toLowerCase().includes('where')) {
        issues.push({
          type: 'data-integrity',
          severity: 'critical',
          description: 'DELETE without WHERE clause will remove all data',
          solution: 'Add a WHERE clause to limit the scope'
        });
      }
      
      if (queryText.toLowerCase().includes('like') && queryText.includes('%')) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          description: 'LIKE with leading wildcard prevents index usage',
          solution: 'Consider full-text search or restructure the query'
        });
      }
      
      // Calculate risk level
      const maxSeverity = issues.reduce((max, issue) => {
        const severityScore = { low: 1, medium: 2, high: 3, critical: 4 };
        return Math.max(max, severityScore[issue.severity]);
      }, 0);
      
      const level = maxSeverity >= 4 ? 'critical' : 
                   maxSeverity >= 3 ? 'high' : 
                   maxSeverity >= 2 ? 'medium' : 'low';
      
      const mockAssessment: RiskAssessment = {
        level,
        score: Math.max(0, 100 - (maxSeverity * 20)),
        issues,
        recommendations: [
          'Add specific column names instead of SELECT *',
          'Include appropriate WHERE clauses',
          'Consider adding LIMIT for large result sets',
          'Test query performance on production-sized datasets'
        ],
        estimatedImpact: issues.length > 0 ? 'Potential performance impact' : 'Minimal impact expected'
      };
      
      setAssessment(mockAssessment);
      setIsAnalyzing(false);
    }, 1000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'critical': return XCircle;
      default: return Shield;
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'security': return Shield;
      case 'performance': return AlertTriangle;
      case 'data-integrity': return XCircle;
      default: return AlertTriangle;
    }
  };

  if (!assessment && !isAnalyzing) return null;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Query Risk Assessment
          {isAnalyzing && (
            <motion.div
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {assessment && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {React.createElement(getRiskIcon(assessment.level), {
                  className: `h-5 w-5 ${assessment.level === 'low' ? 'text-green-600' : 
                             assessment.level === 'medium' ? 'text-yellow-600' :
                             assessment.level === 'high' ? 'text-orange-600' : 'text-red-600'}`
                })}
                <span className="font-medium capitalize">{assessment.level} Risk</span>
              </div>
              <Badge className={getRiskColor(assessment.level)}>
                Score: {assessment.score}/100
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">{assessment.estimatedImpact}</p>
            
            {assessment.issues.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Identified Issues:</h4>
                {assessment.issues.map((issue, index) => {
                  const IssueIcon = getIssueIcon(issue.type);
                  return (
                    <Alert key={index} className="p-3">
                      <IssueIcon className="h-4 w-4" />
                      <AlertDescription className="ml-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{issue.description}</span>
                            <Badge variant="outline" className={`text-xs ${
                              issue.severity === 'critical' ? 'border-red-200 text-red-700' :
                              issue.severity === 'high' ? 'border-orange-200 text-orange-700' :
                              issue.severity === 'medium' ? 'border-yellow-200 text-yellow-700' :
                              'border-green-200 text-green-700'
                            }`}>
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <strong>Solution:</strong> {issue.solution}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  );
                })}
              </div>
            )}
            
            {assessment.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recommendations:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {assessment.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
