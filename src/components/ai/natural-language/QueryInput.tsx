
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Brain,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface QueryInputProps {
  naturalLanguage: string;
  setNaturalLanguage: (value: string) => void;
  isConverting: boolean;
  onConvert: () => void;
  exampleQueries: string[];
}

export const QueryInput: React.FC<QueryInputProps> = React.memo(({
  naturalLanguage,
  setNaturalLanguage,
  isConverting,
  onConvert,
  exampleQueries
}) => {
  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          Natural Language to SQL
          <Badge variant="secondary" className="ml-2">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Describe what you want in plain English, and our AI will generate optimized SQL
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="natural-query">What do you want to find?</Label>
          <Input
            id="natural-query"
            placeholder="Show me all users who made purchases in the last month..."
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            className="text-base"
            onKeyDown={(e) => e.key === 'Enter' && onConvert()}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Quick Examples</Label>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.slice(0, 3).map((example, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="cursor-pointer hover:bg-blue-50 transition-colors px-3 py-1 text-xs"
                onClick={() => setNaturalLanguage(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={onConvert} 
          disabled={!naturalLanguage.trim() || isConverting}
          className="w-full"
          size="lg"
        >
          {isConverting ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Converting to SQL...
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              Generate SQL Query
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

QueryInput.displayName = 'QueryInput';
