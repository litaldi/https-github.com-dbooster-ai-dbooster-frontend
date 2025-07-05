
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Code, Zap, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  code: string;
  optimizedCode: string;
  improvement: string;
  metrics: {
    before: { time: string; cost: string };
    after: { time: string; cost: string };
  };
}

export function InteractiveDemoSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: "slow-query",
      title: "Slow Query Analysis",
      description: "AI identifies performance bottlenecks in complex joins",
      code: `SELECT u.*, p.*, o.*
FROM users u
JOIN profiles p ON u.id = p.user_id
JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
ORDER BY u.created_at DESC;`,
      optimizedCode: `SELECT u.*, p.*, o.*
FROM users u
INNER JOIN profiles p ON u.id = p.user_id
INNER JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2023-01-01'
  AND u.id IN (
    SELECT DISTINCT user_id FROM orders 
    WHERE created_at > '2023-01-01'
  )
ORDER BY u.id DESC;
-- Added composite index: (created_at, id)`,
      improvement: "73% faster execution",
      metrics: {
        before: { time: "2.3s", cost: "$45/month" },
        after: { time: "0.62s", cost: "$18/month" }
      }
    },
    {
      id: "index-optimization",
      title: "Smart Index Recommendations",
      description: "AI suggests optimal indexes for your query patterns",
      code: `SELECT product_name, category, price
FROM products 
WHERE category = 'electronics' 
  AND price BETWEEN 100 AND 500
  AND in_stock = true
ORDER BY popularity_score DESC;`,
      optimizedCode: `-- AI Recommended Indexes:
CREATE INDEX idx_products_category_price_stock 
ON products(category, price, in_stock);

CREATE INDEX idx_products_popularity 
ON products(popularity_score DESC);

-- Optimized Query (unchanged)
SELECT product_name, category, price
FROM products 
WHERE category = 'electronics' 
  AND price BETWEEN 100 AND 500
  AND in_stock = true
ORDER BY popularity_score DESC;`,
      improvement: "89% faster execution",
      metrics: {
        before: { time: "1.8s", cost: "$32/month" },
        after: { time: "0.2s", cost: "$12/month" }
      }
    },
    {
      id: "query-rewrite",
      title: "Intelligent Query Rewriting",
      description: "AI restructures queries for optimal performance",
      code: `SELECT DISTINCT u.email
FROM users u
WHERE u.id IN (
  SELECT o.user_id 
  FROM orders o 
  WHERE o.total > 1000
    AND o.created_at > NOW() - INTERVAL '30 days'
);`,
      optimizedCode: `SELECT u.email
FROM users u
INNER JOIN (
  SELECT DISTINCT user_id
  FROM orders 
  WHERE total > 1000
    AND created_at > CURRENT_DATE - INTERVAL '30 days'
) o ON u.id = o.user_id;
-- Eliminated correlated subquery
-- Added date function optimization`,
      improvement: "65% faster execution",
      metrics: {
        before: { time: "1.2s", cost: "$28/month" },
        after: { time: "0.42s", cost: "$16/month" }
      }
    }
  ];

  const playDemo = () => {
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < demoSteps.length - 1) {
        step++;
        setActiveStep(step);
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary">
            <Play className="h-3 w-3 mr-2" />
            Interactive Demo
          </Badge>
          <h2 className="text-3xl font-bold mb-4">
            See DBooster AI in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Watch how our AI transforms slow queries into high-performance database operations in real-time
          </p>
          
          <Button 
            onClick={playDemo} 
            disabled={isPlaying}
            size="lg"
            className="mb-8"
          >
            {isPlaying ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Zap className="h-5 w-5" />
                </motion.div>
                Running Demo...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Interactive Demo
              </>
            )}
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs value={demoSteps[activeStep].id} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {demoSteps.map((step, index) => (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id}
                  onClick={() => setActiveStep(index)}
                  className="relative"
                >
                  {step.title}
                  {isPlaying && index === activeStep && (
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded-md"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              {demoSteps.map((step, index) => (
                <TabsContent key={step.id} value={step.id} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Before */}
                      <Card className="border-2 border-red-200 bg-red-50/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-red-700">
                            <Code className="h-5 w-5" />
                            Original Query
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-background p-4 rounded-lg text-sm overflow-x-auto mb-4 border">
                            <code>{step.code}</code>
                          </pre>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-red-100 rounded-lg">
                              <div className="text-lg font-bold text-red-700">{step.metrics.before.time}</div>
                              <div className="text-xs text-red-600">Execution Time</div>
                            </div>
                            <div className="text-center p-3 bg-red-100 rounded-lg">
                              <div className="text-lg font-bold text-red-700">{step.metrics.before.cost}</div>
                              <div className="text-xs text-red-600">Monthly Cost</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* After */}
                      <Card className="border-2 border-green-200 bg-green-50/50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-green-700">
                            <Zap className="h-5 w-5" />
                            AI-Optimized Query
                            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                              {step.improvement}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-background p-4 rounded-lg text-sm overflow-x-auto mb-4 border">
                            <code>{step.optimizedCode}</code>
                          </pre>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-green-100 rounded-lg">
                              <div className="text-lg font-bold text-green-700">{step.metrics.after.time}</div>
                              <div className="text-xs text-green-600">Execution Time</div>
                            </div>
                            <div className="text-center p-3 bg-green-100 rounded-lg">
                              <div className="text-lg font-bold text-green-700">{step.metrics.after.cost}</div>
                              <div className="text-xs text-green-600">Monthly Cost</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">{step.description}</span>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Try DBooster Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              No credit card required • 5-minute setup • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
