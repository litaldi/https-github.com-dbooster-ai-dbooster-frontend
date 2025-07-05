
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          vendor: ['react', 'react-dom'],
          
          // UI framework
          ui: [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-slot', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast'
          ],
          
          // Authentication & Backend
          auth: ['@supabase/supabase-js'],
          
          // Charts and visualization
          charts: ['recharts'],
          
          // State management
          query: ['@tanstack/react-query'],
          
          // Animations
          animations: ['framer-motion'],
          
          // AI/ML (lazy loaded)
          ai: ['@huggingface/transformers'],
          
          // Utilities
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        },
      },
    },
    chunkSizeWarningLimit: 500, // Reduced from 1000 for better performance
    reportCompressedSize: false,
    sourcemap: mode === 'development',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@tanstack/react-query'
    ],
    exclude: [
      '@huggingface/transformers' // Exclude heavy AI library from eager optimization
    ]
  },
}));
