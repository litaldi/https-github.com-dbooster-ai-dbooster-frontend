
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Zap, 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  Users,
  Shield
} from 'lucide-react';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  optional?: boolean;
}

interface QuickSetupWizardProps {
  onClose: () => void;
}

export function QuickSetupWizard({ onClose }: QuickSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'database',
      title: 'Connect Database',
      description: 'Set up your first database connection',
      icon: Database,
      completed: true
    },
    {
      id: 'queries',
      title: 'Analyze Queries',
      description: 'Run your first query analysis',
      icon: Zap,
      completed: true
    },
    {
      id: 'ai-studio',
      title: 'Configure AI Studio',
      description: 'Set up AI-powered optimizations',
      icon: Brain,
      completed: false
    },
    {
      id: 'team',
      title: 'Invite Team Members',
      description: 'Add your team to collaborate',
      icon: Users,
      completed: false,
      optional: true
    },
    {
      id: 'security',
      title: 'Security Setup',
      description: 'Configure security settings',
      icon: Shield,
      completed: false,
      optional: true
    }
  ]);

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const handleStepComplete = () => {
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === currentStep ? { ...step, completed: true } : step
      )
    );
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setup Wizard
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Setup Progress</span>
                <span>{completedSteps} of {steps.length} completed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${step.completed 
                      ? 'bg-green-500 border-green-500' 
                      : index === currentStep
                        ? 'border-primary bg-primary/10'
                        : 'border-muted-foreground/30'
                    }
                  `}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <step.icon className={`h-5 w-5 ${
                        index === currentStep ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <div className="text-xs text-center max-w-16">
                    <div className={`font-medium ${
                      index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                    {step.optional && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Optional
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center space-y-6"
            >
              <div className="p-6 bg-muted/30 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {currentStepData.title}
                </h3>
                <p className="text-muted-foreground">
                  {currentStepData.description}
                </p>
                {currentStepData.completed && (
                  <Badge variant="outline" className="mt-3 bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>

              {/* Step-specific content */}
              <div className="space-y-4">
                {currentStepData.id === 'ai-studio' && !currentStepData.completed && (
                  <div className="text-left space-y-3 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900">What you'll get:</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        AI-powered query optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Automated performance recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Predictive analysis and insights
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="border-t px-6 py-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex gap-2">
              {currentStepData.optional && !currentStepData.completed && (
                <Button variant="ghost" onClick={handleNext}>
                  Skip
                </Button>
              )}
              {currentStep === steps.length - 1 ? (
                <Button onClick={onClose}>
                  Complete Setup
                </Button>
              ) : (
                <Button onClick={currentStepData.completed ? handleNext : handleStepComplete}>
                  {currentStepData.completed ? (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    'Complete Step'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
