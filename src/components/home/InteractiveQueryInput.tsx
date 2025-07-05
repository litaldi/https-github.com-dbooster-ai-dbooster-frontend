
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Play, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Suggestion {
  id: string;
  text: string;
  confidence: number;
  type: 'optimization' | 'indexing' | 'syntax';
  improvement: string;
}

const sampleSuggestions: Suggestion[] = [
  {
    id: '1',
    text: 'Add ORDER BY with LIMIT for better performance',
    confidence: 95,
    type: 'optimization',
    improvement: '60% faster'
  },
  {
    id: '2',
    text: 'Consider adding an index on date column',
    confidence: 88,
    type: 'indexing',
    improvement: '3x faster'
  },
  {
    id: '3',
    text: 'Replace SELECT * with specific columns',
    confidence: 92,
    type: 'optimization',
    improvement: '40% faster'
  }
];

const sampleQueries = [
  'SELECT * FROM users WHERE created_at > "2024-01-01"',
  'SELECT users.name, COUNT(orders.id) FROM users LEFT JOIN orders ON users.id = orders.user_id GROUP BY users.id',
  'UPDATE products SET stock = stock - 1 WHERE id = 123 AND stock > 0',
  'SELECT SUM(amount) FROM transactions WHERE status = "completed" AND date BETWEEN "2024-01-01" AND "2024-12-31"'
];

export function InteractiveQueryInput() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setShowSuggestions(false);
    setAnalysisComplete(false);

    // Simulate AI analysis delay
    setTimeout(() => {
      setSuggestions(sampleSuggestions);
      setShowSuggestions(true);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2000);
  };

  const handleTrySample = (sampleQuery: string) => {
    setQuery(sampleQuery);
    setShowSuggestions(false);
    setAnalysisComplete(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    if (confidence >= 80) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return CheckCircle;
      case 'indexing': return Clock;
      case 'syntax': return AlertCircle;
      default: return Sparkles;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Try Our AI Query Optimizer</h3>
        </div>

        {/* Query Input */}
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Paste your SQL query here and let our AI optimize it..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-32 font-mono text-sm resize-none focus:ring-2 focus:ring-primary/20"
              disabled={isAnalyzing}
            />
            
            {/* Analysis overlay */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center"
                >
                  <div className="flex items-center gap-3 text-primary">
                    <motion.div
                      className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="font-medium">AI analyzing your query...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <EnhancedButton
              onClick={handleAnalyze}
              disabled={!query.trim() || isAnalyzing}
              loading={isAnalyzing}
              loadingText="Analyzing..."
              className="flex-1 sm:flex-none"
            >
              <Play className="h-4 w-4 mr-2" />
              Optimize Query
            </EnhancedButton>

            <div className="flex flex-wrap gap-2">
              {sampleQueries.slice(0, 2).map((sample, index) => (
                <EnhancedButton
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTrySample(sample)}
                  disabled={isAnalyzing}
                  className="text-xs"
                >
                  Try Sample {index + 1}
                </EnhancedButton>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-600">Analysis Complete</h4>
                <Badge variant="secondary" className="ml-auto">
                  {suggestions.length} suggestions
                </Badge>
              </div>

              <div className="space-y-3">
                {suggestions.map((suggestion, index) => {
                  const TypeIcon = getTypeIcon(suggestion.type);
                  return (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border/30 hover:bg-muted/70 transition-colors duration-200"
                    >
                      <TypeIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-medium">{suggestion.text}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30">
                              {suggestion.improvement}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                            >
                              {suggestion.confidence}% confidence
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {suggestion.type}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center"
              >
                <EnhancedButton variant="outline" className="text-sm">
                  View Detailed Analysis
                </EnhancedButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
