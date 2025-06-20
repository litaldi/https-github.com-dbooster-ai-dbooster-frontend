import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { EnhancedButton } from './enhanced-button';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Progress } from './progress';
import { HelpCircle, ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react';
import { FadeIn, ScaleIn } from './animations';

interface GuidanceStep {
  id: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

interface UserGuidanceProps {
  title: string;
  description: string;
  steps: GuidanceStep[];
  trigger?: React.ReactNode;
  onComplete?: () => void;
}

export function UserGuidance({ 
  title, 
  description, 
  steps, 
  trigger, 
  onComplete 
}: UserGuidanceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
      setIsOpen(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <EnhancedButton variant="outline" size="sm">
            <HelpCircle className="h-4 w-4" />
            Get Help
          </EnhancedButton>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
            <Badge variant="secondary">{currentStep + 1} of {steps.length}</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          <FadeIn key={currentStep}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {completedSteps.includes(steps[currentStep].id) ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center text-xs font-bold">
                      {currentStep + 1}
                    </div>
                  )}
                  {steps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {steps[currentStep].description}
                </p>
                {steps[currentStep].action && (
                  <div>{steps[currentStep].action}</div>
                )}
              </CardContent>
            </Card>
          </FadeIn>
          
          <div className="flex justify-between items-center">
            <EnhancedButton
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </EnhancedButton>
            
            <div className="flex gap-2">
              {currentStep < steps.length - 1 ? (
                <EnhancedButton
                  onClick={() => handleStepComplete(steps[currentStep].id)}
                  className="gap-2"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </EnhancedButton>
              ) : (
                <EnhancedButton
                  onClick={() => handleStepComplete(steps[currentStep].id)}
                  className="gap-2"
                >
                  Complete Guide
                  <CheckCircle className="h-4 w-4" />
                </EnhancedButton>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TooltipGuidanceProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

export function TooltipGuidance({ 
  content, 
  children, 
  side = 'top', 
  align = 'center' 
}: TooltipGuidanceProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align} className="max-w-xs">
          <p className="text-sm leading-relaxed">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ContextualHelpProps {
  title: string;
  description: string;
  tips?: string[];
  className?: string;
}

export function ContextualHelp({ title, description, tips, className }: ContextualHelpProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={`border-blue-200 bg-blue-50/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm text-blue-800">{title}</CardTitle>
          </div>
          {tips && (
            <EnhancedButton
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 text-blue-600"
            >
              <ChevronRight className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </EnhancedButton>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-blue-700 leading-relaxed mb-3">{description}</p>
        
        {tips && isExpanded && (
          <FadeIn>
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-blue-800 uppercase tracking-wide">Tips:</h4>
              <ul className="space-y-1">
                {tips.map((tip, index) => (
                  <li key={index} className="text-xs text-blue-600 flex items-start gap-2">
                    <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        )}
      </CardContent>
    </Card>
  );
}

interface FeatureBadgeProps {
  children: React.ReactNode;
  isNew?: boolean;
  className?: string;
}

export function FeatureBadge({ children, isNew = false, className }: FeatureBadgeProps) {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isNew && (
        <ScaleIn>
          <Badge 
            variant="default" 
            className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-1.5 py-0.5 animate-pulse"
          >
            New
          </Badge>
        </ScaleIn>
      )}
    </div>
  );
}
