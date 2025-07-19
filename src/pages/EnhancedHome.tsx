
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ImprovedHomepage } from '@/components/home/ImprovedHomepage';
import { InteractiveDemoSection } from '@/components/home/InteractiveDemoSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function EnhancedHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = async () => {
    try {
      if (user) {
        navigate('/app');
      } else {
        navigate('/auth');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleNavigateToLearn = () => {
    navigate('/learn');
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Homepage with Hero Section */}
      <ImprovedHomepage />

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />

      {/* Social Proof Section (includes testimonials and trusted by) */}
      <SocialProofSection />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Database Performance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers and enterprises who've improved their database performance 
              by up to 10x with DBooster's AI-powered optimization recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl"
              >
                {user ? 'Go to Your Dashboard' : 'Start Free Today'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleNavigateToLearn}
                className="min-w-[200px] h-12 text-base font-semibold border-2"
              >
                Explore All Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
