
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  CheckCircle, 
  Play, 
  Pause,
  RotateCcw,
  BookOpen,
  Lightbulb,
  Target,
  Users,
  Database,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  optional?: boolean;
}

interface TourContextType {
  isActive: boolean;
  currentStep: number;
  steps: TourStep[];
  startTour: (tourType?: 'basic' | 'advanced' | 'developer') => void;
  nextStep: () => void;
  prevStep: () => void;
  skipStep: () => void;
  endTour: () => void;
  restartTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

const tourSteps: Record<string, TourStep[]> = {
  basic: [
    {
      id: 'welcome',
      title: 'Welcome to DBooster! 🎉',
      description: 'Let\'s take a quick tour to get you started with database optimization.',
      target: 'body',
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="text-4xl">🚀</div>
          <p>DBooster helps you optimize your database performance with AI-powered insights and recommendations.</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm">Connect Databases</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-sm">Optimize Queries</p>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm">Monitor Performance</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sidebar',
      title: 'Navigation Sidebar',
      description: 'Use the sidebar to access different sections of DBooster.',
      target: '[data-tour="sidebar"]',
      position: 'right',
      content: (
        <div className="space-y-3">
          <p>The sidebar contains all the main features:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Dashboard - Overview and metrics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Repositories - Manage your databases
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Queries - Optimize and analyze SQL
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Reports - Performance insights
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Your dashboard shows real-time metrics and system health.',
      target: '[data-tour="dashboard"]',
      position: 'bottom',
      content: (
        <div className="space-y-3">
          <p>The dashboard provides:</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Real-time metrics
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Performance alerts
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              Query analytics
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              System status
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'quick-actions',
      title: 'Quick Actions',
      description: 'Access frequently used features with quick action buttons.',
      target: '[data-tour="quick-actions"]',
      position: 'top',
      content: (
        <div className="space-y-3">
          <p>Quick actions help you:</p>
          <ul className="space-y-1 text-sm">
            <li>• Connect new databases</li>
            <li>• Run query analysis</li>
            <li>• Generate reports</li>
            <li>• Access AI features</li>
          </ul>
        </div>
      ),
      action: {
        label: 'Try Quick Actions',
        onClick: () => console.log('Quick actions demonstration')
      }
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      description: 'Speed up your workflow with keyboard shortcuts.',
      target: '[data-tour="shortcuts"]',
      position: 'left',
      content: (
        <div className="space-y-3">
          <p>Essential shortcuts:</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Open command palette</span>
              <Badge variant="outline">Ctrl+K</Badge>
            </div>
            <div className="flex justify-between">
              <span>Go to dashboard</span>
              <Badge variant="outline">G → H</Badge>
            </div>
            <div className="flex justify-between">
              <span>Show shortcuts</span>
              <Badge variant="outline">?</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'Tour Complete! 🎊',
      description: 'You\'re all set to start optimizing your databases.',
      target: 'body',
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="text-4xl">✅</div>
          <p>Great job! You now know the basics of DBooster.</p>
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Next Steps:</h4>
            <ul className="text-sm space-y-1 text-left">
              <li>1. Connect your first database</li>
              <li>2. Run a query optimization</li>
              <li>3. Explore AI-powered features</li>
              <li>4. Set up performance monitoring</li>
            </ul>
          </div>
        </div>
      ),
      action: {
        label: 'Get Started',
        onClick: () => window.location.href = '/repositories'
      }
    }
  ],
  advanced: [
    // Advanced tour steps would go here
  ],
  developer: [
    // Developer-focused tour steps would go here
  ]
};

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const { toast } = useToast();

  // Check if user has completed tour
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('dbooster_tour_completed');
    const isNewUser = !localStorage.getItem('dbooster_user_visited');
    
    if (!hasCompletedTour && isNewUser) {
      // Auto-start tour for new users after a brief delay
      setTimeout(() => {
        startTour('basic');
      }, 2000);
      localStorage.setItem('dbooster_user_visited', 'true');
    }
  }, []);

  const startTour = (tourType: 'basic' | 'advanced' | 'developer' = 'basic') => {
    setSteps(tourSteps[tourType] || tourSteps.basic);
    setCurrentStep(0);
    setIsActive(true);
    
    toast({
      title: "Tour Started",
      description: `Starting the ${tourType} tour. Follow along to learn DBooster!`
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const endTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    localStorage.setItem('dbooster_tour_completed', 'true');
    
    toast({
      title: "Tour Complete!",
      description: "Welcome to DBooster! You can restart the tour anytime from the help menu."
    });
  };

  const restartTour = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  return (
    <TourContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        startTour,
        nextStep,
        prevStep,
        skipStep,
        endTour,
        restartTour
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

export function TourOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, skipStep, endTour } = useTour();

  if (!isActive || !steps[currentStep]) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 pointer-events-auto"
          onClick={endTour}
        />
        
        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        >
          <Card className="w-96 max-w-[90vw] shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {currentStep + 1}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription className="text-sm">
                      Step {currentStep + 1} of {steps.length}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={endTour}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={progress} className="mt-3" />
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{step.description}</p>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                {step.content}
              </div>

              {step.action && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={step.action.onClick}
                  className="w-full"
                >
                  {step.action.label}
                </Button>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  
                  {step.optional && (
                    <Button variant="ghost" size="sm" onClick={skipStep}>
                      Skip
                    </Button>
                  )}
                </div>

                <Button onClick={nextStep} size="sm">
                  {currentStep === steps.length - 1 ? (
                    <>
                      Complete
                      <CheckCircle className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function TourMenu() {
  const { startTour } = useTour();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Interactive Tours</h3>
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startTour('basic')}
          className="w-full justify-start"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Basic Tour
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startTour('advanced')}
          className="w-full justify-start"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Advanced Features
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startTour('developer')}
          className="w-full justify-start"
        >
          <Target className="h-4 w-4 mr-2" />
          Developer Guide
        </Button>
      </div>
    </div>
  );
}
