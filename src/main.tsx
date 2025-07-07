
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';
import { productionConsole } from '@/utils/productionConsoleCleanup';

// Initialize security systems
if (import.meta.env.PROD) {
  // Initialize unified security service
  unifiedSecurityService.initializeSecurityHeaders();
  
  // Clean up console logging in production
  productionConsole.initializeConsoleCleanup();
}

// Development-only security validation
if (import.meta.env.DEV) {
  // Enable development console
  productionConsole.enableDevConsole();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
