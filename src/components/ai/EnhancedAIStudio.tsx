
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Wand2, Zap, Database, BarChart3, Eye, Activity, TrendingUp, DollarSign, GitBranch } from 'lucide-react';
import { QueryAutoComplete } from './QueryAutoComplete';
import { QueryPatternLearning } from './QueryPatternLearning';
import { QueryRiskAssessment } from './QueryRiskAssessment';
import { NaturalLanguageQueryBuilder } from './NaturalLanguageQueryBuilder';
import { AISchemaDesigner } from './AISchemaDesigner';
import { IntelligentIndexAdvisor } from './IntelligentIndexAdvisor';
import { PredictiveQueryOptimizer } from './PredictiveQueryOptimizer';
import { AnomalyDetectionDashboard } from './AnomalyDetectionDashboard';
import { DatabaseHealthDashboard } from './DatabaseHealthDashboard';
import { QueryValidator } from './QueryValidator';
import { CodeReviewAssistant } from './CodeReviewAssistant';
import { SmartDataVisualizer } from './SmartDataVisualizer';
import { DatabaseChatAssistant } from './DatabaseChatAssistant';
import { PerformanceBottleneckAnalyzer } from './PerformanceBottleneckAnalyzer';
import { QueryCostPredictor } from './QueryCostPredictor';
import { DatabaseMigrationAssistant } from './DatabaseMigrationAssistant';

export function EnhancedAIStudio() {
  const [currentQuery, setCurrentQuery] = useState('');
  const [activeTab, setActiveTab] = useState('editor');

  const handleApplySuggestion = (suggestion: string) => {
    setCurrentQuery(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Studio</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered workspace for intelligent query development and database optimization
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-15">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Smart Editor
          </TabsTrigger>
          <TabsTrigger value="validator" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Validator
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Code Review
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="visualizer" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Visualizer
          </TabsTrigger>
          <TabsTrigger value="natural" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Natural Language
          </TabsTrigger>
          <TabsTrigger value="optimizer" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Optimizer
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Pattern Learning
          </TabsTrigger>
          <TabsTrigger value="schema" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Schema Design
          </TabsTrigger>
          <TabsTrigger value="indexes" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Index Advisor
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Anomaly Detection
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Health Monitor
          </TabsTrigger>
          <TabsTrigger value="bottlenecks" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Bottleneck Analyzer
          </TabsTrigger>
          <TabsTrigger value="cost" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Predictor
          </TabsTrigger>
          <TabsTrigger value="migration" className="flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Migration Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                AI-Enhanced Query Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your SQL Query</label>
                <Textarea
                  placeholder="Start typing your SQL query and watch AI provide intelligent suggestions..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Execute Query
                </Button>
                <Button variant="outline">
                  Format Query
                </Button>
                <Button variant="outline">
                  Explain Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          <QueryAutoComplete
            currentQuery={currentQuery}
            onApplySuggestion={handleApplySuggestion}
            onQueryChange={setCurrentQuery}
          />

          <QueryRiskAssessment query={currentQuery} />
        </TabsContent>

        <TabsContent value="validator">
          <QueryValidator query={currentQuery} onQueryChange={setCurrentQuery} />
        </TabsContent>

        <TabsContent value="review">
          <CodeReviewAssistant />
        </TabsContent>

        <TabsContent value="chat">
          <DatabaseChatAssistant />
        </TabsContent>

        <TabsContent value="visualizer">
          <SmartDataVisualizer />
        </TabsContent>

        <TabsContent value="natural">
          <NaturalLanguageQueryBuilder />
        </TabsContent>

        <TabsContent value="optimizer">
          <PredictiveQueryOptimizer />
        </TabsContent>

        <TabsContent value="patterns">
          <QueryPatternLearning onApplyPattern={handleApplySuggestion} />
        </TabsContent>

        <TabsContent value="schema">
          <AISchemaDesigner />
        </TabsContent>

        <TabsContent value="indexes">
          <IntelligentIndexAdvisor />
        </TabsContent>

        <TabsContent value="anomalies">
          <AnomalyDetectionDashboard />
        </TabsContent>

        <TabsContent value="health">
          <DatabaseHealthDashboard />
        </TabsContent>

        <TabsContent value="bottlenecks">
          <PerformanceBottleneckAnalyzer />
        </TabsContent>

        <TabsContent value="cost">
          <QueryCostPredictor />
        </TabsContent>

        <TabsContent value="migration">
          <DatabaseMigrationAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
}
