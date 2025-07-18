
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wrench, AlertTriangle, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

export function DatabaseRefactoringAssistant() {
  const [schema, setSchema] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [refactoringSuggestions, setRefactoringSuggestions] = useState<any>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

  const mockRefactoringSuggestions = {
    opportunities: [
      {
        id: 1,
        type: 'Normalization',
        priority: 'High',
        description: 'Extract address information into separate table',
        impact: 'Reduces data redundancy by 40%',
        risk: 'Low',
        estimatedTime: '2-3 hours',
        migrationSteps: [
          'Create new address table',
          'Migrate existing address data',
          'Update foreign key references',
          'Drop redundant columns'
        ]
      },
      {
        id: 2,
        type: 'Index Optimization',
        priority: 'Medium',
        description: 'Add composite index on (user_id, created_at)',
        impact: 'Improves query performance by 60%',
        risk: 'Very Low',
        estimatedTime: '30 minutes',
        migrationSteps: [
          'Analyze current query patterns',
          'Create composite index',
          'Monitor performance impact'
        ]
      },
      {
        id: 3,
        type: 'Column Restructuring',
        priority: 'Medium',
        description: 'Split full_name into first_name and last_name',
        impact: 'Enables better search and sorting capabilities',
        risk: 'Medium',
        estimatedTime: '1-2 hours',
        migrationSteps: [
          'Add new columns',
          'Parse and migrate existing data',
          'Update application code',
          'Drop old column'
        ]
      }
    ],
    rollbackStrategy: {
      backupRequired: true,
      rollbackTime: '< 5 minutes',
      dataLossRisk: 'None with proper backup'
    }
  };

  const analyzeSchema = () => {
    if (!schema.trim()) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setRefactoringSuggestions(mockRefactoringSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      case 'Very Low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Smart Database Refactoring Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Database Schema</label>
            <Textarea
              placeholder="Paste your database schema (CREATE TABLE statements, etc.)..."
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          
          <Button onClick={analyzeSchema} disabled={isAnalyzing || !schema.trim()}>
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Schema...
              </>
            ) : (
              <>
                <Wrench className="h-4 w-4 mr-2" />
                Analyze & Suggest Refactoring
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Analyzing schema structure and relationships...</div>
              <Progress value={75} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {refactoringSuggestions && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refactoring Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {refactoringSuggestions.opportunities.map((opportunity: any, index: number) => (
                  <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={() => setSelectedSuggestion(selectedSuggestion === index ? null : index)}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{opportunity.type}</h4>
                            <Badge variant={getPriorityColor(opportunity.priority)}>{opportunity.priority}</Badge>
                            <Badge variant={getRiskColor(opportunity.risk)}>Risk: {opportunity.risk}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-green-600">Impact: {opportunity.impact}</span>
                            <span className="text-blue-600">Time: {opportunity.estimatedTime}</span>
                          </div>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-transform ${selectedSuggestion === index ? 'rotate-90' : ''}`} />
                      </div>
                      
                      {selectedSuggestion === index && (
                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-medium mb-3">Migration Steps:</h5>
                          <div className="space-y-2">
                            {opportunity.migrationSteps.map((step: string, stepIndex: number) => (
                              <div key={stepIndex} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{step}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button size="sm" variant="default">Generate Migration Script</Button>
                            <Button size="sm" variant="outline">Preview Changes</Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Rollback Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-semibold">Backup Required</div>
                  <div className="text-sm text-muted-foreground">
                    {refactoringSuggestions.rollbackStrategy.backupRequired ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-semibold">Rollback Time</div>
                  <div className="text-sm text-muted-foreground">
                    {refactoringSuggestions.rollbackStrategy.rollbackTime}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <div className="font-semibold">Data Loss Risk</div>
                  <div className="text-sm text-muted-foreground">
                    {refactoringSuggestions.rollbackStrategy.dataLossRisk}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
