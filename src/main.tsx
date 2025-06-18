
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupGlobalErrorHandling } from './utils/errorHandling'
import { monitoringService } from './services/monitoringService'
import { initializeProductionEnvironment } from './utils/productionCleanup'

// Initialize production environment cleanup
initializeProductionEnvironment();

// Set up global error handling
setupGlobalErrorHandling();

// Initialize monitoring service
monitoringService;

// Performance monitoring setup
if (typeof window !== 'undefined') {
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

  // Preload critical resources
  const preloadCriticalResources = () => {
    // Preload critical CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'preload';
    cssLink.href = '/src/index.css';
    cssLink.as = 'style';
    document.head.appendChild(cssLink);
  };

  // Run preloading
  preloadCriticalResources();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
