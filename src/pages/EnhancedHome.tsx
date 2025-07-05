
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { HeroSection } from '@/components/home/HeroSection';
import { InteractiveDemoSection } from '@/components/home/InteractiveDemoSection';
import { TrustedBySection } from '@/components/home/TrustedBySection';
import { FeatureShowcaseSection } from '@/components/home/FeatureShowcaseSection';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { PricingPreviewSection } from '@/components/home/PricingPreviewSection';
import { CTASection } from '@/components/home/CTASection';

export default function EnhancedHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <HeroSection />
      </section>

      {/* Trusted By Section */}
      <TrustedBySection />

      {/* Interactive Demo Section */}
      <InteractiveDemoSection />

      {/* Feature Showcase */}
      <FeatureShowcaseSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Pricing Preview */}
      <PricingPreviewSection />

      {/* Final CTA */}
      <CTASection />
    </div>
  );
}
