
import React from 'react';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { InteractiveDemoSection } from '@/components/home/InteractiveDemoSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { motion } from 'framer-motion';

export default function Home() {
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
        <FeaturesSection />
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
