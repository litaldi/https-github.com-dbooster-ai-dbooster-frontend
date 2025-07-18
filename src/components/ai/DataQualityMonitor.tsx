
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Database, 
  AlertCircle, 
  CheckCircle, 
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Eye,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DataQualityIssue {
  id: string;
  table: string;
  column: string;
  issueType: 'missing' | 'duplicate' | 'invalid' | 'inconsistent' | 'outlier';
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedRows: number;
  totalRows: number;
  description: string;
  suggestedFix: string;
  trend: 'improving' | 'stable' | 'degrading';
}

export function DataQualityMonitor() {
  const [issues, setIssues] = useState<DataQualityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [overallScore, setOverallScore] = useState(92);

  const mockIssues: DataQualityIssue[] = [
    {
      id: '1',
      table: 'users',
      column: 'email',
      issueType: 'invalid',
      severity: 'high',
      affectedRows: 47,
      totalRows: 12453,
      description: 'Invalid email format detected in user records',
      suggestedFix: 'Add email validation constraint and clean existing data',
      trend: 'degrading'
    },
    {
      id: '2',
      table: 'orders',
      column: 'total_amount',
      issueType: 'outlier',
      severity: 'medium',
      affectedRows: 12,
      totalRows: 8934,
      description: 'Unusually high order amounts detected (>$10,000)',
      suggestedFix: 'Review high-value orders for data entry errors',
      trend: 'stable'
    },
    {
      id: '3',
      table: 'products',
      column: 'category_id',
      issueType: 'missing',
      severity: 'critical',
      affectedRows: 156,
      totalRows: 2341,
      description: 'Missing category assignments for products',
      suggestedFix: 'Implement NOT NULL constraint and assign default category',
      trend: 'improving'
    }
  ];

  const scanDataQuality = async () => {
    setIsScanning(true);
    
    // Simulate API call
    setTimeout(() => {
      setIssues(mockIssues);
      setOverallScore(Math.floor(Math.random() * 20) + 80);
      setIsScanning(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getIssueTypeIcon = (type: string) => {
    switch (type) {
      case 'missing': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'duplicate': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'invalid': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'inconsistent': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'outlier': return <Eye className="h-4 w-4 text-purple-600" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'degrading': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getQualityPercentage = (affected: number, total: number) => {
    return Math.round(((total - affected) / total) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Data Quality Monitor
            </CardTitle>
            <Button 
              onClick={scanDataQuality} 
              disabled={isScanning}
              variant="outline"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Scan Data Quality
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold">Overall Data Quality Score</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-bold ${overallScore >= 90 ? 'text-green-600' : overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {overallScore}
                      </span>
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">Issues Found</div>
                    <div className="text-2xl font-bold">{issues.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues List */}
            {issues.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Quality Issues</h3>
                {issues.map((issue) => (
                  <Alert key={issue.id} className="border-l-4 border-l-orange-500">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getIssueTypeIcon(issue.issueType)}
                        <Badge variant={getSeverityColor(issue.severity) as any}>
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {issue.issueType}
                        </Badge>
                        <div className="flex items-center gap-1 ml-auto">
                          {getTrendIcon(issue.trend)}
                          <span className="text-xs capitalize">{issue.trend}</span>
                        </div>
                      </div>
                      
                      <AlertDescription>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">{issue.table}.{issue.column}</h4>
                            <p className="text-sm text-muted-foreground">{issue.description}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Data Quality</span>
                              <span>{getQualityPercentage(issue.affectedRows, issue.totalRows)}%</span>
                            </div>
                            <Progress 
                              value={getQualityPercentage(issue.affectedRows, issue.totalRows)} 
                              className="h-2"
                            />
                            <div className="text-xs text-muted-foreground">
                              {issue.affectedRows.toLocaleString()} of {issue.totalRows.toLocaleString()} rows affected
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm">
                              <span className="font-medium text-blue-800">Suggested Fix: </span>
                              <span className="text-blue-700">{issue.suggestedFix}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm">
                              Fix Issue
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {issues.length === 0 && !isScanning && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-green-600">Excellent Data Quality!</h3>
                <p className="text-muted-foreground">
                  No significant data quality issues detected in your database
                </p>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
