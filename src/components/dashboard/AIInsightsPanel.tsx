
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'optimization' | 'warning' | 'success' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action?: string;
}

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI insights generation
    const generateInsights = () => {
      const sampleInsights: AIInsight[] = [
        {
          id: '1',
          type: 'optimization',
          title: 'Query Performance Opportunity',
          description: 'Found 3 queries that could benefit from index optimization. Potential 67% performance improvement.',
          impact: 'high',
          confidence: 94,
          action: 'Review Indexes'
        },
        {
          id: '2',
          type: 'prediction',
          title: 'Traffic Surge Prediction',
          description: 'AI predicts 40% traffic increase next week. Recommend scaling database resources.',
          impact: 'medium',
          confidence: 87,
          action: 'Prepare Scaling'
        },
        {
          id: '3',
          type: 'warning',
          title: 'Memory Usage Alert',
          description: 'Database memory usage trending upward. May hit limits in 5-7 days.',
          impact: 'high',
          confidence: 91,
          action: 'Monitor Memory'
        },
        {
          id: '4',
          type: 'success',
          title: 'Optimization Success',
          description: 'Recent query optimizations resulted in 45% faster response times.',
          impact: 'high',
          confidence: 100,
          action: 'View Details'
        }
      ];
      
      setInsights(sampleInsights);
      setIsLoading(false);
    };

    const timer = setTimeout(generateInsights, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (insights.length > 0) {
      const interval = setInterval(() => {
        setCurrentInsight((prev) => (prev + 1) % insights.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [insights.length]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return Zap;
      case 'warning': return AlertTriangle;  
      case 'success': return CheckCircle;
      case 'prediction': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'from-blue-500 to-purple-600';
      case 'warning': return 'from-yellow-500 to-orange-600';
      case 'success': return 'from-green-500 to-emerald-600';
      case 'prediction': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-700 bg-red-100 border-red-300';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-700 bg-green-100 border-green-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
            >
              <Brain className="h-5 w-5 text-white" />
            </motion.div>
            AI Insights Engine
            <Badge variant="secondary" className="animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Analyzing...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentInsightData = insights[currentInsight];
  const Icon = getInsightIcon(currentInsightData?.type);

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg"
          >
            <Brain className="h-5 w-5 text-white" />
          </motion.div>
          AI Insights Engine
          <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-green-300">
            <Target className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {currentInsightData && (
            <motion.div
              key={currentInsightData.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ 
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className={`p-3 rounded-xl bg-gradient-to-r ${getInsightColor(currentInsightData.type)} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </motion.div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">
                      {currentInsightData.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getImpactColor(currentInsightData.impact)}`}
                      >
                        {currentInsightData.impact.toUpperCase()} IMPACT
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {currentInsightData.confidence}% confident
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {currentInsightData.description}
                  </p>
                  
                  {currentInsightData.action && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                        onClick={() => console.log('Action clicked:', currentInsightData.action)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {currentInsightData.action}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>AI Confidence Level</span>
                  <span>{currentInsightData.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${currentInsightData.confidence}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insight Navigation Dots */}
        <div className="flex justify-center space-x-2 pt-2">
          {insights.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentInsight 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentInsight(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
