
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline';
  };
  cta?: {
    text: string;
    onClick: () => void;
  };
  gradient?: string;
}

interface EnhancedFeaturesGridProps {
  title: string;
  subtitle?: string;
  features: Feature[];
  columns?: 1 | 2 | 3 | 4;
}

export function EnhancedFeaturesGrid({
  title,
  subtitle,
  features,
  columns = 3
}: EnhancedFeaturesGridProps) {
  const getGridClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className={`grid ${getGridClass()} gap-8`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow ${feature.gradient || ''}`}
            >
              {feature.badge && (
                <div className="absolute top-4 right-4">
                  <Badge variant={feature.badge.variant || 'default'} className="text-xs">
                    {feature.badge.text}
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="text-primary">{feature.icon}</div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>

              <p className="text-muted-foreground mb-4">{feature.description}</p>

              <ul className="space-y-2 mb-6">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              {feature.cta && (
                <Button
                  variant="outline"
                  onClick={feature.cta.onClick}
                  className="w-full"
                >
                  {feature.cta.text}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
