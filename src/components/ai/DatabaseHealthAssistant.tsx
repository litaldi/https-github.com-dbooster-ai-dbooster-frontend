
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw } from 'lucide-react';
import { FadeIn } from '@/components/ui/animations';
import { useDatabaseHealth } from '@/hooks/useDatabaseHealth';
import { HealthScoreCard } from './health/HealthScoreCard';
import { HealthInsightsList } from './health/HealthInsightsList';

export function DatabaseHealthAssistant() {
  const {
    insights,
    isAnalyzing,
    healthScore,
    lastCheck,
    generateInsights
  } = useDatabaseHealth();

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Poor';
    return 'Critical';
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <HealthScoreCard
          healthScore={healthScore}
          lastCheck={lastCheck}
          getHealthScoreColor={getHealthScoreColor}
          getHealthScoreLabel={getHealthScoreLabel}
        />
        <div className="mt-4">
          <Button 
            onClick={generateInsights} 
            disabled={isAnalyzing}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Database Health...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Run Health Check
              </>
            )}
          </Button>
        </div>
      </FadeIn>

      <HealthInsightsList insights={insights} />
    </div>
  );
}
