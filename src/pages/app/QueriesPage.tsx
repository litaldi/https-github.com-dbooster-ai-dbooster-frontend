
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Brain, MessageCircle, Mic, Camera, BarChart3 } from 'lucide-react';
import { VisualQueryBuilder } from '@/components/query/VisualQueryBuilder';
import { ConversationalAI } from '@/components/ai/ConversationalAI';
import { EnhancedAIChatAssistant } from '@/components/ai/EnhancedAIChatAssistant';
import { PredictiveAnalyticsDashboard } from '@/components/ai/PredictiveAnalyticsDashboard';

export default function QueriesPage() {
  const [activeTab, setActiveTab] = useState('enhanced-ai');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI-Powered Query Manager</h1>
          <p className="text-muted-foreground mt-2">
            Experience next-generation database interaction with advanced AI features including voice commands, visual analysis, and predictive analytics.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Query
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="enhanced-ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Enhanced AI
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice Interface
          </TabsTrigger>
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Visual AI
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Predictive Analytics
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Basic Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="enhanced-ai">
          <EnhancedAIChatAssistant />
        </TabsContent>

        <TabsContent value="voice">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Voice Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Use natural language voice commands to interact with your database.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">"Show me all users from last month"</p>
                      <p className="text-xs text-muted-foreground">Generates: SELECT * FROM users WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 MONTH)</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">"Create a new products table"</p>
                      <p className="text-xs text-muted-foreground">Generates: CREATE TABLE products schema</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium text-sm">"Go to dashboard"</p>
                      <p className="text-xs text-muted-foreground">Navigation command</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <EnhancedAIChatAssistant />
          </div>
        </TabsContent>

        <TabsContent value="visual">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Visual AI Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Screenshot-to-SQL</h4>
                    <p className="text-sm text-muted-foreground">
                      Capture screenshots of database tables or diagrams and get instant SQL generation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Image Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload images of database schemas, ER diagrams, or query results for AI analysis.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Auto-Generated Diagrams</h4>
                    <p className="text-sm text-muted-foreground">
                      Create visual database diagrams automatically from your schema.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <EnhancedAIChatAssistant />
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <PredictiveAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="legacy">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ConversationalAI />
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Query Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VisualQueryBuilder />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
