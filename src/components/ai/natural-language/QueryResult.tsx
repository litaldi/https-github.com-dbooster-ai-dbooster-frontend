
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Copy,
  Play,
  Lightbulb
} from 'lucide-react';

interface ConversionResult {
  sql: string;
  explanation: string;
  confidence: number;
  alternatives: string[];
}

interface QueryResultProps {
  result: ConversionResult;
  onCopy: (text: string) => void;
}

export const QueryResult: React.FC<QueryResultProps> = React.memo(({ result, onCopy }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-green-600" />
          Generated SQL Query
          <div className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(result.confidence)}`}>
            {Math.round(result.confidence * 100)}% CONFIDENCE
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="query">Generated Query</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-4">
            <div className="relative">
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{result.sql}</code>
                </pre>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => onCopy(result.sql)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Play className="mr-2 h-3 w-3" />
                Execute Query
              </Button>
              <Button size="sm" variant="outline">
                <Lightbulb className="mr-2 h-3 w-3" />
                Optimize Further
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="explanation" className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">{result.explanation}</p>
            </div>
          </TabsContent>

          <TabsContent value="alternatives" className="space-y-4">
            {result.alternatives.map((alternative, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-sm text-gray-800">
                    <code>{alternative}</code>
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => onCopy(alternative)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

QueryResult.displayName = 'QueryResult';
