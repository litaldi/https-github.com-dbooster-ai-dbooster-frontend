
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Insight {
  id: string;
  type: 'optimization' | 'warning' | 'success';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}

export function AIInsightsPanel() {
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const insights: Insight[] = [
    {
      id: '1',
      type: 'optimization',
      title: 'Query Optimization Opportunity',
      description: 'Detected slow JOIN operations on users table. Adding composite index could improve performance by 67%.',
      confidence: 94,
      impact: 'high'
    },
    {
      id: '2',
      type: 'success',
      title: 'Cache Hit Rate Improved',
      description: 'Recent optimizations increased cache efficiency by 23%. Memory usage optimized successfully.',
      confidence: 98,
      impact: 'medium'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Connection Pool Alert',
      description: 'Connection pool approaching 80% capacity during peak hours. Consider scaling.',
      confidence: 87,
      impact: 'medium'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'from-blue-500 to-cyan-600';
      case 'warning': return 'from-yellow-500 to-orange-600';
      case 'success': return 'from-green-500 to-emerald-600';
      default: return 'from-purple-500 to-pink-600';
    }
  };

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/90 to-purple-900/80 backdrop-blur-sm border border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl"
          >
            <Brain className="h-5 w-5 text-white" />
          </motion.div>
          AI-Powered Insights
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            Smart Analysis
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type);
          const isActive = activeInsight === insight.id;
          
          return (
            <motion.div
              key={insight.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white/10 border-purple-400/50 shadow-lg' 
                  : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveInsight(isActive ? null : insight.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className={`p-2 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type)}`}
                  animate={{ rotate: isActive ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="h-4 w-4 text-white" />
                </motion.div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          insight.impact === 'high' 
                            ? 'border-red-400/30 text-red-300' 
                            : insight.impact === 'medium'
                            ? 'border-yellow-400/30 text-yellow-300'
                            : 'border-green-400/30 text-green-300'
                        }`}
                      >
                        {insight.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                        {insight.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {insight.description}
                  </p>
                  
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-white/10"
                    >
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        >
                          Apply Suggestion
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Learn More
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Neural Network Status */}
        <motion.div
          className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-4 w-4 text-indigo-300" />
            <span className="text-sm font-medium text-white">Neural Network Status</span>
            <div className="flex-1 h-1 bg-indigo-900/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: '87%' }}
                transition={{ duration: 2, delay: 0.7 }}
              />
            </div>
            <span className="text-xs text-indigo-300">87%</span>
          </div>
          <p className="text-xs text-gray-300">
            AI model processing 2.3M data points per second. Pattern recognition accuracy: 94.2%
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}
