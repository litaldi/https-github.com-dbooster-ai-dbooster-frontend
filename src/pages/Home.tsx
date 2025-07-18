
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { InteractiveDemoSection } from '@/components/home/InteractiveDemoSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { features } from '@/data/homePageData';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  const handleViewAllFeatures = () => {
    navigate('/features');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced CTA */}
      <EnhancedCTASection />
      
      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <FeaturesSection 
          features={features}
          onViewAllFeatures={handleViewAllFeatures}
        />
      </motion.div>
      
      {/* Interactive Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <InteractiveDemoSection />
      </motion.div>
      
      {/* Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <SocialProofSection />
      </motion.div>
      
      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <TestimonialsSection />
      </motion.div>
    </div>
  );
}
