
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockData = [
  { time: '00:00', queries: 45, performance: 78, optimization: 65 },
  { time: '04:00', queries: 52, performance: 82, optimization: 71 },
  { time: '08:00', queries: 89, performance: 85, optimization: 78 },
  { time: '12:00', queries: 126, performance: 88, optimization: 82 },
  { time: '16:00', queries: 98, performance: 91, optimization: 85 },
  { time: '20:00', queries: 67, performance: 86, optimization: 80 },
];

export function RealTimeChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockData}>
          <defs>
            <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            className="text-xs text-muted-foreground"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            className="text-xs text-muted-foreground"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
          />
          <Area
            type="monotone"
            dataKey="queries"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorQueries)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="performance"
            stroke="hsl(142 76% 36%)"
            fillOpacity={1}
            fill="url(#colorPerformance)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
