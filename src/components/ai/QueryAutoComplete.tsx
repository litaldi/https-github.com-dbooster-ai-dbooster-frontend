
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Suggestion {
  id: string;
  text: string;
  type: 'completion' | 'optimization' | 'alternative';
  confidence: number;
}

interface QueryAutoCompleteProps {
  currentQuery: string;
  onApplySuggestion: (suggestion: string) => void;
  onQueryChange: (query: string) => void;
}

export function QueryAutoComplete({ currentQuery, onApplySuggestion, onQueryChange }: QueryAutoCompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (currentQuery.length > 10) {
      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [currentQuery]);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI-powered suggestions
    setTimeout(() => {
      const mockSuggestions: Suggestion[] = [
        {
          id: '1',
          text: 'SELECT u.name, u.email FROM users u WHERE u.status = \'active\' ORDER BY u.created_at DESC LIMIT 10',
          type: 'completion',
          confidence: 0.92
        },
        {
          id: '2',
          text: 'Add INDEX ON users(status, created_at) for better performance',
          type: 'optimization',
          confidence: 0.88
        },
        {
          id: '3',
          text: 'Consider using EXISTS instead of IN for better performance',
          type: 'alternative',
          confidence: 0.75
        }
      ];
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 1000);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'completion': return <Brain className="h-4 w-4" />;
      case 'optimization': return <Zap className="h-4 w-4" />;
      case 'alternative': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'completion': return 'default';
      case 'optimization': return 'secondary';
      case 'alternative': return 'outline';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI-Powered Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isGenerating && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-4 w-4 animate-pulse" />
            <span>Analyzing query and generating suggestions...</span>
          </div>
        )}
        
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getSuggestionIcon(suggestion.type)}
                        <Badge variant={getSuggestionColor(suggestion.type) as any}>
                          {suggestion.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(suggestion.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {suggestion.text}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onApplySuggestion(suggestion.text)}
                    >
                      Apply
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
