
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Play, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNaturalLanguageQuery } from '@/hooks/useNaturalLanguageQuery';

export function NaturalLanguageQueryBuilder() {
  const {
    naturalLanguage,
    setNaturalLanguage,
    isConverting,
    result,
    handleConvert,
    copyToClipboard
  } = useNaturalLanguageQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Natural Language to SQL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Describe what you want to query</label>
          <Textarea
            placeholder="Example: Show me all users who placed orders in the last 30 days with their total order value"
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleConvert} 
          disabled={isConverting || !naturalLanguage.trim()}
          className="w-full"
        >
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

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Generated SQL</h4>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {Math.round(result.confidence * 100)}% confidence
                </Badge>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {result.sql}
                </pre>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-medium">Explanation</h5>
                <p className="text-sm text-muted-foreground">{result.explanation}</p>
              </div>

              {result.alternatives.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Alternative Approaches</h5>
                  <div className="space-y-1">
                    {result.alternatives.map((alt, index) => (
                      <div key={index} className="text-xs bg-muted/50 p-2 rounded">
                        {alt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(result.sql)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy SQL
                </Button>
                <Button size="sm" variant="outline">
                  <Play className="h-3 w-3 mr-1" />
                  Run Query
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
