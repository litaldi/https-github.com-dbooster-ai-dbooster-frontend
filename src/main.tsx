
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { productionInitializer } from '@/utils/productionInit';

// Initialize production environment if needed
if (import.meta.env.PROD) {
  productionInitializer.initialize();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
