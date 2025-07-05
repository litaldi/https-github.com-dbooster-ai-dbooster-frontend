
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  cta?: {
    text: string;
    onClick?: () => void;
    href?: string;
  };
  gradient?: string;
}

interface EnhancedFeaturesGridProps {
  title: string;
  subtitle?: string;
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <section className={cn("py-20 bg-background", className)} aria-labelledby="features-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            id="features-title"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={cn("grid gap-8", gridCols[columns])}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center",
                    feature.gradient || "bg-gradient-to-br from-primary/10 to-primary/5"
                  )}>
                    <div className="text-primary [&_svg]:w-8 [&_svg]:h-8">
                      {feature.icon}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                    {feature.badge && (
                      <Badge variant={feature.badge.variant || 'secondary'} className="text-xs">
                        {feature.badge.text}
                      </Badge>
                    )}
                  </div>
                  
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {feature.benefits.length > 0 && (
                    <div className="mb-6">
                      <ul className="space-y-2" role="list">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feature.cta && (
                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-accent/50 transition-colors"
                      onClick={feature.cta.onClick}
                      asChild={!!feature.cta.href}
                    >
                      {feature.cta.href ? (
                        <a href={feature.cta.href} className="flex items-center justify-center gap-2">
                          {feature.cta.text}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      ) : (
                        <>
                          {feature.cta.text}
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
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
