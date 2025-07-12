
import React from 'react';
import { Button } from '@/components/ui/button';

interface ChartControlsProps {
  chartType: 'line' | 'area';
  onChartTypeChange: (type: 'line' | 'area') => void;
}

export function ChartControls({ chartType, onChartTypeChange }: ChartControlsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={chartType === 'line' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChartTypeChange('line')}
      >
        Line
      </Button>
      <Button
        variant={chartType === 'area' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onChartTypeChange('area')}
      >
        Area
      </Button>
    </div>
  );
}
