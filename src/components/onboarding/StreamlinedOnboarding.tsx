import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, Zap, BarChart, CheckCircle, ArrowRight } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/enhanced-animations';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  completed?: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'connect',
    title: 'Connect Your Database',
    description: 'Link your database to start optimizing query performance instantly.',
    action: 'Connect Database',
    icon: Database,
    route: '/db-import'
  },
  {
    id: 'analyze',
    title: 'Run AI Analysis',
    description: 'Let our AI analyze your queries and provide optimization recommendations.',
    action: 'Analyze Queries',
    icon: Zap,
    route: '/ai-features'
  },
  {
    id: 'monitor',
    title: 'View Performance Insights',
    description: 'Monitor your database performance with real-time dashboards and alerts.',
    action: 'View Dashboard',
    icon: BarChart,
    route: '/dashboard'
  }
];

export function StreamlinedOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleStepAction = (step: OnboardingStep) => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
      enhancedToast.success({
        title: 'Great Progress!',
        description: `${step.title} completed. You're optimizing like a pro!`
      });
    }
    navigate(step.route);
  };

  const handleSkipOnboarding = () => {
    enhancedToast.success({
      title: 'Welcome to DBooster!',
      description: 'You can access all features from the dashboard.'
    });
    navigate('/dashboard');
  };

  const progressPercentage = (completedSteps.length / ONBOARDING_STEPS.length) * 100;

  if (completedSteps.length === ONBOARDING_STEPS.length) {
    return (
      <FadeIn>
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <ScaleIn>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            </ScaleIn>
            <h3 className="text-2xl font-bold text-green-800 mb-2">You're All Set!</h3>
            <p className="text-green-700 mb-6">Your database is connected and ready for optimization. Start exploring DBooster's powerful features.</p>
            <EnhancedButton 
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnhancedButton>
          </CardContent>
        </Card>
      </FadeIn>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <FadeIn>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to DBooster</h2>
          <p className="text-muted-foreground text-lg">Get started in 3 simple steps</p>
          <div className="mt-4 max-w-md mx-auto">
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedSteps.length} of {ONBOARDING_STEPS.length} steps completed
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-6">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep && !isCompleted;
          const StepIcon = step.icon;

          return (
            <FadeIn key={step.id} delay={index * 0.1}>
              <Card className={`transition-all duration-300 ${
                isCurrent 
                  ? 'border-primary shadow-lg scale-105' 
                  : isCompleted 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'hover:shadow-md'
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        isCompleted 
                          ? 'bg-green-100' 
                          : isCurrent 
                            ? 'bg-primary/10' 
                            : 'bg-muted'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <StepIcon className={`h-6 w-6 ${
                            isCurrent ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        )}
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {step.title}
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Complete
                            </Badge>
                          )}
                          {isCurrent && (
                            <Badge variant="default">
                              Current
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                    
                    <EnhancedButton
                      onClick={() => handleStepAction(step)}
                      variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                      className="min-w-[140px]"
                    >
                      {isCompleted ? 'Revisit' : step.action}
                      {!isCompleted && <ArrowRight className="ml-2 h-4 w-4" />}
                    </EnhancedButton>
                  </div>
                </CardHeader>
              </Card>
            </FadeIn>
          );
        })}
      </div>

      <FadeIn delay={0.4}>
        <div className="text-center mt-8">
          <EnhancedButton 
            variant="ghost" 
            onClick={handleSkipOnboarding}
            className="text-muted-foreground"
          >
            Skip onboarding and explore on my own
          </EnhancedButton>
        </div>
      </FadeIn>
    </div>
  );
}
