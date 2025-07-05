
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, Zap, BarChart, CheckCircle, ArrowRight, Sparkles, Target, TrendingUp, X } from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  benefit: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  spotlight?: string; // CSS selector for spotlight effect
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'connect',
    title: 'Connect Your Database',
    description: 'Transform slow queries into lightning-fast performance with AI-powered optimization.',
    action: 'Connect Database',
    icon: Database,
    route: '/app/db-import',
    benefit: 'Reduce query response time by up to 73%',
    spotlight: '[data-tour="database-connect"]'
  },
  {
    id: 'analyze',
    title: 'AI Query Optimization',
    description: 'Our enterprise AI identifies bottlenecks and automatically optimizes your SQL queries.',
    action: 'Start Analysis',
    icon: Zap,
    route: '/app/query-optimization',
    benefit: 'Automate 80% of performance tuning tasks',
    spotlight: '[data-tour="ai-optimizer"]'
  },
  {
    id: 'monitor',
    title: 'Real-time Performance Insights',
    description: 'Monitor database health with predictive analytics and cost optimization recommendations.',
    action: 'View Dashboard',
    icon: BarChart,
    route: '/app/dashboard',
    benefit: 'Cut infrastructure costs by 40-60%',
    spotlight: '[data-tour="dashboard"]'
  }
];

interface SpotlightOverlayProps {
  targetSelector?: string;
  onClose: () => void;
}

function SpotlightOverlay({ targetSelector, onClose }: SpotlightOverlayProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (targetSelector) {
      const element = document.querySelector(targetSelector);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      }
    }
  }, [targetSelector]);

  if (!targetRect) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 pointer-events-none"
      style={{
        background: `radial-gradient(circle at ${targetRect.left + targetRect.width / 2}px ${targetRect.top + targetRect.height / 2}px, transparent ${Math.max(targetRect.width, targetRect.height) / 2 + 20}px, rgba(0,0,0,0.7) ${Math.max(targetRect.width, targetRect.height) / 2 + 40}px)`
      }}
    >
      <div
        className="absolute border-2 border-primary rounded-lg pointer-events-none animate-pulse"
        style={{
          left: targetRect.left - 4,
          top: targetRect.top - 4,
          width: targetRect.width + 8,
          height: targetRect.height + 8,
        }}
      />
    </motion.div>
  );
}

export function EnhancedOnboardingTour() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showTour, setShowTour] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

  useEffect(() => {
    // Show tour for new users
    const hasSeenTour = localStorage.getItem('dbooster-tour-completed');
    if (user && !hasSeenTour) {
      const timer = setTimeout(() => setShowTour(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleStepAction = (step: OnboardingStep) => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
      enhancedToast.success({
        title: 'Great Progress!',
        description: step.benefit
      });
    }
    
    // Show spotlight effect before navigation
    if (step.spotlight) {
      setShowSpotlight(true);
      setTimeout(() => {
        setShowSpotlight(false);
        navigate(step.route);
      }, 2000);
    } else {
      navigate(step.route);
    }
  };

  const handleSkipTour = () => {
    localStorage.setItem('dbooster-tour-completed', 'true');
    setShowTour(false);
    enhancedToast.success({
      title: 'Ready to Optimize!',
      description: 'Access all features from the dashboard anytime.'
    });
    navigate('/app/dashboard');
  };

  const handleCompleteTour = () => {
    localStorage.setItem('dbooster-tour-completed', 'true');
    setShowTour(false);
    enhancedToast.success({
      title: 'Welcome to DBooster!',
      description: 'You\'re ready to transform your database performance.'
    });
  };

  const progressPercentage = (completedSteps.length / ONBOARDING_STEPS.length) * 100;

  if (!showTour) return null;

  if (completedSteps.length === ONBOARDING_STEPS.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      >
        <Card className="max-w-lg mx-auto bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <ScaleIn>
              <div className="relative mb-6">
                <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
                <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </ScaleIn>
            <h3 className="text-3xl font-bold text-green-800 mb-3">You're Ready to Optimize!</h3>
            <p className="text-green-700 mb-6 text-lg">Your database transformation journey begins now.</p>
            <EnhancedButton 
              onClick={handleCompleteTour}
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
            >
              Start Optimizing
              <ArrowRight className="ml-2 h-5 w-5" />
            </EnhancedButton>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSpotlight && (
          <SpotlightOverlay 
            targetSelector={ONBOARDING_STEPS[currentStep]?.spotlight}
            onClose={() => setShowSpotlight(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="max-w-4xl mx-auto space-y-6 py-8">
          <FadeIn>
            <div className="text-center mb-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center gap-2 flex-1">
                  <Target className="h-8 w-8 text-primary" />
                  <h2 className="text-4xl font-bold">Transform Your Database Performance</h2>
                </div>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={handleSkipTour}
                  className="text-white hover:text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4 mr-2" />
                  Skip Tour
                </EnhancedButton>
              </div>
              <p className="text-white/80 text-xl mb-2">Get started in 3 simple steps</p>
              <p className="text-sm text-white/60">Join enterprises reducing costs by 40-60% with AI optimization</p>
              
              <div className="mt-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2 text-white/80">
                  <span className="text-sm font-medium">Setup Progress</span>
                  <span className="text-sm">{completedSteps.length} of {ONBOARDING_STEPS.length} completed</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
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
                  <Card className={`transition-all duration-300 hover:shadow-2xl ${
                    isCurrent 
                      ? 'border-primary shadow-2xl scale-105 bg-primary/5 ring-2 ring-primary/20' 
                      : isCompleted 
                        ? 'border-green-200 bg-green-50/90' 
                        : 'hover:shadow-xl hover:border-primary/30 bg-white/95'
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
                                <Badge variant="default" className="animate-pulse">
                                  Current Step
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-muted-foreground mt-2 text-base leading-relaxed">{step.description}</p>
                            <div className="mt-3">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
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
        </div>
      </motion.div>
    </>
  );
}
