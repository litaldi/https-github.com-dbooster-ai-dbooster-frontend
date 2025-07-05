
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  benefit: string;
  completed?: boolean;
}

interface OnboardingStepsProps {
  steps: OnboardingStep[];
  currentStep: number;
  completedSteps: string[];
  isPlaying: boolean;
  onStepAction: (step: OnboardingStep) => void;
}

export function OnboardingSteps({ 
  steps, 
  currentStep, 
  completedSteps, 
  isPlaying, 
  onStepAction 
}: OnboardingStepsProps) {
  return (
    <div className="grid gap-6">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = index === currentStep && !isCompleted;
        const StepIcon = step.icon;

        return (
          <FadeIn key={step.id} delay={index * 0.1}>
            <Card className={`transition-all duration-300 hover:shadow-lg ${
              isCurrent 
                ? 'border-primary shadow-lg scale-105 bg-primary/5' 
                : isCompleted 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'hover:shadow-md hover:border-primary/30'
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isCurrent 
                          ? 'bg-primary/10' 
                          : 'bg-muted'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      ) : (
                        <StepIcon className={`h-8 w-8 ${
                          isCurrent ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        {step.title}
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Complete
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="default">
                            Current Step
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2 text-base leading-relaxed">{step.description}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          <Sparkles className="h-3 w-3 mr-1" />
                          {step.benefit}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <EnhancedButton
                    onClick={() => onStepAction(step)}
                    variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                    className="min-w-[160px] h-12"
                    size="lg"
                  >
                    {isCompleted ? 'Revisit' : step.action}
                    {!isCompleted && <ArrowRight className="ml-2 h-4 w-4" />}
                  </EnhancedButton>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>
        );
      })}
    </div>
  );
}
