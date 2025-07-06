
import React from 'react';
import { motion } from 'framer-motion';

export function ParticleField() {
  return (
    <div className="fixed inset-0 -z-10 opacity-40 overflow-hidden">
      {/* CSS-based particle field instead of Three.js */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}
