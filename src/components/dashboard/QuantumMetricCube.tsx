
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Sphere } from '@react-three/drei';
import { LucideIcon } from 'lucide-react';
import * as THREE from 'three';

interface QuantumMetricCubeProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  trend?: number[];
}

function FloatingCube({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });

  const colorMap = {
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    emerald: '#059669'
  };

  return (
    <Box
      ref={meshRef}
      position={position}
      scale={hovered ? scale * 1.2 : scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={colorMap[color as keyof typeof colorMap] || '#3b82f6'}
        transparent
        opacity={0.8}
        emissive={colorMap[color as keyof typeof colorMap] || '#3b82f6'}
        emissiveIntensity={hovered ? 0.3 : 0.1}
      />
    </Box>
  );
}

function ParticleField() {
  const count = 100;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      for (let i = 0; i < count; i++) {
        const matrix = new THREE.Matrix4();
        const x = (Math.random() - 0.5) * 10;
        const y = (Math.random() - 0.5) * 10;
        const z = (Math.random() - 0.5) * 10;
        matrix.setPosition(x, y + Math.sin(time + i) * 0.1, z);
        meshRef.current.setMatrixAt(i, matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </instancedMesh>
  );
}

function Scene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <FloatingCube position={[0, 0, 0]} color={color} scale={0.8} />
      <ParticleField />
    </>
  );
}

export function QuantumMetricCube({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  trend = []
}: QuantumMetricCubeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-purple-500/30"
      whileHover={{ scale: 1.02, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* 3D Canvas Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
          <Scene color={color} />
        </Canvas>
      </div>

      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/10" />

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <motion.div
            className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
            animate={{
              boxShadow: isHovered 
                ? `0 0 30px ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#8b5cf6'}40`
                : '0 0 10px rgba(255,255,255,0.1)'
            }}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
          
          <motion.div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              changeType === 'positive' 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}
            animate={{ scale: isHovered ? 1.1 : 1 }}
          >
            {change}
          </motion.div>
        </div>

        <div className="space-y-2">
          <h3 className="text-white/80 text-sm font-medium tracking-wide">
            {title}
          </h3>
          <motion.div
            className="text-3xl font-bold text-white"
            animate={{ 
              textShadow: isHovered 
                ? `0 0 20px ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#8b5cf6'}`
                : '0 0 5px rgba(255,255,255,0.3)'
            }}
          >
            {value}
          </motion.div>
        </div>

        {/* Neural Network Visualization */}
        {trend.length > 0 && (
          <div className="mt-4">
            <div className="flex items-end space-x-1 h-12">
              {trend.slice(-8).map((point, index) => (
                <motion.div
                  key={index}
                  className="w-3 bg-gradient-to-t from-white/30 to-white/60 rounded-t-sm"
                  style={{ height: `${Math.max(20, (point / Math.max(...trend)) * 100)}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(20, (point / Math.max(...trend)) * 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Holographic Grid Lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>
    </motion.div>
  );
}
