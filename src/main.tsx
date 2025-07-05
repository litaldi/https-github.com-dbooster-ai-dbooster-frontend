
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';

// Initialize unified security service
if (import.meta.env.PROD) {
  unifiedSecurityService.initializeSecurityHeaders();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
