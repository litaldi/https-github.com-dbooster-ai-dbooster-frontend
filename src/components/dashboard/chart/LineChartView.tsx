
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ChartDataPoint {
  time: string;
  queries: number;
  responseTime: number;
  optimization: number;
  errors: number;
}

interface LineChartViewProps {
  data: ChartDataPoint[];
}

export function LineChartView({ data }: LineChartViewProps) {
  return (
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="time" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="queries" 
        stroke="#3b82f6" 
        strokeWidth={2}
        name="Queries"
      />
      <Line 
        type="monotone" 
        dataKey="responseTime" 
        stroke="#10b981" 
        strokeWidth={2}
        name="Response Time (ms)"
      />
      <Line 
        type="monotone" 
        dataKey="optimization" 
        stroke="#f59e0b" 
        strokeWidth={2}
        name="Optimization %"
      />
      <Line 
        type="monotone" 
        dataKey="errors" 
        stroke="#ef4444" 
        strokeWidth={2}
        name="Errors"
      />
    </LineChart>
  );
}
