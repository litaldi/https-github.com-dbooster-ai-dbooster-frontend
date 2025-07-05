
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { productionInitializer } from '@/utils/productionInit';
import { IntelligentPreloader } from '@/utils/lazyLoader';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Initialize production environment if needed
if (import.meta.env.PROD) {
  productionInitializer.initialize();
}

// Initialize performance monitoring
performanceMonitor.initialize();

// Initialize intelligent preloading
const preloader = IntelligentPreloader.getInstance();
preloader.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
