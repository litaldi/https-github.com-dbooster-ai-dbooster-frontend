
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Wand2, Zap, Database, BarChart3 } from 'lucide-react';
import { QueryAutoComplete } from './QueryAutoComplete';
import { QueryPatternLearning } from './QueryPatternLearning';
import { QueryRiskAssessment } from './QueryRiskAssessment';
import { NaturalLanguageQueryBuilder } from './NaturalLanguageQueryBuilder';
import { AISchemaDesigner } from './AISchemaDesigner';
import { IntelligentIndexAdvisor } from './IntelligentIndexAdvisor';

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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Smart Editor
          </TabsTrigger>
          <TabsTrigger value="natural" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Natural Language
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
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            AI Analysis
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

        <TabsContent value="natural">
          <NaturalLanguageQueryBuilder />
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

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Advanced Query Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Advanced Analysis Coming Soon</p>
                <p className="text-sm">
                  Deep performance analysis, cost optimization, and intelligent recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
