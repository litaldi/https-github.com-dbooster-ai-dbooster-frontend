
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { useNaturalLanguageQuery } from '@/hooks/useNaturalLanguageQuery';
import { QueryInput } from './natural-language/QueryInput';
import { QueryResult } from './natural-language/QueryResult';

const EXAMPLE_QUERIES = [
  "Show me all users who signed up in the last 30 days",
  "Find the top 10 products by revenue this quarter",
  "Get all orders from customers in California with status 'shipped'",
  "Show me users who have made more than 5 purchases",
  "Find duplicate email addresses in the users table",
  "Get the average order value by month for this year"
];

export function NaturalLanguageQueryBuilder() {
  const {
    naturalLanguage,
    setNaturalLanguage,
    isConverting,
    result,
    handleConvert,
    copyToClipboard
  } = useNaturalLanguageQuery();

  return (
    <div className="space-y-6">
      <FadeIn>
        <QueryInput
          naturalLanguage={naturalLanguage}
          setNaturalLanguage={setNaturalLanguage}
          isConverting={isConverting}
          onConvert={handleConvert}
          exampleQueries={EXAMPLE_QUERIES}
        />
      </FadeIn>

      {result && (
        <ScaleIn delay={0.2}>
          <QueryResult result={result} onCopy={copyToClipboard} />
        </ScaleIn>
      )}

      {EXAMPLE_QUERIES.slice(3).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">More Examples to Try</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {EXAMPLE_QUERIES.slice(3).map((example, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-50 transition-colors p-3 text-xs justify-start h-auto whitespace-normal"
                  onClick={() => setNaturalLanguage(example)}
                >
                  {example}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
