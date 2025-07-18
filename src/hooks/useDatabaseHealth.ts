
import { useState, useEffect } from 'react';
import { DatabaseHealthInsight, nextGenAIService } from '@/services/ai/nextGenAIService';

export function useDatabaseHealth(databaseId?: string) {
  const [insights, setInsights] = useState<DatabaseHealthInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHealthInsights = async () => {
    if (!databaseId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await nextGenAIService.initialize();
      const healthInsights = await nextGenAIService.generateDatabaseHealthInsights(databaseId);
      setInsights(healthInsights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate health insights');
      console.error('Health insights generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyRecommendation = async (insight: DatabaseHealthInsight) => {
    // In a real implementation, this would apply the recommendation
    console.log('Applying recommendation for insight:', insight.id);
    // For demo purposes, just remove it from the list
    setInsights(prev => prev.filter(i => i.id !== insight.id));
  };

  useEffect(() => {
    if (databaseId) {
      generateHealthInsights();
    }
  }, [databaseId]);

  return {
    insights,
    isLoading,
    error,
    generateHealthInsights,
    applyRecommendation
  };
}
