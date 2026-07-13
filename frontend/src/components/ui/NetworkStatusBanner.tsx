import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, X, AlertCircle } from 'lucide-react';

export const NetworkStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Active ping function to test backend liveness
  const checkBackendHealth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout limit
      
      const res = await fetch('http://localhost:5000/health', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);
      
      if (res.status === 200) {
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
      }
    } catch (err) {
      setIsBackendConnected(false);
    }
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    await checkBackendHealth();
    setIsChecking(false);
    if (window.navigator.onLine && isBackendConnected) {
      setDismissed(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkBackendHealth();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsBackendConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkBackendHealth();

    // Periodic polling check every 30 seconds
    const intervalId = setInterval(() => {
      if (window.navigator.onLine) {
        checkBackendHealth();
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [checkBackendHealth]);

  const showBanner = (!isOnline || !isBackendConnected) && !dismissed;

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-rose-500/90 dark:bg-rose-950/95 backdrop-blur-md border border-rose-400 dark:border-rose-900 text-white rounded-xl shadow-2xl p-3.5 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-rose-600/30 rounded-lg shrink-0">
            {!isOnline ? (
              <WifiOff className="h-4.5 w-4.5 animate-pulse text-rose-100" />
            ) : (
              <AlertCircle className="h-4.5 w-4.5 animate-bounce text-rose-100" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold leading-tight">
              {!isOnline ? 'Network Disconnected' : 'Server Unreachable'}
            </span>
            <span className="text-[11px] text-rose-100 leading-normal">
              {!isOnline 
                ? 'Your device appears to be offline. Check your connection.' 
                : 'Lost connection to ExpenseIQ API servers.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRetry}
            disabled={isChecking}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors disabled:opacity-50 select-none cursor-pointer border border-white/5 active:scale-95 duration-100"
          >
            <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Retry'}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1.5 hover:bg-white/10 rounded-lg text-rose-100 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default NetworkStatusBanner;
