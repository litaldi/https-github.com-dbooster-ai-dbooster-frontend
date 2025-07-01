
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Database, TrendingUp, Shield, Sparkles } from 'lucide-react';
import { realAIService } from '@/services/ai/realAIService';
import { databaseConnectionManager } from '@/services/database/connectionManager';
import { StaggerContainer, StaggerItem } from '@/components/ui/animations';

export function EnhancedQuickActions() {
  const [aiInitialized, setAiInitialized] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    // Initialize AI service
    realAIService.initializeAI().then(setAiInitialized);
    
    // Load database connections
    databaseConnectionManager.getAllConnections().then(setConnections);
  }, []);

  const quickActions = [
    {
      title: 'AI Query Optimizer',
      description: 'Real-time optimization with 95% accuracy',
      icon: Brain,
      href: '#optimizer',
      highlight: true,
      status: aiInitialized ? 'ready' : 'initializing'
    },
    {
      title: 'Connect Database',
      description: 'Enterprise-grade secure connections',
      icon: Database,
      href: '#connections',
      status: 'ready'
    },
    {
      title: 'Performance Analytics',
      description: 'Real-time monitoring & insights',
      icon: TrendingUp,
      href: '#analytics',
      status: 'ready'
    },
    {
      title: 'Security Dashboard',
      description: 'Advanced threat detection',
      icon: Shield,
      href: '#security',
      status: 'ready'
    }
  ];

  return (
    <StaggerContainer>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <StaggerItem key={index} delay={index * 0.1}>
              <Card 
                className={`cursor-pointer hover:shadow-lg transition-all hover:scale-105 ${
                  action.highlight ? 'border-2 border-primary bg-gradient-to-br from-primary/10 to-blue-50' : ''
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className="relative">
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${action.highlight ? 'text-primary' : 'text-primary'}`} />
                    {action.status === 'initializing' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
                    )}
                    {action.status === 'ready' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  {action.highlight && (
                    <Badge variant="secondary" className="mt-2">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI-Powered
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </div>
    </StaggerContainer>
  );
}
