
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { EnhancedHomepage } from '@/components/home/EnhancedHomepage';
import { InteractiveDemoSection } from '@/components/home/InteractiveDemoSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { useAuth } from '@/contexts/auth-context';
import { enhancedProductionLogger } from '@/utils/enhancedProductionLogger';

export default function EnhancedHome() {
  const navigate = useNavigate();
  const { user, loginDemo } = useAuth();

  const handleGetStarted = async () => {
    try {
      if (user) {
        navigate('/app');
      } else {
        await loginDemo();
        navigate('/app');
      }
    } catch (error) {
      enhancedProductionLogger.error('Navigation error during get started flow', error, 'EnhancedHome');
    }
  };

  const handleNavigateToLearn = () => {
    navigate('/learn');
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Homepage with Hero Section */}
      <EnhancedHomepage />

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />

      {/* Social Proof Section (includes testimonials and trusted by) */}
      <SocialProofSection />

      {/* Final CTA */}
      <EnhancedCTASection 
        user={user}
        isLoading={false}
        onGetStarted={handleGetStarted}
        onNavigateToLearn={handleNavigateToLearn}
      />
    </div>
  );
}
