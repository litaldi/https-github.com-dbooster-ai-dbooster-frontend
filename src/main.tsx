
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { comprehensiveSecurityInit } from './utils/comprehensiveSecurityInit';
import { enhancedProductionLogger } from './utils/enhancedProductionLogger';

// Initialize comprehensive security system
comprehensiveSecurityInit.initialize().catch(error => {
  enhancedProductionLogger.error('Failed to initialize security system', error, 'MainInit');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
