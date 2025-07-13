
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="time" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Area 
        type="monotone" 
        dataKey="queries" 
        stroke="#3b82f6" 
        fillOpacity={1} 
        fill="url(#colorQueries)"
        name="Queries"
      />
      <Area 
        type="monotone" 
        dataKey="responseTime" 
        stroke="#10b981" 
        fillOpacity={1} 
        fill="url(#colorResponse)"
        name="Response Time (ms)"
      />
    </AreaChart>
  );
}
