
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCTASectionProps {
  title: string;
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
  trustSignals?: string[];
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  backgroundVariant?: 'gradient' | 'solid' | 'pattern';
  className?: string;
}

export function EnhancedCTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  trustSignals = [],
  badge,
  backgroundVariant = 'gradient',
  className
}: EnhancedCTASectionProps) {
  const backgroundStyles = {
    gradient: 'bg-gradient-to-r from-primary/5 via-primary/10 to-purple-500/5',
    solid: 'bg-muted/30',
    pattern: 'bg-gradient-to-br from-background via-muted/20 to-background'
  };

  return (
    <section 
      className={cn(
        "py-20 relative overflow-hidden",
        backgroundStyles[backgroundVariant],
        className
      )}
      aria-labelledby="cta-title"
    >
      {/* Background Effects */}
      {backgroundVariant === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full opacity-60" />
        </>
      )}
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {badge.icon || <Sparkles className="w-4 h-4 mr-2" />}
                {badge.text}
              </Badge>
            </motion.div>
          )}

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            id="cta-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
          >
            {title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
          >
            <Button
              size="lg"
              onClick={primaryCTA.onClick}
              disabled={primaryCTA.loading}
              className="min-w-[220px] h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {primaryCTA.loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
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
                className="min-w-[220px] h-14 text-lg font-semibold border-2 hover:bg-accent/10"
              >
                {secondaryCTA.text}
              </Button>
            )}
          </motion.div>

          {/* Trust Signals */}
          {trustSignals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground"
            >
              {trustSignals.map((signal, index) => (
                <React.Fragment key={index}>
                  <span>{signal}</span>
                  {index < trustSignals.length - 1 && (
                    <div className="w-1 h-1 bg-muted-foreground/50 rounded-full" />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
