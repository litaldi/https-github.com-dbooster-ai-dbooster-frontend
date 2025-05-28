
import { useState, ReactNode } from 'react';
import { HelpCircle, X, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  action?: ReactNode;
}

interface UserGuidanceProps {
  steps: GuidanceStep[];
  title: string;
  description?: string;
  trigger?: ReactNode;
  className?: string;
}

export function UserGuidance({ 
  steps, 
  title, 
  description, 
  trigger,
  className 
}: UserGuidanceProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <HelpCircle className="h-4 w-4 mr-2" />
      Help
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>
        
        <div className={cn("space-y-4", className)}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Step {currentStep + 1} of {steps.length}</span>
            <Badge variant="outline">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </Badge>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{steps[currentStep]?.title}</CardTitle>
              <CardDescription className="text-base">
                {steps[currentStep]?.description}
              </CardDescription>
            </CardHeader>
            {steps[currentStep]?.action && (
              <CardContent>
                {steps[currentStep].action}
              </CardContent>
            )}
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              disabled={currentStep === steps.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TooltipGuidanceProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export function TooltipGuidance({ 
  content, 
  children, 
  side = 'top',
  className 
}: TooltipGuidanceProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            "absolute z-50 px-3 py-2 text-sm bg-popover text-popover-foreground border rounded-md shadow-md",
            "min-w-max max-w-xs",
            {
              'bottom-full left-1/2 transform -translate-x-1/2 mb-2': side === 'top',
              'top-1/2 left-full transform -translate-y-1/2 ml-2': side === 'right',
              'top-full left-1/2 transform -translate-x-1/2 mt-2': side === 'bottom',
              'top-1/2 right-full transform -translate-y-1/2 mr-2': side === 'left',
            },
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
