
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuerySuggestion {
  id: string;
  suggestion: string;
  type: 'completion' | 'optimization' | 'alternative';
  confidence: number;
  improvement?: string;
  reasoning: string;
}

interface QueryAutoCompleteProps {
  currentQuery: string;
  onApplySuggestion: (suggestion: string) => void;
  onQueryChange: (query: string) => void;
}

export function QueryAutoComplete({ currentQuery, onApplySuggestion, onQueryChange }: QueryAutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (currentQuery.length > 10) {
      analyzeQuery(currentQuery);
    } else {
      setSuggestions([]);
    }
  }, [currentQuery]);

  const analyzeQuery = async (query: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockSuggestions: QuerySuggestion[] = [];
      
      // Auto-completion suggestions
      if (query.toLowerCase().includes('select') && !query.toLowerCase().includes('from')) {
        mockSuggestions.push({
          id: '1',
          suggestion: query + ' FROM users',
          type: 'completion',
          confidence: 95,
          reasoning: 'Common pattern: SELECT statements typically need a FROM clause'
        });
      }
      
      // Optimization suggestions
      if (query.toLowerCase().includes('select *')) {
        mockSuggestions.push({
          id: '2',
          suggestion: query.replace('*', 'id, name, email'),
          type: 'optimization',
          confidence: 88,
          improvement: '40% faster',
          reasoning: 'Selecting specific columns is more efficient than SELECT *'
        });
      }
      
      // Alternative approaches
      if (query.toLowerCase().includes('where') && query.toLowerCase().includes('like')) {
        mockSuggestions.push({
          id: '3',
          suggestion: query.replace(/LIKE '(.+)'/, "ILIKE '$1'"),
          type: 'alternative',
          confidence: 82,
          improvement: 'Case-insensitive',
          reasoning: 'ILIKE provides case-insensitive matching for better UX'
        });
      }
      
      setSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 800);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'completion': return Zap;
      case 'optimization': return TrendingUp;
      case 'alternative': return Lightbulb;
      default: return Lightbulb;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'completion': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'optimization': return 'bg-green-100 text-green-800 border-green-200';
      case 'alternative': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!suggestions.length && !isAnalyzing) return null;

  return (
    <Card className="mt-4 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          AI Query Suggestions
          {isAnalyzing && (
            <motion.div
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => {
            const Icon = getSuggestionIcon(suggestion.type);
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={`text-xs ${getSuggestionColor(suggestion.type)}`}>
                        {suggestion.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {suggestion.improvement && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            {suggestion.improvement}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {suggestion.confidence}% confident
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-muted/50 p-2 rounded text-xs font-mono">
                      {suggestion.suggestion}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {suggestion.reasoning}
                    </p>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onApplySuggestion(suggestion.suggestion)}
                      className="text-xs h-7"
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
