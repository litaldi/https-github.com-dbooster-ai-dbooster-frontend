
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Bot } from 'lucide-react';

interface HealthScoreCardProps {
  healthScore: number;
  lastCheck: Date | null;
  getHealthScoreColor: (score: number) => string;
  getHealthScoreLabel: (score: number) => string;
}

export const HealthScoreCard: React.FC<HealthScoreCardProps> = React.memo(({
  healthScore,
  lastCheck,
  getHealthScoreColor,
  getHealthScoreLabel
}) => {
  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-green-600" />
          Database Health Assistant
          <Badge variant="secondary" className="ml-2">
            <Bot className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          AI-powered health monitoring that proactively identifies and resolves database issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getHealthScoreColor(healthScore)}`}>
              {healthScore}%
            </div>
            <div className="text-lg font-medium">
              Database Health Score - {getHealthScoreLabel(healthScore)}
            </div>
            <Progress value={healthScore} className="w-full h-3" />
          </div>
          
          {lastCheck && (
            <div className="text-sm text-muted-foreground">
              Last checked: {lastCheck.toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

HealthScoreCard.displayName = 'HealthScoreCard';
