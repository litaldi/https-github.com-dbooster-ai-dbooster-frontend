
import React from 'react';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ChartDataPoint {
  time: string;
  queries: number;
  responseTime: number;
  optimization: number;
  errors: number;
}

interface AreaChartViewProps {
  data: ChartDataPoint[];
}

export function AreaChartView({ data }: AreaChartViewProps) {
  return (
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
      </defs>
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
      <Area
        type="monotone"
        dataKey="queries"
        stroke="#3b82f6"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorQueries)"
        name="Queries/min"
      />
      <Area
        type="monotone"
        dataKey="responseTime"
        stroke="#10b981"
        strokeWidth={2}
        fillOpacity={1}
        fill="url(#colorResponseTime)"
        name="Response Time (ms)"
      />
    </AreaChart>
  );
}
