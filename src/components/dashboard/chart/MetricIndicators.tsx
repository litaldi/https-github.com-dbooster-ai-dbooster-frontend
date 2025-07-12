
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

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
  const getPercentageChange = (current: number, previous: number) => {
    if (!previous) return "0";
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="flex items-center gap-4">
      <Badge variant="outline" className="animate-pulse">
        <Activity className="h-3 w-3 mr-1" />
        Live Data
      </Badge>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Queries: {latestData?.queries || 0}/min</span>
          {previousData && latestData && (
            <Badge variant={
              latestData.queries > previousData.queries ? 'default' : 'secondary'
            } className="text-xs">
              {latestData.queries > previousData.queries ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(parseFloat(getPercentageChange(latestData.queries, previousData.queries))).toString()}%
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Response: {latestData?.responseTime || 0}ms</span>
        </div>
      </div>
    </div>
  );
}
