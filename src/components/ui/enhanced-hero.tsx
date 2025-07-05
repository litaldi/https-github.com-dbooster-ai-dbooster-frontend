
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedHeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  badges?: Array<{
    icon: React.ReactNode;
    text: string;
    variant?: 'default' | 'secondary' | 'outline';
  }>;
  metrics?: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
    color: string;
  }>;
  className?: string;
}

export function EnhancedHero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badges = [],
  metrics = [],
  className
}: EnhancedHeroProps) {
  return (
    <section 
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 md:py-32",
        className
      )}
      aria-labelledby="hero-title"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl rounded-full" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badges */}
          {badges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant || 'secondary'} className="px-4 py-2">
                  {badge.icon}
                  <span className="ml-2">{badge.text}</span>
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm font-medium text-primary mb-4 tracking-wide uppercase"
          >
            {subtitle}
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            id="hero-title"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent leading-tight"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              onClick={primaryCTA.onClick}
              disabled={primaryCTA.loading}
              className="min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {primaryCTA.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            
            {secondaryCTA && (
              <Button
                variant="outline"
                size="lg"
                onClick={secondaryCTA.onClick}
                className="min-w-[200px] h-12 text-base font-semibold border-2 hover:bg-accent/10"
              >
                {secondaryCTA.text}
              </Button>
            )}
          </motion.div>

          {/* Metrics */}
          {metrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
            >
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3 p-4 bg-background/50 backdrop-blur-sm rounded-lg border shadow-sm"
                >
                  <div className={cn("p-2 rounded-full", metric.color)}>
                    {metric.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
