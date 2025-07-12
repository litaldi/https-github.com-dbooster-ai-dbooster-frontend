
import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

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
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis 
        dataKey="time" 
        stroke="#64748b"
        fontSize={12}
        tickLine={false}
      />
      <YAxis 
        stroke="#64748b"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip 
        contentStyle={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}
      />
      <Line
        type="monotone"
        dataKey="queries"
        stroke="#3b82f6"
        strokeWidth={3}
        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
        name="Queries/min"
      />
      <Line
        type="monotone"
        dataKey="responseTime"
        stroke="#10b981"
        strokeWidth={3}
        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
        name="Response Time (ms)"
      />
      <Line
        type="monotone"
        dataKey="optimization"
        stroke="#8b5cf6"
        strokeWidth={2}
        dot={false}
        name="Optimization %"
      />
    </LineChart>
  );
}
