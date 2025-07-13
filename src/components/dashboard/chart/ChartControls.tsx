
import React from 'react';
import { Button } from '@/components/ui/button';
import { AreaChart, LineChart } from 'lucide-react';

interface ChartControlsProps {
  chartType: 'line' | 'area';
  onChartTypeChange: (type: 'line' | 'area') => void;
}

export function ChartControls({ chartType, onChartTypeChange }: ChartControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={chartType === 'area' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChartTypeChange('area')}
      >
        <AreaChart className="h-4 w-4 mr-2" />
        Area
      </Button>
      <Button
        variant={chartType === 'line' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChartTypeChange('line')}
      >
        <LineChart className="h-4 w-4 mr-2" />
        Line
      </Button>
    </div>
  );
}
