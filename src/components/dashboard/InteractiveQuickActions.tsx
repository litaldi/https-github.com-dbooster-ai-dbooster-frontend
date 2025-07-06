
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Database, 
  TrendingUp, 
  Shield, 
  Sparkles, 
  Rocket, 
  Activity, 
  Settings,
  Zap,
  Target,
  Globe,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  gradient: string;
  status: 'ready' | 'initializing' | 'hot' | 'new';
  category: 'ai' | 'database' | 'analytics' | 'security';
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export function InteractiveQuickActions() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const quickActions: QuickAction[] = [
    {
      id: 'ai-optimizer',
      title: 'AI Query Optimizer',
      description: 'Real-time optimization with 95% accuracy and instant recommendations',
      icon: Brain,
      href: '/app/ai-studio',
      gradient: 'from-purple-500 via-indigo-500 to-blue-600',
      status: 'hot',
      category: 'ai',
      estimatedTime: '30 seconds',
      difficulty: 'beginner'
    },
    {
      id: 'smart-indexing',
      title: 'Smart Index Analyzer',
      description: 'AI-powered index recommendations for optimal performance',
      icon: Zap,
      href: '/app/indexing',
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      status: 'new',
      category: 'ai',
      estimatedTime: '2 minutes',
      difficulty: 'intermediate'
    },
    {
      id: 'database-connect',
      title: 'Connect Database',
      description: 'Enterprise-grade secure connections with auto-discovery',
      icon: Database,
      href: '/app/settings',
      gradient: 'from-blue-500 via-cyan-500 to-teal-600',
      status: 'ready',
      category: 'database',
      estimatedTime: '5 minutes',
      difficulty: 'beginner'
    },
    {
      id: 'performance-analytics',
      title: 'Performance Analytics',
      description: 'Real-time monitoring with predictive insights',
      icon: TrendingUp,
      href: '/app/analytics',
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      status: 'ready',
      category: 'analytics',
      estimatedTime: '1 minute',
      difficulty: 'beginner'
    },
    {
      id: 'security-scanner',
      title: 'Security Scanner',
      description: 'Advanced threat detection and vulnerability assessment',
      icon: Shield,
      href: '/app/security',
      gradient: 'from-rose-400 via-pink-500 to-purple-600',
      status: 'ready',
      category: 'security',
      estimatedTime: '3 minutes',
      difficulty: 'intermediate'
    },
    {
      id: 'query-profiler',
      title: 'Query Performance Profiler',
      description: 'Deep analysis of query execution plans and bottlenecks',
      icon: Activity,
      href: '/app/profiler',
      gradient: 'from-indigo-400 via-purple-500 to-pink-600',
      status: 'new',
      category: 'analytics',
      estimatedTime: '90 seconds',
      difficulty: 'advanced'
    },
    {
      id: 'global-cdn',
      title: 'Global CDN Setup',
      description: 'Optimize database access with global edge locations',
      icon: Globe,
      href: '/app/cdn',
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      status: 'new',
      category: 'database',
      estimatedTime: '10 minutes',
      difficulty: 'advanced'
    },
    {
      id: 'auto-scaling',
      title: 'Auto-Scaling Engine',
      description: 'Intelligent resource scaling based on AI predictions',
      icon: Cpu,
      href: '/app/scaling',
      gradient: 'from-orange-400 via-red-500 to-pink-600',
      status: 'hot',
      category: 'ai',
      estimatedTime: '5 minutes',
      difficulty: 'intermediate'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Actions', icon: Target },
    { id: 'ai', name: 'AI Powered', icon: Brain },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot':
        return <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white animate-pulse">🔥 HOT</Badge>;
      case 'new':
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">✨ NEW</Badge>;
      case 'initializing':
        return <Badge variant="secondary" className="animate-pulse">⚡ Starting</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
            >
              <Rocket className="h-5 w-5 text-white" />
            </motion.div>
            Quick Actions Command Center
            <Badge variant="secondary" className="animate-pulse">
              <Sparkles className="h-3 w-3 mr-1" />
              Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                    ${selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Actions Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotateY: hoveredAction === action.id ? 5 : 0
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                onHoverStart={() => setHoveredAction(action.id)}
                onHoverEnd={() => setHoveredAction(null)}
                className="transform-gpu perspective-1000"
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm">
                  <div className={`h-2 bg-gradient-to-r ${action.gradient}`} />
                  
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <motion.div
                        className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} shadow-lg`}
                        animate={{ 
                          rotate: hoveredAction === action.id ? 360 : 0,
                          scale: hoveredAction === action.id ? 1.1 : 1
                        }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                      {getStatusBadge(action.status)}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg text-gray-800 leading-tight">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {action.estimatedTime && (
                          <Badge variant="outline" className="text-xs">
                            ⏱️ {action.estimatedTime}
                          </Badge>
                        )}
                        {action.difficulty && (
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(action.difficulty)}`}>
                            {action.difficulty}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: hoveredAction === action.id ? 1 : 0.8,
                        y: hoveredAction === action.id ? 0 : 10
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        asChild
                        className={`w-full bg-gradient-to-r ${action.gradient} hover:shadow-lg transition-all duration-300`}
                        size="sm"
                      >
                        <Link to={action.href}>
                          <Rocket className="h-4 w-4 mr-2" />
                          Launch
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
