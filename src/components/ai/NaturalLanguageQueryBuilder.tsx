
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Code, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface ConversionResult {
  sql: string;
  explanation: string;
  confidence: number;
  alternatives: string[];
}

export function NaturalLanguageQueryBuilder() {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!naturalLanguage.trim()) return;

    setIsConverting(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      const conversionResult = await nextGenAIService.convertNaturalLanguageToSQL({
        naturalLanguage,
        context: {
          schema: 'users, orders, products',
          recentQueries: []
        }
      });
      setResult(conversionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      console.error('Natural language conversion failed:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Natural Language to SQL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Describe what you want to query in plain English</label>
          <Textarea
            placeholder="Example: Show me all active users who placed orders in the last 30 days, ordered by their registration date"
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            rows={3}
          />
        </div>
        
        <Button onClick={handleConvert} disabled={isConverting || !naturalLanguage.trim()}>
          {isConverting ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Convert to SQL
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  Generated SQL
                </Badge>
                <Badge variant="outline" className={getConfidenceColor(result.confidence)}>
                  {Math.round(result.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm font-mono whitespace-pre-wrap">{result.sql}</pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Explanation:</h4>
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              </div>

              {result.alternatives.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Alternative Approaches:</h4>
                  <ul className="space-y-1">
                    {result.alternatives.map((alt, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
