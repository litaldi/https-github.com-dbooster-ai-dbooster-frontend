
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, Zap, BarChart, CheckCircle, ArrowRight, Sparkles, Target, TrendingUp } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  benefit: string;
  completed?: boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'connect',
    title: 'Connect Your Database',
    description: 'Start optimizing with instant AI-powered database analysis and performance insights.',
    action: 'Connect Database',
    icon: Database,
    route: '/app/db-import',
    benefit: 'Reduce query response time by up to 73%'
  },
  {
    id: 'analyze',
    title: 'AI Query Analysis',
    description: 'Let our enterprise AI analyze your queries and provide intelligent optimization recommendations.',
    action: 'Start Analysis',
    icon: Zap,
    route: '/app/query-optimization',
    benefit: 'Automate 80% of performance tuning tasks'
  },
  {
    id: 'monitor',
    title: 'Performance Dashboard',
    description: 'Monitor real-time performance with predictive insights and enterprise-grade analytics.',
    action: 'View Dashboard',
    icon: BarChart,
    route: '/app/dashboard',
    benefit: 'Cut database costs by 40-60%'
  }
];

export function EnhancedOnboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [showMetrics, setShowMetrics] = useState(false);

    useEffect(() => {
        // Show animated metrics after component mounts
        const timer = setTimeout(() => setShowMetrics(true), 1000);
        return () => clearTimeout(timer);
    }, []);

  const handleStepAction = (step: OnboardingStep) => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
      enhancedToast.success({
        title: 'Excellent Progress!',
        description: `${step.title} completed. ${step.benefit}`
      });
    }
    navigate(step.route);
  };

  const handleSkipOnboarding = () => {
    enhancedToast.success({
      title: 'Welcome to DBQuery Optimizer!',
      description: 'Ready to transform your database performance with AI.'
    });
    navigate('/app/dashboard');
  };

  const progressPercentage = (completedSteps.length / ONBOARDING_STEPS.length) * 100;

  if (completedSteps.length === ONBOARDING_STEPS.length) {
    return (
      <FadeIn>
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <ScaleIn>
              <div className="relative mb-6">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </ScaleIn>
            <h3 className="text-3xl font-bold text-green-800 mb-3">You're Ready to Optimize!</h3>
            <p className="text-green-700 mb-2 text-lg">Your database is connected and ready for AI-powered optimization.</p>
            <p className="text-green-600 mb-6 text-sm">Join thousands of enterprises reducing query response times by up to 73%</p>
            <EnhancedButton 
              onClick={() => navigate('/app/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
            >
              Start Optimizing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </EnhancedButton>
          </CardContent>
        </Card>
      </FadeIn>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <FadeIn>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="h-8 w-8 text-primary" />
            <h2 className="text-4xl font-bold">Transform Your Database Performance</h2>
          </div>
          <p className="text-muted-foreground text-xl mb-2">Get started in 3 simple steps</p>
          <p className="text-sm text-muted-foreground">Join enterprises reducing costs by 40-60% with AI optimization</p>
          
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Setup Progress</span>
              <span className="text-sm text-muted-foreground">{completedSteps.length} of {ONBOARDING_STEPS.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>
      </FadeIn>

        {/* Performance Metrics Preview */}
        {showMetrics && (
            <FadeIn delay={0.3}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="text-center p-4">
                        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">73%</div>
                        <div className="text-sm text-muted-foreground">Faster Query Response</div>
                    </Card>
                    <Card className="text-center p-4">
                        <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">60%</div>
                        <div className="text-sm text-muted-foreground">Database Cost Reduction</div>
                    </Card>
                    <Card className="text-center p-4">
                        <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">80%</div>
                        <div className="text-sm text-muted-foreground">Performance Tasks Automated</div>
                    </Card>
                </div>
            </FadeIn>
        )}

      <div className="grid gap-6">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep && !isCompleted;
          const StepIcon = step.icon;

          return (
            <FadeIn key={step.id} delay={index * 0.1}>
              <Card className={`transition-all duration-300 hover:shadow-lg ${
                isCurrent 
                  ? 'border-primary shadow-lg scale-105 bg-primary/5' 
                  : isCompleted 
                    ? 'border-green-200 bg-green-50/50' 
                    : 'hover:shadow-md hover:border-primary/30'
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl ${
                        isCompleted 
                          ? 'bg-green-100' 
                          : isCurrent 
                            ? 'bg-primary/10' 
                            : 'bg-muted'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-8 w-8 text-green-600" />
                        ) : (
                          <StepIcon className={`h-8 w-8 ${
                            isCurrent ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          {step.title}
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Complete
                            </Badge>
                          )}
                          {isCurrent && (
                            <Badge variant="default">
                              Current Step
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-muted-foreground mt-2 text-base leading-relaxed">{step.description}</p>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {step.benefit}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <EnhancedButton
                      onClick={() => handleStepAction(step)}
                      variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                      className="min-w-[160px] h-12"
                      size="lg"
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

      <FadeIn delay={0.6}>
        <div className="text-center mt-8 p-6 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to explore on your own? Access all enterprise features immediately.
          </p>
          <EnhancedButton 
            variant="ghost" 
            onClick={handleSkipOnboarding}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip setup and explore dashboard →
          </EnhancedButton>
        </div>
      </FadeIn>
    </div>
  );
}
