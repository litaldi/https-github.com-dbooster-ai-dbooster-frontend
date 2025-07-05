
import React from 'react';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedHeroSectionProps {
  preheadline?: string;
  headline?: string;
  title?: string;
  subheadline?: string;
  subtitle?: string;
  description: string;
  primaryCTA: {
    text: string;
    onClick: () => void;
    loading?: boolean;
    variant?: 'default' | 'gradient';
  };
  secondaryCTA?: {
    text: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  badges?: Array<{
    text: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
  }>;
  metrics?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    color?: string;
  }>;
  features?: string[];
  showAnimation?: boolean;
  backgroundPattern?: 'dots' | 'grid' | 'gradient';
}

export function EnhancedHeroSection({
  preheadline,
  headline,
  title,
  subheadline,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  badges = [],
  metrics = [],
  features = [],
  showAnimation = true,
  backgroundPattern = 'gradient'
}: EnhancedHeroSectionProps) {
  const displayTitle = headline || title || '';
  const displaySubtitle = subheadline || subtitle || '';

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
          {/* Preheadline */}
          {preheadline && (
            <div className="text-sm text-muted-foreground font-medium">
              {preheadline}
            </div>
          )}

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, index) => (
                <Badge 
                  key={index}
                  variant={badge.variant === 'success' ? 'secondary' : badge.variant || 'secondary'} 
                  className={`px-4 py-2 text-sm ${showAnimation ? 'animate-pulse' : ''} ${
                    badge.variant === 'success' ? 'bg-green-50 text-green-700 border-green-200' : ''
                  }`}
                >
                  {badge.icon && <span className="mr-2">{badge.icon}</span>}
                  {badge.text}
                </Badge>
              ))}
            </div>
          )}

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {displayTitle}
              </span>
            </h1>
            
            {displaySubtitle && (
              <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium">
                {displaySubtitle}
              </h2>
            )}
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Metrics */}
          {metrics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {metrics.map((metric, index) => (
                <div key={index} className={`p-3 rounded-lg border ${metric.color || 'bg-card'}`}>
                  <div className="flex items-center justify-center gap-2">
                    {metric.icon}
                    <div className="text-center">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
              disabled={primaryCTA.loading}
              className={`px-8 py-3 text-lg font-semibold ${showAnimation ? 'hover:scale-105' : ''} transition-transform ${
                primaryCTA.variant === 'gradient' ? 'bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl' : ''
              }`}
            >
              {primaryCTA.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {primaryCTA.text}
                </>
              ) : (
                <>
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {secondaryCTA && (
              <Button
                variant={secondaryCTA.variant || 'outline'}
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
