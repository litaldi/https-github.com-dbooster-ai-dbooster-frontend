
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '@/components/ui/feedback-toast';
import { features, getQuickActions, guidanceSteps } from '@/data/homePageData';

export function useHomePage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!user);

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        showSuccess({ 
          title: 'Taking you to your dashboard', 
          description: 'Your personalized database optimization workspace awaits!' 
        });
        navigate('/dashboard');
      } else {
        await loginDemo();
        showSuccess({ 
          title: 'Welcome to DBooster!', 
          description: 'You\'re now exploring our full-featured demo environment.' 
        });
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = useMemo(() => getQuickActions(navigate), [navigate]);

  return {
    user,
    isLoading,
    showOnboarding,
    features,
    quickActions,
    guidanceSteps,
    handleGetStarted,
    navigate
  };
}
