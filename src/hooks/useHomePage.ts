
import React, { useState, useMemo } from 'react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { features, getQuickActions, guidanceSteps } from '@/data/homePageData';

export function useHomePage() {
  const { user } = useSimpleAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!user);

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        toast({
          title: 'Taking you to your dashboard',
          description: 'Your personalized database optimization workspace awaits!'
        });
        navigate('/app');
      } else {
        toast({
          title: 'Welcome to DBooster!',
          description: 'You\'re now exploring our full-featured demo environment.'
        });
        navigate('/auth');
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
