
import { useEffect, useState } from 'react';
import { serviceWorkerManager } from '@/utils/serviceWorker';

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Register service worker
    const registerSW = async () => {
      const reg = await serviceWorkerManager.register();
      setRegistration(reg);
    };

    registerSW();

    // Listen for update notifications
    const handleUpdate = () => setUpdateAvailable(true);
    window.addEventListener('sw-update-available', handleUpdate);

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdate);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateApp = async () => {
    await serviceWorkerManager.updateServiceWorker();
    setUpdateAvailable(false);
  };

  return {
    registration,
    updateAvailable,
    isOnline,
    updateApp
  };
}
