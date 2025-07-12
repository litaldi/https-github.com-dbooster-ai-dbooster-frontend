
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
import { ChartControls } from './chart/ChartControls';
import { MetricIndicators } from './chart/MetricIndicators';
import { AreaChartView } from './chart/AreaChartView';
import { LineChartView } from './chart/LineChartView';

interface ChartDataPoint {
  time: string;
  queries: number;
  responseTime: number;
  optimization: number;
  errors: number;
}

export function RealTimeChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');

  useEffect(() => {
    // Initialize with some data
    const initialData: ChartDataPoint[] = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }),
      queries: Math.floor(Math.random() * 100) + 50,
      responseTime: Math.floor(Math.random() * 200) + 100,
      optimization: Math.floor(Math.random() * 50) + 60,
      errors: Math.floor(Math.random() * 5)
    }));
    setData(initialData);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          }),
          queries: Math.floor(Math.random() * 100) + 50,
          responseTime: Math.floor(Math.random() * 200) + 100,
          optimization: Math.floor(Math.random() * 50) + 60,
          errors: Math.floor(Math.random() * 5)
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <MetricIndicators latestData={latestData} previousData={previousData} />
        <ChartControls chartType={chartType} onChartTypeChange={setChartType} />
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChartView data={data} />
          ) : (
            <LineChartView data={data} />
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
