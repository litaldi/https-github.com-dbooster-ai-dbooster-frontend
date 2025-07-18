
import { useState } from 'react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';

interface ConversionResult {
  sql: string;
  explanation: string;
  confidence: number;
  alternatives: string[];
}

export function useNaturalLanguageQuery() {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!naturalLanguage.trim()) return;

    setIsConverting(true);
    setError(null);

    try {
      await nextGenAIService.initialize();
      
      const conversionResult = await nextGenAIService.convertNaturalLanguageToSQL({
        naturalLanguage,
        context: {
          schema: 'users(id, name, email, created_at), orders(id, user_id, total, created_at)',
          recentQueries: []
        }
      });

      setResult(conversionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
      console.error('Natural language conversion failed:', err);
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return {
    naturalLanguage,
    setNaturalLanguage,
    isConverting,
    result,
    error,
    handleConvert,
    copyToClipboard
  };
}
