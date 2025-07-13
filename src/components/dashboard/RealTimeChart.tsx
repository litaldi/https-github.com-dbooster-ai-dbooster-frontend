
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      queries: Math.floor(Math.random() * 100) + 50,
      optimized: Math.floor(Math.random() * 80) + 30,
      performance: Math.floor(Math.random() * 20) + 70
    });
  }
  
  return data;
};

export function RealTimeChart() {
  const data = generateMockData();

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="queries" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Total Queries"
          />
          <Line 
            type="monotone" 
            dataKey="optimized" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Optimized"
          />
          <Line 
            type="monotone" 
            dataKey="performance" 
            stroke="#f59e0b" 
            strokeWidth={2}
            name="Performance %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
