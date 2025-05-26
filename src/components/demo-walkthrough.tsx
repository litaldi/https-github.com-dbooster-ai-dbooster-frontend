
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, Sparkles, Database, BarChart3, Shield } from 'lucide-react';
import { isDemoMode } from '@/services/demo';

interface WalkthroughStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    title: 'Welcome to DBooster Demo!',
    description: 'Explore our AI-powered database optimization platform with real demo data. No signup required!',
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    title: 'Connected Repositories',
    description: 'View your connected repositories and see optimization opportunities across your codebase.',
    icon: <Database className="w-6 h-6" />,
    highlight: 'repositories',
  },
  {
    title: 'Query Analysis',
    description: 'Discover slow queries and get AI-powered optimization suggestions to improve performance.',
    icon: <BarChart3 className="w-6 h-6" />,
    highlight: 'queries',
  },
  {
    title: 'Security Alerts',
    description: 'Monitor potential security issues and get recommendations to keep your database secure.',
    icon: <Shield className="w-6 h-6" />,
    highlight: 'reports',
  },
];

export function DemoWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isDemoMode()) {
      const hasSeenWalkthrough = localStorage.getItem('demo_walkthrough_seen');
      if (!hasSeenWalkthrough) {
        setIsOpen(true);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('demo_walkthrough_seen', 'true');
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isDemoMode() || !isOpen) return null;

  const currentStepData = walkthroughSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {currentStepData.icon}
              {currentStepData.title}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                Step {currentStep + 1} of {walkthroughSteps.length}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Demo Mode
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-base">
              {currentStepData.description}
            </CardDescription>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Tour
                </Button>
                <Button onClick={handleNext} className="flex items-center gap-2">
                  {currentStep === walkthroughSteps.length - 1 ? 'Get Started' : 'Next'}
                  {currentStep < walkthroughSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
