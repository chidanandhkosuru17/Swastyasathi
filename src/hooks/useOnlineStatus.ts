import { useEffect, useState } from 'react';

const SIMULATE_OFFLINE_KEY = 'swasthya_simulate_offline';

export function useOnlineStatus() {
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [simulateOffline, setSimulateOffline] = useState<boolean>(() => {
    return localStorage.getItem(SIMULATE_OFFLINE_KEY) === 'true';
  });

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulateOffline = () => {
    const nextVal = !simulateOffline;
    setSimulateOffline(nextVal);
    localStorage.setItem(SIMULATE_OFFLINE_KEY, nextVal ? 'true' : 'false');
  };

  const isEffectiveOnline = browserOnline && !simulateOffline;

  return {
    isOnline: isEffectiveOnline,
    browserOnline,
    isSimulatingOffline: simulateOffline,
    toggleSimulateOffline
  };
}
