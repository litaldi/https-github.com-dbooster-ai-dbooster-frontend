
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from '@/components/ui/error-boundary.tsx'
import { initializeProductionEnvironment } from '@/utils/productionCleanup';
import { SecurityHeaders } from '@/middleware/securityHeaders';
import { setupGlobalErrorHandling } from '@/utils/errorRecovery';

// Initialize production environment and security
initializeProductionEnvironment();
SecurityHeaders.applyToDocument();
setupGlobalErrorHandling();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
