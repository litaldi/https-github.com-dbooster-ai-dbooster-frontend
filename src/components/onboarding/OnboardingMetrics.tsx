
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, Database, Zap } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';

interface OnboardingMetricsProps {
  showMetrics: boolean;
}

export function OnboardingMetrics({ showMetrics }: OnboardingMetricsProps) {
  if (!showMetrics) return null;

  return (
    <FadeIn delay={0.3}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="text-center p-4">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">73%</div>
          <div className="text-sm text-muted-foreground">Faster Query Response</div>
        </Card>
        <Card className="text-center p-4">
          <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">60%</div>
          <div className="text-sm text-muted-foreground">Database Cost Reduction</div>
        </Card>
        <Card className="text-center p-4">
          <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">80%</div>
          <div className="text-sm text-muted-foreground">Performance Tasks Automated</div>
        </Card>
      </div>
    </FadeIn>
  );
}
