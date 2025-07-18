
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDatabaseHealth } from '@/hooks/useDatabaseHealth';
import { HealthInsightsList } from './health/HealthInsightsList';

export function DatabaseHealthDashboard() {
  const { insights, isLoading, error, generateHealthInsights, applyRecommendation } = useDatabaseHealth('demo-db');

  const criticalCount = insights.filter(i => i.priority === 'critical').length;
  const highCount = insights.filter(i => i.priority === 'high').length;
  const totalIssues = insights.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Database Health Monitor
            </CardTitle>
            <Button 
              onClick={generateHealthInsights} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh Health Check
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Overall Health</p>
                    <div className="flex items-center gap-2 mt-1">
                      {totalIssues === 0 ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">Excellent</span>
                        </>
                      ) : (
                        <>
                          <Activity className="h-5 w-5 text-amber-500" />
                          <span className="text-2xl font-bold text-amber-600">Needs Attention</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                    <p className="text-2xl font-bold">{totalIssues}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                    <p className="text-2xl font-bold text-orange-600">{highCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <HealthInsightsList 
            insights={insights} 
            onApplyRecommendation={applyRecommendation} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
