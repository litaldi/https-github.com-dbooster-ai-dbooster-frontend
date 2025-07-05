
import React from 'react';
import { motion } from 'framer-motion';

const querySnippets = [
  "SELECT * FROM users WHERE active = true",
  "OPTIMIZE TABLE performance_logs",
  "CREATE INDEX idx_created_at ON orders",
  "ANALYZE TABLE user_sessions",
  "SELECT COUNT(*) FROM transactions"
];

export function FloatingQuerySnippets() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
      {querySnippets.map((query, index) => (
        <motion.div
          key={index}
          className="absolute text-xs font-mono text-primary"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0 
          }}
          animate={{
            x: [null, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: index * 3
          }}
        >
          {query}
        </motion.div>
      ))}
    </div>
  );
}
