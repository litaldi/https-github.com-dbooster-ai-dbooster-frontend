
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

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

  const getPercentageChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const renderChart = () => {
    if (chartType === 'area') {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="animate-pulse">
            <Activity className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Queries: {latestData?.queries || 0}/min</span>
              {previousData && (
                <Badge variant={
                  latestData?.queries > previousData.queries ? 'default' : 'secondary'
                } className="text-xs">
                  {latestData?.queries > previousData.queries ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(parseFloat(getPercentageChange(latestData?.queries || 0, previousData.queries)))}%
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Response: {latestData?.responseTime || 0}ms</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            Line
          </Button>
          <Button
            variant={chartType === 'area' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('area')}
          >
            Area
          </Button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
