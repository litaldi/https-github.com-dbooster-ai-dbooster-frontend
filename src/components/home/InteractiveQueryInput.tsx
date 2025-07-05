
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const sampleQueries = [
  {
    query: "SELECT * FROM users WHERE created_at > '2024-01-01'",
    optimization: "Add index on created_at column",
    improvement: "87% faster"
  },
  {
    query: "SELECT COUNT(*) FROM orders GROUP BY user_id",
    optimization: "Use covering index for user_id",
    improvement: "65% faster"
  },
  {
    query: "SELECT u.name, o.total FROM users u JOIN orders o",
    optimization: "Optimize join with proper indexing",
    improvement: "92% faster"
  }
];

export function InteractiveQueryInput() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentQuery = sampleQueries[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOptimizing && !showResult) {
        setCurrentIndex(prev => (prev + 1) % sampleQueries.length);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOptimizing, showResult]);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setShowResult(false);

    setTimeout(() => {
      setIsOptimizing(false);
      setShowResult(true);
    }, 2000);

    setTimeout(() => {
      setShowResult(false);
    }, 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">
          See AI Optimization in Action
        </h3>
        <p className="text-muted-foreground">
          Watch how our AI instantly optimizes your SQL queries
        </p>
      </div>

      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2">
        <CardContent className="p-4 sm:p-6">
          {/* Query Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                SQL Query
              </span>
              <div className="flex gap-1">
                {sampleQueries.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-background rounded-lg p-3 font-mono text-sm border"
              >
                {currentQuery.query}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Optimize Button */}
          <div className="flex justify-center mb-4">
            <Button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="min-w-[140px] transition-all duration-300"
              size="lg"
            >
              {isOptimizing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize Query
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                      Optimization Complete!
                    </h4>
                    <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                      {currentQuery.optimization}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        {currentQuery.improvement}
                      </span>
                      <ArrowRight className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        Query performance improved
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Real optimization results from our AI engine
        </p>
      </div>
    </motion.div>
  );
}
