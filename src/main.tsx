
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from '@/components/ui/error-boundary.tsx'
import { productionInitializer } from '@/utils/productionInit';

// Initialize production environment immediately
productionInitializer.initialize();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// Run health checks after app loads (production only)
if (import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      const healthChecks = await productionInitializer.runHealthChecks();
      console.log('Health checks completed:', healthChecks);
    } catch (error) {
      console.error('Health checks failed:', error);
    }
  });
}
