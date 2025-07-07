
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';
import { productionConsole } from '@/utils/productionConsoleCleanup';
import { securityValidator } from '@/utils/securityValidator';

// Initialize security systems
if (import.meta.env.PROD) {
  // Initialize unified security service
  unifiedSecurityService.initializeSecurityHeaders();
  
  // Clean up console logging in production
  productionConsole.initializeConsoleCleanup();
  
  // Optional: Complete console lockdown for maximum security
  // productionConsole.lockdownConsole();
}

// Development-only security validation
if (import.meta.env.DEV) {
  // Enable development console
  productionConsole.enableDevConsole();
  
  // Run security validation on key files (non-blocking)
  setTimeout(() => {
    // This would be expanded to scan actual project files in a real implementation
    const criticalFiles = [
      { path: 'src/contexts/auth-context.tsx', content: '' },
      { path: 'src/pages/Login.tsx', content: '' }
    ];
    
    securityValidator.scanProject(criticalFiles);
  }, 5000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
