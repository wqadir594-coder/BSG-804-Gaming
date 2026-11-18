import React, { useEffect, useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  fallbackHref?: string;
  fallbackLabel?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  fallbackHref = '#tryouts',
  fallbackLabel = 'Apply Now',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    if (!showGuideModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowGuideModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showGuideModal]);

  // Suppress install prompt when already running in standalone / TWA mode
  if (isInstalled) {
    return (
      <a
        href={fallbackHref}
        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        {fallbackLabel}
      </a>
    );
  }

  const handleAction = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        return;
      }
      return;
    }
    setShowGuideModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAction}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>Install App</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 p-0 sm:p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-title"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-zinc-800 bg-[#111115] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="BSG 804 Gaming icon"
                  className="h-12 w-12 rounded-xl border border-zinc-800 object-cover"
                />
                <div>
                  <h3
                    id="pwa-install-title"
                    className="font-display text-2xl font-bold tracking-tight text-white"
                  >
                    Install BSG 804 Gaming
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Standalone App · Offline Access · Instant Launch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="Close install instructions"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm text-zinc-300">
              {isIOS ? (
                <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="font-medium text-white">Install on iPhone or iPad (Safari)</p>
                  <ol className="space-y-2 text-xs leading-relaxed text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-semibold text-amber-400">1.</span>
                      <span>
                        Tap the <strong className="text-white inline-flex items-center gap-1">Share <Share className="inline h-3.5 w-3.5" /></strong> button in the Safari toolbar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-semibold text-amber-400">2.</span>
                      <span>
                        Scroll down and select <strong className="text-white">Add to Home Screen</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-semibold text-amber-400">3.</span>
                      <span>
                        Tap <strong className="text-white">Add</strong> to launch BSG 804 in full standalone mode.
                      </span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <p className="flex items-center gap-2 font-medium text-white">
                    <Smartphone className="h-4 w-4 text-red-500" aria-hidden="true" />
                    Add to Android or Desktop Home Screen
                  </p>
                  <ol className="space-y-2 text-xs leading-relaxed text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-semibold text-amber-400">1.</span>
                      <span>
                        On <strong className="text-white">Android Chrome</strong>, open the browser menu (<strong className="text-white">⋮</strong>) and tap <strong className="text-white">Install app</strong> or <strong className="text-white">Add to Home screen</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-semibold text-amber-400">2.</span>
                      <span>
                        On <strong className="text-white">Desktop Chrome / Edge</strong>, click the install icon in the right side of the address bar.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-mono font-semibold text-amber-400">3.</span>
                      <span>
                        Note: If viewing inside an embedded preview frame, open the site directly in its own HTTPS browser tab to trigger the native install banner.
                      </span>
                    </li>
                  </ol>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="min-h-[44px] w-full rounded-lg bg-zinc-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
