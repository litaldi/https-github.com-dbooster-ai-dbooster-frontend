
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Brain, 
  Shield, 
  CheckCircle, 
  ChevronRight, 
  X 
} from 'lucide-react';

interface QuickSetupWizardProps {
  onClose: () => void;
}

const setupSteps = [
  {
    id: 'database',
    title: 'Connect Database',
    description: 'Link your primary database for monitoring',
    icon: Database,
    completed: true
  },
  {
    id: 'ai-config',
    title: 'Configure AI Studio',
    description: 'Set up AI-powered optimization preferences',
    icon: Brain,
    completed: false
  },
  {
    id: 'security',
    title: 'Security Setup',
    description: 'Configure security monitoring and alerts',
    icon: Shield,
    completed: false
  }
];

export function QuickSetupWizard({ onClose }: QuickSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const completedSteps = setupSteps.filter(step => step.completed).length;
  const progress = (completedSteps / setupSteps.length) * 100;

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleNext = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    // Mark current step as completed
    setupSteps[currentStep].completed = true;
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quick Setup Wizard</span>
            <Badge variant="secondary">
              {completedSteps} of {setupSteps.length} completed
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Setup Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {setupSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  currentStep === index 
                    ? 'border-primary bg-primary/5' 
                    : step.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-muted'
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : currentStep === index 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <div className="flex gap-2">
              {currentStep < setupSteps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>
                  Complete Setup
                  <CheckCircle className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
