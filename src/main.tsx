
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupGlobalErrorHandling } from './utils/errorHandling'
import { monitoringService } from './services/monitoringService'
import { initializeProductionEnvironment } from './utils/productionCleanup'
import { ResourcePreloader } from './utils/resourcePreloader'
import { BundleAnalyzer } from './utils/bundleAnalyzer'

// Initialize production environment cleanup
initializeProductionEnvironment();

// Set up global error handling
setupGlobalErrorHandling();

// Initialize monitoring service
monitoringService;

// Performance optimization setup
if (typeof window !== 'undefined') {
  // Preload critical resources immediately
  ResourcePreloader.preloadCriticalAssets();

  // Bundle analysis in development
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      BundleAnalyzer.analyzeChunks();
      BundleAnalyzer.measureLoadTimes();
      
      const memory = BundleAnalyzer.getMemoryUsage();
      if (memory) {
        console.log(`💾 Memory Usage: ${memory.used}MB / ${memory.total}MB (Limit: ${memory.limit}MB)`);
      }
    }, 1000);
  }

  // Register service worker for caching
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('SW registered: ', registration);
          }
        })
        .catch((registrationError) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('SW registration failed: ', registrationError);
          }
        });
    });
  }

  // Enhanced resource hints for better performance
  const addResourceHints = () => {
    // DNS prefetch for external domains
    const domains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.google-analytics.com',
      'vitals.vercel-analytics.com'
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Prefetch likely next pages
    const likelyPages = ['/dashboard', '/repositories', '/queries'];
    likelyPages.forEach(page => {
      ResourcePreloader.prefetchRoute(page);
    });
  };

  // Run resource hints after initial load
  addResourceHints();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
