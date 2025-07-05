
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CTAButton {
  text: string;
  onClick: () => void;
  loading?: boolean;
}

interface CTABadge {
  text: string;
  icon: React.ReactNode;
}

interface EnhancedCTASectionProps {
  title: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA: CTAButton;
  trustSignals: string[];
  badge: CTABadge;
  backgroundVariant: 'default' | 'gradient';
}

export function EnhancedCTASection({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  trustSignals,
  badge,
  backgroundVariant
}: EnhancedCTASectionProps) {
  const bgClass = backgroundVariant === 'gradient' 
    ? 'bg-gradient-to-br from-primary/10 via-blue-50/50 to-purple-50/50 dark:from-primary/5 dark:via-blue-950/20 dark:to-purple-950/20' 
    : 'bg-muted/30';

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${bgClass}`}>
      <div className="max-w-4xl mx-auto text-center">
        <Badge variant="secondary" className="mb-6">
          {badge.icon}
          {badge.text}
        </Badge>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
          {title}
        </h2>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={primaryCTA.onClick}
            disabled={primaryCTA.loading}
            size="lg"
            className="text-lg px-8 py-6"
          >
            {primaryCTA.text}
          </Button>
          <Button
            onClick={secondaryCTA.onClick}
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6"
          >
            {secondaryCTA.text}
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {trustSignals.map((signal, index) => (
            <div key={index} className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
              {signal}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
