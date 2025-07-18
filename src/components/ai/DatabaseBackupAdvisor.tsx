
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Clock, 
  HardDrive, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BackupRecommendation {
  id: string;
  type: 'frequency' | 'retention' | 'strategy' | 'optimization';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentValue: string;
  recommendedValue: string;
  impact: string;
  estimatedSavings?: string;
}

export function DatabaseBackupAdvisor() {
  const [recommendations, setRecommendations] = useState<BackupRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [backupHealth, setBackupHealth] = useState(85);

  const mockRecommendations: BackupRecommendation[] = [
    {
      id: '1',
      type: 'frequency',
      priority: 'high',
      title: 'Increase Backup Frequency for Critical Tables',
      description: 'User transaction tables should be backed up more frequently due to high change rate',
      currentValue: 'Daily backups',
      recommendedValue: 'Every 6 hours',
      impact: 'Reduces potential data loss from 24h to 6h',
      estimatedSavings: '75% reduction in recovery time'
    },
    {
      id: '2',
      type: 'retention',
      priority: 'medium',
      title: 'Optimize Backup Retention Policy',
      description: 'Current retention period exceeds compliance requirements',
      currentValue: '365 days retention',
      recommendedValue: '90 days retention',
      impact: 'Reduces storage costs significantly',
      estimatedSavings: '$2,400/year in storage costs'
    },
    {
      id: '3',
      type: 'strategy',
      priority: 'critical',
      title: 'Implement Incremental Backup Strategy',
      description: 'Switch from full backups to incremental for large tables',
      currentValue: 'Full backups only',
      recommendedValue: 'Incremental + weekly full',
      impact: 'Faster backups and reduced storage',
      estimatedSavings: '60% faster backup completion'
    }
  ];

  const analyzeBackupStrategy = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setBackupHealth(Math.floor(Math.random() * 20) + 75);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'frequency': return <Clock className="h-4 w-4" />;
      case 'retention': return <Calendar className="h-4 w-4" />;
      case 'strategy': return <Shield className="h-4 w-4" />;
      case 'optimization': return <HardDrive className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Database Backup Advisor
            </CardTitle>
            <Button 
              onClick={analyzeBackupStrategy} 
              disabled={isAnalyzing}
              variant="outline"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Analyze Backup Strategy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Backup Health</p>
                    <div className="flex items-center gap-2 mt-1">
                      {backupHealth >= 80 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                      <span className={`text-2xl font-bold ${backupHealth >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {backupHealth}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Issues</p>
                    <p className="text-2xl font-bold">{recommendations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Potential Savings</p>
                    <p className="text-2xl font-bold text-green-600">$2,400/yr</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {recommendations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Backup Recommendations</h3>
              {recommendations.map((rec) => (
                <Alert key={rec.id} className="border-l-4 border-l-blue-500">
                  <div className="flex items-start gap-3">
                    <div className="p-1">
                      {getTypeIcon(rec.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(rec.priority) as any}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {rec.type}
                        </Badge>
                      </div>
                      <AlertDescription>
                        <div className="space-y-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Current: </span>
                              <span className="text-red-600">{rec.currentValue}</span>
                            </div>
                            <div>
                              <span className="font-medium">Recommended: </span>
                              <span className="text-green-600">{rec.recommendedValue}</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Impact: </span>
                            <span>{rec.impact}</span>
                            {rec.estimatedSavings && (
                              <span className="text-green-600 ml-2">({rec.estimatedSavings})</span>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                      <Button size="sm" variant="outline">
                        Apply Recommendation
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {recommendations.length === 0 && !isAnalyzing && (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-green-600">Backup Strategy Looks Good!</h3>
              <p className="text-muted-foreground">
                Your current backup configuration follows best practices
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
