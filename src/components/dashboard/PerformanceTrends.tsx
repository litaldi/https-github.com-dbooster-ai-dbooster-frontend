
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp } from 'lucide-react';

interface TrendData {
  day: string;
  value: number;
  label?: string;
}

const defaultTrendData: TrendData[] = [
  { day: 'Mon', value: 65, label: '65ms' },
  { day: 'Tue', value: 58, label: '58ms' },
  { day: 'Wed', value: 72, label: '72ms' },
  { day: 'Thu', value: 49, label: '49ms' },
  { day: 'Fri', value: 41, label: '41ms' },
  { day: 'Sat', value: 38, label: '38ms' },
  { day: 'Sun', value: 35, label: '35ms' }
];

interface PerformanceTrendsProps {
  data?: TrendData[];
  title?: string;
  description?: string;
  averageImprovement?: string;
  progressValue?: number;
}

export function PerformanceTrends({ 
  data = defaultTrendData,
  title = "Performance Trends",
  description = "Query response time over the last 7 days",
  averageImprovement = "-23% vs last week",
  progressValue = 77
}: PerformanceTrendsProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Average Response Time</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              {averageImprovement}
            </Badge>
          </div>
          
          <Progress value={progressValue} className="h-2" />
          
          <div className="grid grid-cols-7 gap-2 mt-6">
            {data.map((item, index) => {
              const height = Math.max(8, (item.value / maxValue) * 64); // Min height 8px, max 64px
              
              return (
                <div key={index} className="text-center">
                  <div 
                    className="bg-primary/20 rounded-sm mb-2 transition-all duration-300 hover:bg-primary/30"
                    style={{ height: `${height}px` }}
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-foreground">{item.day}</span>
                    <span className="text-xs text-muted-foreground block">
                      {item.label || `${item.value}ms`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Performance improving consistently</span>
              <Badge variant="outline" className="text-xs">
                7-day trend
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
