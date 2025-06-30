
import { useState } from 'react';
import { nextGenAIService } from '@/services/ai/nextGenAIService';
import { enhancedToast } from '@/components/ui/enhanced-toast';

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

  const handleConvert = async () => {
    if (!naturalLanguage.trim()) {
      enhancedToast.warning({
        title: "No Request Provided",
        description: "Please describe what you want to query.",
      });
      return;
    }

    setIsConverting(true);
    setResult(null);

    try {
      const conversionResult = await nextGenAIService.convertNaturalLanguageToSQL({
        naturalLanguage,
        context: {
          schema: 'demo_schema',
          recentQueries: []
        }
      });

      setResult(conversionResult);

      enhancedToast.success({
        title: "Query Generated Successfully",
        description: `SQL generated with ${Math.round(conversionResult.confidence * 100)}% confidence`,
      });
    } catch (error) {
      enhancedToast.error({
        title: "Conversion Failed",
        description: "Unable to convert natural language to SQL. Please try again.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    enhancedToast.success({
      title: "Copied to Clipboard",
      description: "SQL query has been copied to your clipboard.",
    });
  };

  return {
    naturalLanguage,
    setNaturalLanguage,
    isConverting,
    result,
    handleConvert,
    copyToClipboard
  };
}
