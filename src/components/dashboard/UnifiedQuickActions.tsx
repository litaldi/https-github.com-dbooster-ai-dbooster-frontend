
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Brain, 
  Activity, 
  Shield, 
  TrendingUp, 
  Settings,
  ChevronRight,
  Sparkles,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  highlight?: boolean;
  gradient?: string;
}

const defaultActions: QuickAction[] = [
  {
    title: "AI Query Optimizer",
    description: "Real-time optimization with 95% accuracy",
    icon: Brain,
    href: "/app/ai-studio",
    highlight: true,
    badge: "AI-Powered",
    gradient: "from-primary to-blue-600"
  },
  {
    title: "Connect Database",
    description: "Enterprise-grade secure connections",
    icon: Database,
    href: "/app/settings",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    title: "Performance Analytics",
    description: "Real-time monitoring & insights",
    icon: TrendingUp,
    href: "/app/analytics",
    gradient: "from-green-600 to-emerald-600"
  },
  {
    title: "Security Dashboard",
    description: "Advanced threat detection",
    icon: Shield,
    href: "/app/security",
    gradient: "from-purple-600 to-pink-600"
  }
];

interface UnifiedQuickActionsProps {
  actions?: QuickAction[];
  title?: string;
  description?: string;
  variant?: 'grid' | 'list';
}

export function UnifiedQuickActions({ 
  actions = defaultActions, 
  title = "Quick Actions",
  description = "Essential tools for database optimization",
  variant = 'grid'
}: UnifiedQuickActionsProps) {
  if (variant === 'list') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Button 
                    variant="ghost" 
                    className="w-full h-auto p-6 justify-start text-left hover:bg-accent/50 border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 group"
                    asChild
                  >
                    <Link to={action.href} className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-2xl bg-gradient-to-br group-hover:scale-110 transition-transform duration-300",
                        action.gradient || "from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10"
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base mb-2 group-hover:text-primary transition-colors">
                          {action.title}
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {action.description}
                        </div>
                        {action.badge && (
                          <Badge variant="secondary" className="mt-2">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {action.badge}
                          </Badge>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={cn(
              "relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer group",
              action.highlight && "ring-2 ring-primary/20"
            )}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <div className={cn(
                      "p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300",
                      action.gradient ? `bg-gradient-to-br ${action.gradient}` : "bg-gradient-to-br from-primary to-blue-600"
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm leading-tight">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  {action.badge && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {action.badge}
                    </Badge>
                  )}

                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Link to={action.href}>
                      Launch
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
