
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Database, Zap, BarChart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  action?: () => void;
}

export function QuickStartGuide() {
  const { user } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: Step[] = [
    {
      id: 'connect-db',
      title: 'Connect Your Database',
      description: 'Link your first database to start optimizing queries',
      icon: Database,
      completed: completedSteps.includes('connect-db'),
      action: () => {
        // Navigate to database connection
        window.location.href = '/db-import';
      }
    },
    {
      id: 'run-analysis',
      title: 'Run Your First Analysis',
      description: 'Analyze your database performance and get AI insights',
      icon: Zap,
      completed: completedSteps.includes('run-analysis'),
      action: () => {
        // Navigate to AI features
        window.location.href = '/ai-features';
      }
    },
    {
      id: 'view-reports',
      title: 'Explore Performance Reports',
      description: 'Check out detailed analytics and optimization recommendations',
      icon: BarChart,
      completed: completedSteps.includes('view-reports'),
      action: () => {
        // Navigate to reports
        window.location.href = '/reports';
      }
    },
    {
      id: 'invite-team',
      title: 'Invite Your Team',
      description: 'Collaborate with team members on database optimization',
      icon: Users,
      completed: completedSteps.includes('invite-team'),
      action: () => {
        // Navigate to teams
        window.location.href = '/teams';
      }
    }
  ];

  const completionPercentage = (completedSteps.length / steps.length) * 100;

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  if (completedSteps.length === steps.length) {
    return null; // Hide guide when all steps are completed
  }

  return (
    <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get started with DBooster in just a few steps
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {completedSteps.length}/{steps.length} Complete
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-4 p-3 rounded-lg border transition-all hover:shadow-sm",
              step.completed 
                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" 
                : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700"
            )}
          >
            <div className="flex-shrink-0">
              {step.completed ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <step.icon className={cn(
              "h-5 w-5",
              step.completed ? "text-green-600" : "text-blue-600"
            )} />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{step.title}</h4>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            {!step.completed && step.action && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  step.action?.();
                  markStepCompleted(step.id);
                }}
                className="text-xs"
              >
                Start
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
