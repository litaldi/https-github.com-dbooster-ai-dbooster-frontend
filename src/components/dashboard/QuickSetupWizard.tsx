
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Database, 
  Settings, 
  Zap,
  Shield,
  Play
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { productionLogger } from '@/utils/productionLogger';

interface QuickSetupWizardProps {
  onClose: () => void;
}

export function QuickSetupWizard({ onClose }: QuickSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'connect',
      title: 'Connect Repository',
      description: 'Link your first database repository',
      icon: Database,
      completed: false,
      action: 'Connect Now'
    },
    {
      id: 'configure',
      title: 'Configure Settings',
      description: 'Set up your optimization preferences',
      icon: Settings,
      completed: false,
      action: 'Configure'
    },
    {
      id: 'optimize',
      title: 'Run First Analysis',
      description: 'Analyze your queries for optimization opportunities',
      icon: Zap,
      completed: false,
      action: 'Start Analysis'
    },
    {
      id: 'security',
      title: 'Security Setup',
      description: 'Configure security monitoring and alerts',
      icon: Shield,
      completed: false,
      action: 'Setup Security'
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepAction = (stepIndex: number) => {
    // Here you would implement the actual step logic
    productionLogger.debug(`Executing step ${stepIndex}`, {}, 'QuickSetupWizard');
    // For demo purposes, we'll just mark it as completed
    setCurrentStep(stepIndex + 1);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Quick Setup Wizard
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup Progress</span>
              <span>{completedSteps} of {steps.length} completed</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = step.completed;
              
              return (
                <Card 
                  key={step.id} 
                  className={`transition-all ${
                    isActive ? 'ring-2 ring-primary bg-primary/5' : 
                    isCompleted ? 'bg-green-50 border-green-200' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isCompleted ? 'bg-green-100 text-green-600' :
                          isActive ? 'bg-primary/10 text-primary' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isCompleted ? 'default' : 'outline'}>
                          Step {index + 1}
                        </Badge>
                        {isActive && (
                          <Button 
                            size="sm"
                            onClick={() => handleStepAction(index)}
                          >
                            {step.action}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="ghost" onClick={handleSkip}>
              Skip Setup
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Save Progress
              </Button>
              {completedSteps === steps.length && (
                <Button onClick={onClose}>
                  Finish Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
