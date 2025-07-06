
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Mic, 
  Volume2, 
  Sparkles, 
  Zap, 
  Target,
  MessageCircle,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'suggestion' | 'insight' | 'warning' | 'success';
  title: string;
  content: string;
  confidence: number;
  timestamp: Date;
}

export function AIAvatarAssistant() {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<AIMessage | null>(null);
  const [emotion, setEmotion] = useState<'neutral' | 'thinking' | 'excited' | 'concerned'>('neutral');

  const aiMessages: AIMessage[] = [
    {
      id: '1',
      type: 'suggestion',
      title: 'Performance Optimization Available',
      content: 'I detected 3 queries that could benefit from indexing. Shall I create the optimization plan?',
      confidence: 94,
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'insight',
      title: 'Usage Pattern Detected',
      content: 'Your database load increases by 67% every Tuesday at 2 PM. Consider auto-scaling.',
      confidence: 89,
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'warning',
      title: 'Resource Alert',
      content: 'Memory usage trending upward. Estimated 5 days until threshold reached.',
      confidence: 92,
      timestamp: new Date()
    }
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (isActive) {
        const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
        setCurrentMessage(randomMessage);
        
        // Set emotion based on message type
        switch (randomMessage.type) {
          case 'warning':
            setEmotion('concerned');
            break;
          case 'success':
            setEmotion('excited');
            break;
          case 'insight':
            setEmotion('thinking');
            break;
          default:
            setEmotion('neutral');
        }
      }
    }, 8000);

    return () => clearInterval(messageInterval);
  }, [isActive]);

  const getEmotionGradient = () => {
    switch (emotion) {
      case 'thinking':
        return 'from-blue-400 via-indigo-500 to-purple-600';
      case 'excited':
        return 'from-green-400 via-emerald-500 to-teal-600';
      case 'concerned':
        return 'from-yellow-400 via-orange-500 to-red-600';
      default:
        return 'from-indigo-400 via-purple-500 to-pink-600';
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return Lightbulb;
      case 'insight': return TrendingUp;
      case 'warning': return Target;
      case 'success': return Sparkles;
      default: return Brain;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isActive && currentMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 mr-4"
          >
            <Card className="w-80 bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-xl border border-purple-500/30 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <motion.div
                    className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {React.createElement(getMessageIcon(currentMessage.type), { 
                      className: "h-4 w-4 text-purple-300" 
                    })}
                  </motion.div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">
                        {currentMessage.title}
                      </h4>
                      <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-300">
                        {currentMessage.confidence}% confident
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {currentMessage.content}
                    </p>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="h-6 text-xs border-purple-400/30 hover:bg-purple-500/20">
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 text-xs text-gray-400 hover:text-white">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Avatar */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          onClick={() => setIsActive(!isActive)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${getEmotionGradient()} shadow-2xl relative overflow-hidden`}
          animate={{
            boxShadow: isActive 
              ? '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3)'
              : '0 0 20px rgba(168, 85, 247, 0.4)'
          }}
        >
          {/* Pulsing Core */}
          <motion.div
            className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"
            animate={{
              scale: isActive ? [1, 1.2, 1] : 1,
              opacity: isActive ? [0.5, 0.8, 0.5] : 0.6
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Neural Network Pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          {/* Activity Indicator */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
              >
                <motion.div
                  className="w-full h-full bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Voice Control Indicators */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex items-center gap-1 px-2 py-1 bg-red-500 rounded-full">
                <Mic className="h-3 w-3 text-white" />
                <motion.div
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 flex gap-2"
          >
            <motion.button
              onClick={() => setIsListening(!isListening)}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mic className="h-4 w-4 text-white" />
            </motion.button>
            
            <motion.button
              className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 className="h-4 w-4 text-white" />
            </motion.button>
            
            <motion.button
              className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="h-4 w-4 text-white" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
