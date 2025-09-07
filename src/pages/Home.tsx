
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { InteractiveDemoSection } from '@/components/home/InteractiveDemoSection';
import { SocialProofSection } from '@/components/home/SocialProofSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { features } from '@/data/homePageData';
import { motion, useScroll, useSpring } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" as const
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export default function Home() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleViewAllFeatures = () => {
    navigate('/features');
  };

  // Add smooth scroll behavior and optimize performance
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500 origin-left z-50"
        style={{ scaleX }}
      />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-0"
      >
        {/* Hero Section with Enhanced CTA */}
        <motion.section variants={sectionVariants}>
          <EnhancedCTASection />
        </motion.section>
        
        {/* Features Section */}
        <motion.section 
          variants={sectionVariants}
          className="relative"
        >
          <FeaturesSection 
            features={features}
            onViewAllFeatures={handleViewAllFeatures}
          />
        </motion.section>
        
        {/* Interactive Demo */}
        <motion.section 
          variants={sectionVariants}
          className="relative"
        >
          <InteractiveDemoSection />
        </motion.section>
        
        {/* Social Proof */}
        <motion.section 
          variants={sectionVariants}
          className="relative"
        >
          <SocialProofSection />
        </motion.section>
        
        {/* Testimonials */}
        <motion.section 
          variants={sectionVariants}
          className="relative"
        >
          <TestimonialsSection />
        </motion.section>
      </motion.div>
    </div>
  );
}
