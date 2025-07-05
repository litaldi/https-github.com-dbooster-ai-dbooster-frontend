
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EnhancedButton } from './enhanced-button';

interface HeroMetric {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface HeroBadge {
  text: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'info';
}

interface HeroCTA {
  text: string;
  onClick: () => void;
  loading?: boolean;
  variant?: 'default' | 'outline' | 'gradient';
}

interface EnhancedHeroSectionProps {
  preheadline?: string;
  headline: string;
  subheadline?: string;
  description: string;
  primaryCTA: HeroCTA;
  secondaryCTA?: HeroCTA;
  badges?: HeroBadge[];
  metrics?: HeroMetric[];
  backgroundVariant?: 'gradient' | 'pattern' | 'clean';
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function EnhancedHeroSection({
  preheadline,
  headline,
  subheadline,
  description,
  primaryCTA,
  secondaryCTA,
  badges = [],
  metrics = [],
  backgroundVariant = 'gradient',
  className,
}: EnhancedHeroSectionProps) {
  const backgroundClasses = {
    gradient: "bg-gradient-to-b from-background via-background to-muted/30",
    pattern: "bg-background bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:24px_24px]",
    clean: "bg-background",
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden py-20 md:py-32",
        backgroundClasses[backgroundVariant],
        className
      )}
      aria-labelledby="hero-headline"
    >
      {/* Background Effects */}
      {backgroundVariant === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl rounded-full" />
        </>
      )}

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badges */}
          {badges.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {badges.map((badge, index) => (
                <div
                  key={index}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105",
                    {
                      'bg-primary/10 text-primary border-primary/20': badge.variant === 'default',
                      'bg-secondary text-secondary-foreground border-secondary': badge.variant === 'secondary',
                      'bg-green-50 text-green-700 border-green-200': badge.variant === 'success',
                      'bg-blue-50 text-blue-700 border-blue-200': badge.variant === 'info',
                    }
                  )}
                >
                  {badge.icon}
                  {badge.text}
                </div>
              ))}
            </motion.div>
          )}

          {/* Preheadline */}
          {preheadline && (
            <motion.p
              variants={itemVariants}
              className="text-sm font-semibold text-primary tracking-wide uppercase mb-4"
            >
              {preheadline}
            </motion.p>
          )}

          {/* Main Headline */}
          <motion.h1
            id="hero-headline"
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
              {headline}
            </span>
            {subheadline && (
              <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {subheadline}
              </span>
            )}
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Metrics */}
          {metrics.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto"
            >
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-300 hover:scale-105",
                    metric.color || "bg-blue-50 border-blue-200"
                  )}
                >
                  {metric.icon}
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className="text-sm font-medium opacity-80">{metric.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <EnhancedButton
              size="xl"
              variant={primaryCTA.variant || "gradient"}
              onClick={primaryCTA.onClick}
              loading={primaryCTA.loading}
              className="min-w-[220px] shadow-lg hover:shadow-xl"
            >
              {primaryCTA.text}
            </EnhancedButton>
            
            {secondaryCTA && (
              <EnhancedButton
                size="xl"
                variant={secondaryCTA.variant || "outline"}
                onClick={secondaryCTA.onClick}
                loading={secondaryCTA.loading}
                className="min-w-[220px] border-2"
              >
                {secondaryCTA.text}
              </EnhancedButton>
            )}
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            variants={itemVariants}
            className="text-sm text-muted-foreground space-y-2"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>No credit card required • 5-minute setup • Cancel anytime</span>
            </div>
            <div>Join 50,000+ developers already optimizing with DBooster</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
