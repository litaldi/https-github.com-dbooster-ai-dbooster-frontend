
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroMetric {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface HeroBadge {
  text: string;
  icon: React.ReactNode;
  variant: 'default' | 'secondary' | 'success';
}

interface HeroCTA {
  text: string;
  onClick: () => void;
  loading?: boolean;
  variant: 'default' | 'outline' | 'gradient';
}

interface EnhancedHeroSectionProps {
  preheadline: string;
  headline: string;
  subheadline: string;
  description: string;
  primaryCTA: HeroCTA;
  secondaryCTA: HeroCTA;
  badges: HeroBadge[];
  metrics: HeroMetric[];
}

export function EnhancedHeroSection({
  preheadline,
  headline,
  subheadline,
  description,
  primaryCTA,
  secondaryCTA,
  badges,
  metrics
}: EnhancedHeroSectionProps) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary uppercase tracking-wide">
              {preheadline}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {headline}
              <span className="block text-primary">{subheadline}</span>
            </h1>
          </div>

          <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
            {description}
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {badges.map((badge, index) => (
              <Badge key={index} variant={badge.variant} className="flex items-center gap-1">
                {badge.icon}
                {badge.text}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={primaryCTA.onClick}
              disabled={primaryCTA.loading}
              variant={primaryCTA.variant as any}
              size="lg"
              className="text-lg px-8 py-6"
            >
              {primaryCTA.text}
            </Button>
            <Button
              onClick={secondaryCTA.onClick}
              variant={secondaryCTA.variant as any}
              size="lg"
              className="text-lg px-8 py-6"
            >
              {secondaryCTA.text}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {metrics.map((metric, index) => (
              <div key={index} className={`p-6 rounded-lg border-2 ${metric.color}`}>
                <div className="flex items-center justify-center mb-2">
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-center">{metric.value}</div>
                <div className="text-sm text-muted-foreground text-center">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
