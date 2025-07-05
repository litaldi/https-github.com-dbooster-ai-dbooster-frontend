
import React from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: {
    text: string;
    onClick: () => void;
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  features?: string[];
  showAnimation?: boolean;
  backgroundPattern?: 'dots' | 'grid' | 'gradient';
}

export function EnhancedHeroSection({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badge,
  features = [],
  showAnimation = true,
  backgroundPattern = 'gradient'
}: EnhancedHeroSectionProps) {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className={`absolute inset-0 -z-10 ${
        backgroundPattern === 'gradient' 
          ? 'bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5'
          : backgroundPattern === 'dots'
          ? 'bg-dot-pattern opacity-20'
          : 'bg-grid-pattern opacity-10'
      }`} />
      
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          {/* Badge */}
          {badge && (
            <div className="flex justify-center">
              <Badge 
                variant={badge.variant || 'secondary'} 
                className={`px-4 py-2 text-sm ${showAnimation ? 'animate-pulse' : ''}`}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {badge.text}
              </Badge>
            </div>
          )}

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            
            {subtitle && (
              <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
                {subtitle}
              </h2>
            )}
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Features List */}
          {features.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" />
                  {feature}
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={primaryCTA.onClick}
              className={`px-8 py-3 text-lg font-semibold ${showAnimation ? 'hover:scale-105' : ''} transition-transform`}
            >
              {primaryCTA.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {secondaryCTA && (
              <Button
                variant="outline"
                size="lg"
                onClick={secondaryCTA.onClick}
                className="px-8 py-3 text-lg"
              >
                {secondaryCTA.text}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
