
import { useState, useEffect } from 'react';
import { DatabaseHealthInsight, nextGenAIService } from '@/services/ai/nextGenAIService';

export function useDatabaseHealth(databaseId?: string) {
  const [insights, setInsights] = useState<DatabaseHealthInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(85);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const generateInsights = async () => {
    if (!databaseId) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      await nextGenAIService.initialize();
      const healthInsights = await nextGenAIService.generateDatabaseHealthInsights(databaseId);
      setInsights(healthInsights);
      setLastCheck(new Date());
      
      // Calculate health score based on insights
      const criticalCount = healthInsights.filter(i => i.priority === 'critical').length;
      const highCount = healthInsights.filter(i => i.priority === 'high').length;
      const newScore = Math.max(60, 100 - (criticalCount * 15) - (highCount * 10));
      setHealthScore(newScore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate health insights');
      console.error('Health insights generation failed:', err);
    } finally {
      setIsAnalyzing(false);
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
      generateInsights();
    }
  }, [databaseId]);

  return {
    insights,
    isAnalyzing,
    error,
    healthScore,
    lastCheck,
    generateInsights,
    applyRecommendation
  };
}
