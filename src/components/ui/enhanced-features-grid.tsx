
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'outline';
  };
  cta?: {
    text: string;
    onClick: () => void;
  };
  gradient?: string;
}

interface EnhancedFeaturesGridProps {
  title: string;
  subtitle: string;
  features: Feature[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function EnhancedFeaturesGrid({
  title,
  subtitle,
  features,
  columns = 3,
  className
}: EnhancedFeaturesGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <section className={cn("py-16 md:py-20 lg:py-24", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={cn(
            "grid gap-6 lg:gap-8",
            gridClasses[columns]
          )}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
            >
              <Card className={cn(
                "h-full transition-all duration-300 hover:shadow-lg border-0 shadow-sm",
                feature.gradient
              )}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    {feature.badge && (
                      <Badge variant={feature.badge.variant} className="text-xs">
                        {feature.badge.text}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl md:text-2xl mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Benefits List */}
                  <ul className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {feature.cta && (
                    <Button
                      variant="outline"
                      onClick={feature.cta.onClick}
                      className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {feature.cta.text}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
