
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface DataPoint {
  x: number;
  y: number;
  z: number;
  value: number;
  label: string;
}

export function HolographicChart() {
  const [selectedMetric, setSelectedMetric] = useState('performance');
  
  const performanceData: DataPoint[] = [
    { x: -2, y: 0, z: 0, value: 0.8, label: 'Query Speed' },
    { x: -1, y: 0, z: 0, value: 0.9, label: 'Index Efficiency' },
    { x: 0, y: 0, z: 0, value: 0.7, label: 'Memory Usage' },
    { x: 1, y: 0, z: 0, value: 0.95, label: 'Cache Hit Rate' },
    { x: 2, y: 0, z: 0, value: 0.85, label: 'Connection Pool' }
  ];

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-white">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl"
          >
            <BarChart3 className="h-5 w-5 text-white" />
          </motion.div>
          Holographic Analytics
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white animate-pulse">
            <Activity className="h-3 w-3 mr-1" />
            Real-time Analytics
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Metric Selector */}
        <div className="flex gap-2 mb-6">
          {['performance', 'usage', 'optimization'].map((metric) => (
            <motion.button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMetric === metric
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Simplified Chart Visualization */}
        <div className="h-80 rounded-xl overflow-hidden bg-gradient-to-b from-transparent to-purple-900/20 border border-purple-500/30 p-6">
          <div className="h-full flex items-end justify-center gap-4">
            {performanceData.map((point, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="w-12 bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-lg relative overflow-hidden"
                  style={{ height: `${point.value * 200}px` }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                </motion.div>
                <div className="text-xs text-center text-gray-300">
                  <div className="font-medium">{Math.round(point.value * 100)}%</div>
                  <div className="text-gray-400">{point.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data Insights */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {performanceData.map((point, index) => (
            <motion.div
              key={index}
              className="p-3 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="text-xs text-gray-400 mb-1">{point.label}</div>
              <div className="text-lg font-bold text-white">
                {Math.round(point.value * 100)}%
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                <motion.div
                  className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${point.value * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-purple-300" />
            <span className="text-sm font-medium text-white">AI Pattern Recognition</span>
          </div>
          <div className="text-xs text-gray-300 leading-relaxed">
            Analytics show optimal performance correlation between index efficiency and cache hit rates. 
            Recommended optimization strategy: Implement adaptive indexing with 94% confidence.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
