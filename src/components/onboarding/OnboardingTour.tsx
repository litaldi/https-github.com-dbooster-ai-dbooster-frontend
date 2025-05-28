
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, X, Sparkles, Database, BarChart3, Shield, Users, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { showSuccess } from '@/components/ui/feedback-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DBooster!',
    description: 'Your AI-powered database optimization companion',
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          DBooster helps you optimize your database performance using advanced AI technology. 
          Let's take a quick tour to get you started!
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
            <Database className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Query Analysis</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
            <Zap className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">AI Optimization</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'repositories',
    title: 'Connect Your Repositories',
    description: 'Link your GitHub repositories to scan for SQL queries',
    icon: <Database className="w-8 h-8 text-blue-600" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Connect your GitHub repositories to automatically discover and analyze SQL queries in your codebase.
        </p>
        <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30">
          <h4 className="font-medium mb-2">What we'll scan for:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• SQL files and embedded queries</li>
            <li>• Performance bottlenecks</li>
            <li>• Security vulnerabilities</li>
            <li>• Optimization opportunities</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'queries',
    title: 'Analyze Your Queries',
    description: 'Get AI-powered insights and optimization suggestions',
    icon: <BarChart3 className="w-8 h-8 text-green-600" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Our AI analyzes your queries and provides detailed performance insights and optimization recommendations.
        </p>
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Slow queries needing optimization</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Moderate performance issues</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Well-optimized queries</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    description: 'Keep your database secure with automated monitoring',
    icon: <Shield className="w-8 h-8 text-purple-600" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          DBooster continuously monitors for security vulnerabilities and compliance issues in your database queries.
        </p>
        <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-950/30">
          <h4 className="font-medium mb-2">Security Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• SQL injection detection</li>
            <li>• Access pattern analysis</li>
            <li>• Data exposure prevention</li>
            <li>• Compliance reporting</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work together to optimize your database performance',
    icon: <Users className="w-8 h-8 text-orange-600" />,
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Collaborate with your team to review optimizations, share insights, and maintain database best practices.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg border text-center">
            <div className="font-medium text-sm">Share Queries</div>
            <div className="text-xs text-muted-foreground mt-1">Collaborate on optimizations</div>
          </div>
          <div className="p-3 rounded-lg border text-center">
            <div className="font-medium text-sm">Team Reports</div>
            <div className="text-xs text-muted-foreground mt-1">Track team performance</div>
          </div>
        </div>
      </div>
    )
  }
];

export function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
      const isDemo = localStorage.getItem('demo_mode');
      
      if (!hasSeenOnboarding && !isDemo) {
        // Delay to allow page to load
        const timer = setTimeout(() => setIsOpen(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding_completed', 'true');
    showSuccess({
      title: 'Welcome aboard!',
      description: 'You\'re all set to start optimizing your database performance.'
    });
  };

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem('onboarding_completed', 'true');
  };

  if (!isOpen || !user) return null;

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg animate-scale-in">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              {currentStepData.icon}
              {currentStepData.title}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleSkip}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <Badge variant="outline">
                {currentStep + 1} of {onboardingSteps.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="text-base">
                {currentStepData.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStepData.content}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tour
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < onboardingSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
