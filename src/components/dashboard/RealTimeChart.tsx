
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: string;
  queries: number;
  responseTime: number;
  throughput: number;
}

export function RealTimeChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Generate initial data
    const generateData = () => {
      const now = new Date();
      const newData: ChartDataPoint[] = [];
      
      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000);
        newData.push({
          time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          queries: Math.floor(Math.random() * 100) + 50,
          responseTime: Math.floor(Math.random() * 200) + 100,
          throughput: Math.floor(Math.random() * 1000) + 500,
        });
      }
      
      return newData;
    };

    setData(generateData());

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setData(prevData => {
        const newPoint: ChartDataPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          queries: Math.floor(Math.random() * 100) + 50,
          responseTime: Math.floor(Math.random() * 200) + 100,
          throughput: Math.floor(Math.random() * 1000) + 500,
        };
        
        return [...prevData.slice(1), newPoint];
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="queries" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            dot={false}
            name="Queries/min"
          />
          <Line 
            type="monotone" 
            dataKey="responseTime" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            dot={false}
            name="Response Time (ms)"
          />
          <Line 
            type="monotone" 
            dataKey="throughput" 
            stroke="hsl(var(--chart-3))" 
            strokeWidth={2}
            dot={false}
            name="Throughput"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
