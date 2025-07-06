
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Database, TrendingUp, Shield, Sparkles, Rocket, Activity, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { StaggerContainer, StaggerItem } from '@/components/ui/animations';

export function EnhancedQuickActions() {
  const { isDemo } = useAuth();
  const [aiInitialized, setAiInitialized] = useState(false);

  useEffect(() => {
    // Simulate AI initialization
    const timer = setTimeout(() => setAiInitialized(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    {
      title: 'AI Query Optimizer',
      description: 'Real-time optimization with 95% accuracy',
      icon: Brain,
      href: '/app/ai-studio',
      highlight: true,
      status: aiInitialized ? 'ready' : 'initializing',
      gradient: 'from-primary to-blue-600'
    },
    {
      title: 'Connect Database',
      description: 'Enterprise-grade secure connections',
      icon: Database,
      href: '/app/settings',
      status: 'ready',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      title: 'Performance Analytics',
      description: 'Real-time monitoring & insights',
      icon: TrendingUp,
      href: '/app/analytics',
      status: 'ready',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      title: 'Security Dashboard',
      description: 'Advanced threat detection',
      icon: Shield,
      href: '/app/security',
      status: 'ready',
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'initializing':
        return <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />;
      case 'ready':
        return <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Actions Grid */}
      <StaggerContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            
            return (
              <StaggerItem key={index} delay={index * 0.1}>
                <Card className={`
                  relative overflow-hidden border-0 shadow-lg transition-all duration-300 
                  hover:shadow-xl hover:scale-105 cursor-pointer group
                  ${action.highlight ? 'ring-2 ring-primary/20' : ''}
                `}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className={`
                          p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg
                          group-hover:scale-110 transition-transform duration-300
                        `}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        {getStatusIndicator(action.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm leading-tight">
                          {action.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {action.description}
                        </p>
                      </div>

                      {action.highlight && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI-Powered
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
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>

      {/* Secondary Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2" asChild>
              <Link to="/app/settings">
                <div className="flex items-center gap-2 w-full">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Setup Database</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  Connect your first database in minutes
                </span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2" asChild>
              <Link to="/app/ai-studio">
                <div className="flex items-center gap-2 w-full">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Try AI Optimizer</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  {isDemo ? 'Experience AI with sample data' : 'Optimize your first query'}
                </span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2" asChild>
              <Link to="/app/monitoring">
                <div className="flex items-center gap-2 w-full">
                  <Activity className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Monitor Performance</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  Real-time database monitoring
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
