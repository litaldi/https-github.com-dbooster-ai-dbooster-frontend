
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  queries: number;
  responseTime: number;
  optimization: number;
  errors: number;
}

interface MetricIndicatorsProps {
  latestData?: ChartDataPoint;
  previousData?: ChartDataPoint;
}

export function MetricIndicators({ latestData, previousData }: MetricIndicatorsProps) {
  if (!latestData || !previousData) {
    return (
      <div className="flex items-center gap-4">
        <Badge variant="outline">Loading metrics...</Badge>
      </div>
    );
  }

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    const isUp = diff > 0;
    const percentage = Math.abs((diff / previous) * 100).toFixed(1);
    
    return {
      isUp,
      percentage,
      icon: isUp ? TrendingUp : TrendingDown,
      color: isUp ? 'text-green-600' : 'text-red-600'
    };
  };

  const queryTrend = getTrend(latestData.queries, previousData.queries);
  const responseTrend = getTrend(latestData.responseTime, previousData.responseTime);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Queries:</span>
        <span className="text-lg font-bold">{latestData.queries}</span>
        <div className={`flex items-center gap-1 ${queryTrend.color}`}>
          <queryTrend.icon className="h-3 w-3" />
          <span className="text-xs">{queryTrend.percentage}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Response:</span>
        <span className="text-lg font-bold">{latestData.responseTime}ms</span>
        <div className={`flex items-center gap-1 ${responseTrend.color}`}>
          <responseTrend.icon className="h-3 w-3" />
          <span className="text-xs">{responseTrend.percentage}%</span>
        </div>
      </div>
    </div>
  );
}
