
import { createContext, useContext, useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, ChevronLeft, Play, BookOpen, Zap } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (steps: TourStep[] | string) => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextType>({
  isActive: false,
  currentStep: 0,
  steps: [],
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTour: () => {},
});

// Predefined tour configurations
const tourConfigurations = {
  basic: [
    {
      id: 'welcome',
      title: 'Welcome to DBooster!',
      description: 'Let\'s take a quick tour to help you get started with optimizing your database performance.',
    },
    {
      id: 'dashboard',
      title: 'Performance Dashboard',
      description: 'Monitor your database performance metrics and get insights into query optimization opportunities.',
    },
    {
      id: 'ai-features',
      title: 'AI-Powered Optimization',
      description: 'Leverage our AI engine to automatically analyze and optimize your SQL queries for better performance.',
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'You now know the basics. Start exploring and optimizing your database performance!',
    },
  ],
  advanced: [
    {
      id: 'advanced-welcome',
      title: 'Advanced Features Tour',
      description: 'Discover advanced database optimization features and AI-powered tools.',
    },
    {
      id: 'query-analyzer',
      title: 'Smart Query Analyzer',
      description: 'Use our AI to analyze query performance and get optimization suggestions.',
    },
    {
      id: 'performance-monitor',
      title: 'Performance Monitoring',
      description: 'Set up real-time monitoring and alerts for your database performance.',
    },
  ]
};

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  const startTour = (tourSteps: TourStep[] | string) => {
    let tourData: TourStep[];
    
    if (typeof tourSteps === 'string') {
      tourData = tourConfigurations[tourSteps as keyof typeof tourConfigurations] || [];
    } else {
      tourData = tourSteps;
    }
    
    setSteps(tourData);
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
  };

  return (
    <TourContext.Provider value={{
      isActive,
      currentStep,
      steps,
      startTour,
      nextStep,
      prevStep,
      endTour,
    }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  return useContext(TourContext);
}

export function TourMenu() {
  const { startTour } = useTour();

  const tours = [
    {
      id: 'basic',
      title: 'Basic Tour',
      description: 'Learn the fundamentals of DBooster',
      icon: BookOpen,
      duration: '3 minutes'
    },
    {
      id: 'advanced',
      title: 'Advanced Features',
      description: 'Explore advanced optimization tools',
      icon: Zap,
      duration: '5 minutes'
    }
  ];

  return (
    <div className="space-y-3">
      {tours.map((tour) => {
        const Icon = tour.icon;
        return (
          <Card key={tour.id} className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{tour.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{tour.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{tour.duration}</Badge>
                    <Button 
                      size="sm" 
                      onClick={() => startTour(tour.id)}
                      className="h-7 px-3 text-xs"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start Tour
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function TourOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, endTour } = useTour();

  if (!isActive || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={endTour}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={isFirst}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            
            <Button onClick={nextStep} className="flex items-center">
              {isLast ? 'Finish' : 'Next'}
              {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
