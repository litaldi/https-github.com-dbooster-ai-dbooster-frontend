
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  badge?: {
    text: string;
    variant: 'default' | 'secondary';
  };
  cta: {
    text: string;
    onClick: () => void;
  };
  gradient: string;
}

interface EnhancedFeaturesGridProps {
  title: string;
  subtitle: string;
  features: Feature[];
  columns: number;
}

export function EnhancedFeaturesGrid({ title, subtitle, features, columns }: EnhancedFeaturesGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }[columns] || 'md:grid-cols-3';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 ${gridCols} gap-8`}>
          {features.map((feature, index) => (
            <div key={index} className={`relative p-8 rounded-xl border ${feature.gradient} hover:shadow-lg transition-shadow`}>
              {feature.badge && (
                <Badge variant={feature.badge.variant} className="absolute top-4 right-4">
                  {feature.badge.text}
                </Badge>
              )}
              
              <div className="mb-6">
                <div className="p-3 rounded-lg bg-background/50 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-start text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Button onClick={feature.cta.onClick} variant="outline" className="w-full">
                {feature.cta.text}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
