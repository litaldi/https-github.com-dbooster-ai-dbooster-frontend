
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import * as THREE from 'three';

interface DataPoint {
  x: number;
  y: number;
  z: number;
  value: number;
  label: string;
}

function HolographicBar({ position, height, color, delay }: {
  position: [number, number, number];
  height: number;
  color: string;
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.scale.y = height + Math.sin(time * 2 + delay) * 0.1;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.2 + Math.sin(time * 3 + delay) * 0.1;
      }
    }
  });

  const colorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    red: '#ef4444',
    yellow: '#f59e0b'
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? [1.1, height, 1.1] : [1, height, 1]}
    >
      <boxGeometry args={[0.3, 1, 0.3]} />
      <meshStandardMaterial
        color={colorMap[color as keyof typeof colorMap] || '#3b82f6'}
        transparent
        opacity={0.8}
        emissive={colorMap[color as keyof typeof colorMap] || '#3b82f6'}
        emissiveIntensity={hovered ? 0.4 : 0.2}
      />
    </mesh>
  );
}

function DataConnection({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: '#8b5cf6', transparent: true, opacity: 0.6 }))} />
  );
}

function HolographicScene({ data }: { data: DataPoint[] }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      
      {data.map((point, index) => (
        <HolographicBar
          key={index}
          position={[point.x, point.y, point.z]}
          height={point.value}
          color={point.value > 0.7 ? 'green' : point.value > 0.4 ? 'blue' : 'red'}
          delay={index * 0.5}
        />
      ))}
      
      {/* Neural Network Connections */}
      {data.map((point, index) => {
        if (index < data.length - 1) {
          return (
            <DataConnection
              key={`connection-${index}`}
              start={[point.x, point.y + point.value / 2, point.z]}
              end={[data[index + 1].x, data[index + 1].y + data[index + 1].value / 2, data[index + 1].z]}
            />
          );
        }
        return null;
      })}
    </>
  );
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
            Real-time 3D
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

        {/* 3D Chart */}
        <div className="h-80 rounded-xl overflow-hidden bg-gradient-to-b from-transparent to-purple-900/20 border border-purple-500/30">
          <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
            <HolographicScene data={performanceData} />
          </Canvas>
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

        {/* Neural Network Visualization */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-purple-300" />
            <span className="text-sm font-medium text-white">AI Pattern Recognition</span>
          </div>
          <div className="text-xs text-gray-300 leading-relaxed">
            Neural networks detected optimal performance correlation between index efficiency and cache hit rates. 
            Recommended optimization strategy: Implement adaptive indexing with 94% confidence.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
