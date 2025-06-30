
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Code, 
  Lightbulb, 
  Play, 
  Copy,
  Sparkles,
  Brain,
  ArrowRight
} from 'lucide-react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

interface ConversionResult {
  sql: string;
  explanation: string;
  confidence: number;
  alternatives: string[];
}

export function NaturalLanguageQueryBuilder() {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  const exampleQueries = [
    "Show me all users who signed up in the last 30 days",
    "Find the top 10 products by revenue this quarter",
    "Get all orders from customers in California with status 'shipped'",
    "Show me users who have made more than 5 purchases",
    "Find duplicate email addresses in the users table",
    "Get the average order value by month for this year"
  ];

  const handleConvert = async () => {
    if (!naturalLanguage.trim()) {
      enhancedToast.warning({
        title: "No Request Provided",
        description: "Please describe what you want to query.",
      });
      return;
    }

    setIsConverting(true);
    setResult(null);

    try {
      const conversionResult = await nextGenAIService.convertNaturalLanguageToSQL({
        naturalLanguage,
        context: {
          schema: 'demo_schema', // In real app, this would come from selected database
          recentQueries: []
        }
      });

      setResult(conversionResult);

      enhancedToast.success({
        title: "Query Generated Successfully",
        description: `SQL generated with ${Math.round(conversionResult.confidence * 100)}% confidence`,
      });
    } catch (error) {
      enhancedToast.error({
        title: "Conversion Failed",
        description: "Unable to convert natural language to SQL. Please try again.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    enhancedToast.success({
      title: "Copied to Clipboard",
      description: "SQL query has been copied to your clipboard.",
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <FadeIn>
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
                onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
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
              onClick={handleConvert} 
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
      </FadeIn>

      {result && (
        <ScaleIn delay={0.2}>
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
                      onClick={() => copyToClipboard(result.sql)}
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
                        onClick={() => copyToClipboard(alternative)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ScaleIn>
      )}

      {exampleQueries.slice(3).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">More Examples to Try</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {exampleQueries.slice(3).map((example, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-50 transition-colors p-3 text-xs justify-start h-auto whitespace-normal"
                  onClick={() => setNaturalLanguage(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
