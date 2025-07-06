
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSystem({ count = 2000 }: { count?: number }) {
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      
      // Colors
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      meshRef.current.rotation.y = Math.sin(time * 0.15) * 0.1;
    }
  });

  return (
    <Points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </Points>
  );
}

function NeuralConnections() {
  const linesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      const time = state.clock.elapsedTime;
      linesRef.current.children.forEach((line, index) => {
        if (line instanceof THREE.Line) {
          const material = line.material as THREE.LineBasicMaterial;
          material.opacity = 0.3 + Math.sin(time * 2 + index) * 0.2;
        }
      });
    }
  });

  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 50; i++) {
      const points = [
        new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 15
        )
      ];
      lines.push(points);
    }
    return lines;
  }, []);

  return (
    <group ref={linesRef}>
      {connections.map((points, index) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
          </line>
        );
      })}
    </group>
  );
}

export function ParticleField() {
  return (
    <div className="fixed inset-0 -z-10 opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ParticleSystem count={1500} />
        <NeuralConnections />
      </Canvas>
    </div>
  );
}
