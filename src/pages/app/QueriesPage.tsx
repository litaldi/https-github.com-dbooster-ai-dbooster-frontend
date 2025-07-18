
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Brain, MessageCircle } from 'lucide-react';
import { VisualQueryBuilder } from '@/components/query/VisualQueryBuilder';
import { ConversationalAI } from '@/components/ai/ConversationalAI';

export default function QueriesPage() {
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Query Manager</h1>
          <p className="text-muted-foreground mt-2">
            Optimize and manage your SQL queries with AI-powered recommendations.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Query
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Query Builder
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Query Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <VisualQueryBuilder />
        </TabsContent>

        <TabsContent value="chat">
          <ConversationalAI />
        </TabsContent>

        <TabsContent value="library">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Recent Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No queries found. Add your first query to get started!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
