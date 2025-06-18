
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-popover'
          ],
          'animation-vendor': ['framer-motion'],
          'chart-vendor': ['recharts'],
          'query-vendor': ['@tanstack/react-query'],
          'routing-vendor': ['react-router-dom'],
          'utils': ['clsx', 'tailwind-merge', 'date-fns', 'zod'],
          'ai-features': [
            // Lazy load AI components
            './src/components/ai/SmartQueryAnalyzer',
            './src/components/ai/AIQueryGenerator',
            './src/components/ai/PerformanceBenchmarker'
          ]
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
    sourcemap: mode === 'development',
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500, // Reduced for better performance
    assetsInlineLimit: 4096, // Inline small assets
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@tanstack/react-query'
    ],
    exclude: [
      // Exclude heavy dependencies from pre-bundling
      'web-vitals',
      '@huggingface/transformers'
    ]
  },
  // Enable experimental features for better performance
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    target: 'esnext',
    platform: 'browser',
  }
}));
