import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-16 md:bottom-5 left-4 right-4 sm:right-auto z-40 flex items-center justify-between sm:justify-start gap-3 rounded-xl border border-amber-500/40 bg-[#141418]/95 px-4 py-2.5 text-xs font-medium text-amber-200 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center gap-2.5">
        <WifiOff className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
        <span>Offline Mode · Viewing cached BSG 804 data</span>
      </div>
      <a
        href="/offline.html"
        className="shrink-0 font-semibold text-amber-400 underline underline-offset-2 hover:text-amber-300"
      >
        Offline Page
      </a>
    </div>
  );
};
