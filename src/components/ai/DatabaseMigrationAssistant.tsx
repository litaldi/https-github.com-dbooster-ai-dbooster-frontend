
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GitBranch, ArrowRight, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface MigrationPlan {
  steps: Array<{
    id: string;
    type: 'create_table' | 'alter_table' | 'create_index' | 'migrate_data' | 'cleanup';
    description: string;
    sql: string;
    risk: 'low' | 'medium' | 'high';
    estimatedTime: string;
    dependencies: string[];
  }>;
  rollbackPlan: {
    steps: string[];
    warnings: string[];
  };
  compatibility: {
    postgresql: boolean;
    mysql: boolean;
    sqlite: boolean;
  };
  estimatedDuration: string;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

export function DatabaseMigrationAssistant() {
  const [requirements, setRequirements] = useState('');
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMigrationPlan = async () => {
    if (!requirements.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      
      // Mock migration plan for demonstration
      const mockPlan: MigrationPlan = {
        steps: [
          {
            id: '1',
            type: 'create_table',
            description: 'Create new user_profiles table',
            sql: 'CREATE TABLE user_profiles (id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), profile_data JSONB);',
            risk: 'low',
            estimatedTime: '2 minutes',
            dependencies: []
          },
          {
            id: '2',
            type: 'create_index',
            description: 'Add index on user_id for performance',
            sql: 'CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);',
            risk: 'low',
            estimatedTime: '5 minutes',
            dependencies: ['1']
          },
          {
            id: '3',
            type: 'migrate_data',
            description: 'Migrate existing profile data',
            sql: 'INSERT INTO user_profiles (user_id, profile_data) SELECT id, jsonb_build_object(...) FROM users;',
            risk: 'medium',
            estimatedTime: '15 minutes',
            dependencies: ['1', '2']
          },
          {
            id: '4',
            type: 'alter_table',
            description: 'Remove old profile columns from users table',
            sql: 'ALTER TABLE users DROP COLUMN profile_data;',
            risk: 'high',
            estimatedTime: '1 minute',
            dependencies: ['3']
          }
        ],
        rollbackPlan: {
          steps: [
            'ALTER TABLE users ADD COLUMN profile_data JSONB;',
            'UPDATE users SET profile_data = up.profile_data FROM user_profiles up WHERE users.id = up.user_id;',
            'DROP TABLE user_profiles;'
          ],
          warnings: [
            'Rollback may take significant time for large datasets',
            'Ensure you have a recent backup before proceeding'
          ]
        },
        compatibility: {
          postgresql: true,
          mysql: false,
          sqlite: false
        },
        estimatedDuration: '23 minutes',
        riskAssessment: {
          level: 'medium',
          factors: [
            'Data migration involved',
            'Schema changes to existing table',
            'Potential for data loss if not executed properly'
          ]
        }
      };

      setMigrationPlan(mockPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration plan generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'create_table': return '🏗️';
      case 'alter_table': return '⚙️';
      case 'create_index': return '⚡';
      case 'migrate_data': return '📦';
      case 'cleanup': return '🧹';
      default: return '📝';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Database Migration Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Migration Requirements</label>
          <Textarea
            placeholder="Describe what changes you need to make to your database schema. For example: 'I need to split the user table into users and user_profiles tables, moving profile data to the new table.'"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={generateMigrationPlan} disabled={isGenerating || !requirements.trim()}>
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <GitBranch className="h-4 w-4 mr-2" />
              Generate Migration Plan
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {migrationPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{migrationPlan.steps.length}</div>
                    <div className="text-sm text-muted-foreground">Migration Steps</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{migrationPlan.estimatedDuration}</div>
                    <div className="text-sm text-muted-foreground">Estimated Duration</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Badge className={getRiskColor(migrationPlan.riskAssessment.level)}>
                      {migrationPlan.riskAssessment.level} risk
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-2">Risk Level</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="steps" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="steps">Migration Steps</TabsTrigger>
                <TabsTrigger value="rollback">Rollback Plan</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="space-y-4">
                {migrationPlan.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getStepIcon(step.type)}</span>
                        <span className="font-medium">Step {index + 1}</span>
                        <Badge variant="outline" className={getRiskColor(step.risk)}>
                          {step.risk}
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {step.estimatedTime}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {step.sql}
                    </div>
                    
                    {step.dependencies.length > 0 && (
                      <div className="text-sm">
                        <strong>Dependencies:</strong> Steps {step.dependencies.join(', ')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="rollback" className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">Rollback Warnings</h3>
                  </div>
                  <ul className="space-y-1">
                    {migrationPlan.rollbackPlan.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-orange-700">• {warning}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Rollback Steps</h3>
                  {migrationPlan.rollbackPlan.steps.map((step, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Rollback Step {index + 1}</span>
                      </div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="compatibility" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(migrationPlan.compatibility).map(([db, compatible]) => (
                    <Card key={db}>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          {compatible ? (
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                          )}
                          <div className="font-medium capitalize">{db}</div>
                          <div className="text-sm text-muted-foreground">
                            {compatible ? 'Compatible' : 'Not Compatible'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">Risk Factors</h3>
                  <ul className="space-y-1">
                    {migrationPlan.riskAssessment.factors.map((factor, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {factor}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
