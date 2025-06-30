
import { useState, useEffect } from 'react';
import { nextGenAIService, type DatabaseHealthInsight } from '@/services/ai/nextGenAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function useDatabaseHealth() {
  const [insights, setInsights] = useState<DatabaseHealthInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthScore, setHealthScore] = useState(85);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    
    try {
      const healthInsights = await nextGenAIService.generateDatabaseHealthInsights('demo-db');
      setInsights(healthInsights);
      setLastCheck(new Date());
      
      const criticalCount = healthInsights.filter(i => i.priority === 'critical').length;
      const highCount = healthInsights.filter(i => i.priority === 'high').length;
      const newScore = Math.max(50, 100 - (criticalCount * 20) - (highCount * 10));
      setHealthScore(newScore);

      enhancedToast.success({
        title: "Health Analysis Complete",
        description: `Generated ${healthInsights.length} insights for your database`,
      });
    } catch (error) {
      enhancedToast.error({
        title: "Health Analysis Failed",
        description: "Unable to analyze database health. Please try again.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    insights,
    isAnalyzing,
    healthScore,
    lastCheck,
    generateInsights
  };
}
