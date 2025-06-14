
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useTour } from './InteractiveTour';

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to DBooster!',
    description: 'Let\'s take a quick tour to help you get started with optimizing your database performance.',
    target: '[data-tour="welcome"]',
  },
  {
    id: 'sidebar',
    title: 'Navigation Sidebar',
    description: 'Use this sidebar to navigate between different features like repositories, queries, and AI tools.',
    target: '[data-tour="sidebar"]',
  },
  {
    id: 'dashboard',
    title: 'Performance Dashboard',
    description: 'Monitor your database performance metrics and get insights into query optimization opportunities.',
    target: '[data-tour="dashboard"]',
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Optimization',
    description: 'Leverage our AI engine to automatically analyze and optimize your SQL queries for better performance.',
    target: '[data-tour="ai-features"]',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'You now know the basics. Start exploring and optimizing your database performance!',
  },
];

export function OnboardingTour() {
  const { user } = useAuth();
  const { startTour } = useTour();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding (you might want to store this in user preferences)
    const completed = localStorage.getItem('onboarding-completed');
    setHasCompletedOnboarding(!!completed);

    // Start onboarding for new users
    if (user && !completed) {
      const timer = setTimeout(() => {
        startTour(onboardingSteps);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, startTour]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setHasCompletedOnboarding(true);
  };

  // This component doesn't render anything directly
  // The tour is handled by the TourOverlay component
  return null;
}
