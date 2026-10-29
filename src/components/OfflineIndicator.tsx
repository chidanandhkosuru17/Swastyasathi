import React from 'react';
import { WifiOff, Plane } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
  isSimulatingOffline: boolean;
  onExitSimulation: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  isSimulatingOffline,
  onExitSimulation
}) => {
  if (isOnline) return null;

  return (
    <aside aria-label="Offline Mode Status Banner" className="fixed bottom-4 left-4 z-40 flex items-center gap-2.5 rounded-xl bg-amber-500/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400">
      <span className="flex h-2.5 w-2.5 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>

      {isSimulatingOffline ? (
        <div className="flex items-center gap-2">
          <Plane className="w-3.5 h-3.5" />
          <span>Airplane Mode Simulation Active — 100% Offline</span>
          <button
            onClick={onExitSimulation}
            className="ml-2 underline text-[11px] font-bold hover:text-amber-100"
          >
            Turn Off
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Zero Network — Operating from Local Device Cache</span>
        </div>
      )}
    </aside>
  );
};
