
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Zap, TrendingUp } from 'lucide-react';

interface QueryTransformation {
  id: string;
  before: string;
  after: string;
  improvement: string;
  type: 'optimization' | 'indexing' | 'caching';
}

const sampleTransformations: QueryTransformation[] = [
  {
    id: '1',
    before: 'SELECT * FROM orders WHERE date > "2024-01-01"',
    after: 'SELECT id, total FROM orders WHERE date > "2024-01-01" ORDER BY date LIMIT 100',
    improvement: '75% faster',
    type: 'optimization'
  },
  {
    id: '2',
    before: 'SELECT users.*, COUNT(orders.id) FROM users LEFT JOIN orders',
    after: 'SELECT users.id, users.name, user_stats.order_count FROM users JOIN user_stats',
    improvement: '10x faster',
    type: 'indexing'
  },
  {
    id: '3',
    before: 'SELECT SUM(amount) FROM transactions WHERE status = "completed"',
    after: 'SELECT cached_totals.completed_sum FROM cached_totals WHERE updated_at > NOW() - INTERVAL 1 HOUR',
    improvement: '95% faster',
    type: 'caching'
  }
];

export function FloatingQuerySnippets() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sampleTransformations.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentTransformation = sampleTransformations[currentIndex];
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Code;
      case 'indexing': return TrendingUp;
      case 'caching': return Zap;
      default: return Code;
    }
  };

  const TypeIcon = getTypeIcon(currentTransformation.type);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative h-full w-full">
        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 left-10 w-2 h-2 bg-primary/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-3 h-3 bg-green-500/20 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-1 h-1 bg-blue-500/30 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Main floating query transformation */}
        <motion.div
          className="absolute top-1/4 right-8 max-w-md"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentTransformation.id}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                transition={{ duration: 0.5 }}
                className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <TypeIcon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {currentTransformation.type}
                  </span>
                  <div className="flex-1" />
                  <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {currentTransformation.improvement}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Before:</div>
                    <code className="text-xs bg-muted/50 p-2 rounded block text-red-600 dark:text-red-400 font-mono leading-relaxed">
                      {currentTransformation.before}
                    </code>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-xs text-muted-foreground mb-1">After:</div>
                    <code className="text-xs bg-muted/50 p-2 rounded block text-green-600 dark:text-green-400 font-mono leading-relaxed">
                      {currentTransformation.after}
                    </code>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Secondary floating element */}
        <motion.div
          className="absolute bottom-1/4 left-8 max-w-xs"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-lg p-3 shadow-md"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">
                AI Analysis Complete
              </span>
            </div>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Query Performance:</span>
                <span className="text-green-600 font-medium">Excellent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Execution Time:</span>
                <span className="text-green-600 font-medium">0.23s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Optimization:</span>
                <span className="text-green-600 font-medium">Applied</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
