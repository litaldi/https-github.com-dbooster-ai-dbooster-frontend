
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskFactor {
  type: 'security' | 'performance' | 'data-integrity';
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  suggestion: string;
}

interface QueryRiskAssessmentProps {
  query: string;
}

export function QueryRiskAssessment({ query }: QueryRiskAssessmentProps) {
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [overallRisk, setOverallRisk] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      analyzeRisk();
    } else {
      setRiskFactors([]);
      setOverallRisk('low');
    }
  }, [query]);

  const analyzeRisk = async () => {
    setIsAnalyzing(true);
    
    // Simulate risk analysis
    setTimeout(() => {
      const factors: RiskFactor[] = [];
      
      // Check for SQL injection risks
      if (query.includes("'") && !query.includes("$")) {
        factors.push({
          type: 'security',
          level: 'high',
          message: 'Potential SQL injection vulnerability detected',
          suggestion: 'Use parameterized queries instead of string concatenation'
        });
      }
      
      // Check for performance risks
      if (query.toLowerCase().includes('select *')) {
        factors.push({
          type: 'performance',
          level: 'medium',
          message: 'SELECT * can impact performance',
          suggestion: 'Specify only the columns you need'
        });
      }
      
      // Check for missing WHERE clause on potentially large tables
      if (query.toLowerCase().includes('delete') && !query.toLowerCase().includes('where')) {
        factors.push({
          type: 'data-integrity',
          level: 'critical',
          message: 'DELETE without WHERE clause detected',
          suggestion: 'Always use WHERE clause to prevent accidental data loss'
        });
      }
      
      // Determine overall risk
      if (factors.some(f => f.level === 'critical')) {
        setOverallRisk('critical');
      } else if (factors.some(f => f.level === 'high')) {
        setOverallRisk('high');
      } else if (factors.some(f => f.level === 'medium')) {
        setOverallRisk('medium');
      } else {
        setOverallRisk('low');
      }
      
      setRiskFactors(factors);
      setIsAnalyzing(false);
    }, 800);
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getOverallRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!query.trim()) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Query Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 animate-pulse" />
            <span>Analyzing query for potential risks...</span>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-lg border-2 ${getOverallRiskColor(overallRisk)}`}
            >
              <div className="flex items-center gap-2">
                {getRiskIcon(overallRisk)}
                <span className="font-semibold capitalize">
                  Overall Risk: {overallRisk}
                </span>
              </div>
            </motion.div>

            {riskFactors.length > 0 ? (
              <div className="space-y-3">
                {riskFactors.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Alert className="border-l-4 border-l-orange-500">
                      <div className="flex items-start gap-3">
                        {getRiskIcon(factor.level)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={getRiskColor(factor.level) as any}>
                              {factor.level} {factor.type}
                            </Badge>
                          </div>
                          <AlertDescription>
                            <div className="space-y-1">
                              <p><strong>Issue:</strong> {factor.message}</p>
                              <p><strong>Recommendation:</strong> {factor.suggestion}</p>
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-600 font-medium">No significant risks detected</p>
                <p className="text-sm text-muted-foreground">Your query appears to be safe</p>
              </motion.div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
