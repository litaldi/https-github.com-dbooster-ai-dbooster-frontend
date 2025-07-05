
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  backgroundVariant?: 'default' | 'gradient' | 'solid' | 'pattern';
}

export function EnhancedCTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  trustSignals = [],
  badge,
  backgroundVariant = 'default'
}: EnhancedCTASectionProps) {
  const getBackgroundClass = () => {
    switch (backgroundVariant) {
      case 'gradient':
        return 'bg-gradient-to-r from-primary/5 to-purple-500/5';
      case 'solid':
        return 'bg-muted/20';
      case 'pattern':
        return 'bg-dot-pattern opacity-20';
      default:
        return 'bg-background';
    }
  };

  return (
    <section className={`py-16 ${getBackgroundClass()}`}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {badge && (
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="px-4 py-2">
                {badge.icon}
                {badge.text}
              </Badge>
            </div>
          )}

          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground mb-8">{description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button
              size="lg"
              onClick={primaryCTA.onClick}
              disabled={primaryCTA.loading}
              className="min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl"
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
                variant="outline"
                size="lg"
                onClick={secondaryCTA.onClick}
                className="min-w-[200px] h-12 text-base font-semibold border-2"
              >
                {secondaryCTA.text}
              </Button>
            )}
          </div>
          
          {trustSignals.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {trustSignals.map((signal, index) => (
                <span key={index} className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  {signal}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
