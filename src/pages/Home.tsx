
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { HeroSection } from '@/components/home/HeroSection';
import { StandardizedLoading } from '@/components/ui/standardized-loading';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      if (user) {
        navigate('/app');
      } else {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    if (user) {
      navigate('/app/settings');
    } else {
      navigate('/login');
    }
  };

  const guidanceSteps = [
    {
      title: "Connect Your Database",
      description: "Securely connect your database with our guided setup wizard",
      action: "Start connecting"
    },
    {
      title: "Run AI Analysis",
      description: "Let our AI analyze your queries and identify optimization opportunities",
      action: "Analyze queries"
    },
    {
      title: "Apply Optimizations",
      description: "Review and apply AI-suggested improvements to boost performance",
      action: "Apply improvements"
    }
  ];

  if (isLoading) {
    return <StandardizedLoading variant="overlay" text="Redirecting..." />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection 
        user={user}
        isLoading={isLoading}
        onGetStarted={handleGetStarted}
        onNavigateToLogin={handleNavigateToLogin}
        guidanceSteps={guidanceSteps}
      />
    </div>
  );
}
