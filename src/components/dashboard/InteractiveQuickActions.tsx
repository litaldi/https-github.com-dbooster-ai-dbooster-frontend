
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Database, 
  Zap, 
  Settings, 
  BarChart3, 
  Shield, 
  Rocket,
  Brain,
  Activity
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href?: string;
}

export function InteractiveQuickActions() {
  const quickActions: QuickAction[] = [
    {
      id: 'optimize',
      title: 'Run Optimization',
      description: 'Analyze and optimize database performance',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      href: '/app/optimization'
    },
    {
      id: 'monitor',
      title: 'Performance Monitor',
      description: 'Real-time performance monitoring',
      icon: Activity,
      color: 'from-green-500 to-emerald-600',
      href: '/app/monitoring'
    },
    {
      id: 'security',
      title: 'Security Scan',
      description: 'Run comprehensive security analysis',
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      href: '/app/security'
    },
    {
      id: 'ai-studio',
      title: 'AI Studio',
      description: 'Launch AI-powered query optimization',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      href: '/app/ai-studio'
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Deep dive into database analytics',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-600',
      href: '/app/analytics'
    },
    {
      id: 'settings',
      title: 'System Settings',
      description: 'Configure database connections',
      icon: Settings,
      color: 'from-gray-500 to-slate-600',
      href: '/app/settings'
    }
  ];

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/90 to-purple-900/80 backdrop-blur-sm border border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl"
          >
            <Rocket className="h-5 w-5 text-white" />
          </motion.div>
          Quick Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  className="w-full h-auto p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
                  asChild
                >
                  <div className="flex flex-col items-center gap-3 cursor-pointer">
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:shadow-xl transition-shadow`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    
                    <div className="text-center space-y-1">
                      <h3 className="text-white font-medium group-hover:text-purple-300 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Action Stats */}
        <motion.div
          className="mt-6 grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-lg font-bold text-white">12</div>
            <div className="text-xs text-gray-400">Actions Today</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-lg font-bold text-white">4.2s</div>
            <div className="text-xs text-gray-400">Avg Response</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-lg font-bold text-white">98%</div>
            <div className="text-xs text-gray-400">Success Rate</div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
