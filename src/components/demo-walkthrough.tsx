
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, PlayCircle, ArrowRight } from 'lucide-react';

const walkthrough = [
  {
    title: 'Welcome to DBooster Demo!',
    description: 'You\'re now in demo mode. Explore all features without any setup required.',
    action: 'Get Started'
  },
  {
    title: 'AI-Powered Analysis',
    description: 'Try our AI query optimizer to see how it can improve your database performance.',
    action: 'View AI Features'
  },
  {
    title: 'Real-time Monitoring',
    description: 'Check out the dashboard to see performance metrics and insights.',
    action: 'View Dashboard'
  }
];

export function DemoWalkthrough() {
  const { isDemo } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    if (isDemo && !hasBeenShown) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isDemo, hasBeenShown]);

  if (!isVisible || !isDemo) {
    return null;
  }

  const currentStepData = walkthrough[currentStep];
  const isLastStep = currentStep === walkthrough.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsVisible(false);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
      <Card className="max-w-md w-full animate-in zoom-in-95 duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {currentStep + 1} of {walkthrough.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStepData.description}
          </p>
          
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={handleSkip} size="sm">
              Skip Tour
            </Button>
            <Button onClick={handleNext} className="flex items-center">
              {currentStepData.action}
              {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-1 pt-2">
            {walkthrough.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
