
import { useState, useEffect } from 'react';
import { X, HelpCircle, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function Tooltip({ children, content, side = 'top', className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sideClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap',
          sideClasses[side],
          className
        )}>
          {content}
        </div>
      )}
    </div>
  );
}

interface OnboardingTourProps {
  steps: Array<{
    target: string;
    title: string;
    description: string;
  }>;
  onComplete: () => void;
  isVisible?: boolean;
}

export function OnboardingTour({ steps, onComplete, isVisible = true }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(isVisible);

  useEffect(() => {
    setIsActive(isVisible);
  }, [isVisible]);

  if (!isActive || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setIsActive(false);
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {currentStep + 1} of {steps.length}
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
          <p className="text-sm text-muted-foreground">
            {currentStepData.description}
          </p>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleSkip}>
              Skip Tour
            </Button>
            <Button onClick={handleNext}>
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface HelpButtonProps {
  content: string;
  title?: string;
}

export function HelpButton({ content, title = "Help" }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-8 z-50 w-80 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{content}</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({ steps, currentStep, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
            index <= currentStep 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "mx-2 h-px w-8 flex-1",
              index < currentStep ? "bg-primary" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

interface UserGuidanceProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  steps?: Array<{
    id: string;
    title: string;
    description: string;
    action: React.ReactNode;
  }>;
  trigger?: React.ReactNode;
}

export function UserGuidance({ children, className, title, description, steps, trigger }: UserGuidanceProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (trigger) {
    return (
      <div className="relative">
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <Card className="absolute right-0 top-full mt-2 z-50 w-80 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{title}</CardTitle>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {steps?.map((step, index) => (
                  <div key={step.id} className="space-y-2">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                    {step.action}
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}

interface TooltipGuidanceProps {
  children: React.ReactNode;
  tooltip: string;
  className?: string;
}

export function TooltipGuidance({ children, tooltip, className }: TooltipGuidanceProps) {
  return (
    <Tooltip content={tooltip} className={className}>
      {children}
    </Tooltip>
  );
}
