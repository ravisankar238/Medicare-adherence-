import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWAInstall();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-600 text-white px-4 py-2.5 text-xs font-bold shadow-xl border border-amber-400 animate-in fade-in slide-in-from-bottom-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
      </span>
      <div className="flex items-center gap-1.5">
        <WifiOff className="w-4 h-4" />
        <span>Offline Mode Active</span>
      </div>
      <span className="text-amber-100 font-normal text-[11px] hidden sm:inline">
        • Local cached medicine alarms &amp; records active
      </span>
    </div>
  );
};
