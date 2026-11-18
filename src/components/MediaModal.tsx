import React, { useEffect, useState } from 'react';
import { Shield, X } from 'lucide-react';
import type { MediaHighlight } from '../data/bsgData';

interface MediaModalProps {
  item: MediaHighlight | null;
  onClose: () => void;
}

export const MediaModal: React.FC<MediaModalProps> = ({ item, onClose }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl overflow-hidden rounded-t-2xl sm:rounded-2xl border border-zinc-800 bg-[#111115] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full bg-zinc-900">
          {!imgError ? (
            <img
              src={item.image}
              alt={item.alt}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-red-950/30 to-zinc-900 p-6 text-center">
              <Shield className="h-10 w-10 text-amber-400" aria-hidden="true" />
              <p className="mt-2 font-display text-xl font-bold text-white">{item.title}</p>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close spotlight"
            className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-black/75 text-white backdrop-blur-sm transition-colors hover:bg-red-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs font-medium text-amber-400">
            {item.category} · {item.date}
          </p>
          <h3
            id="media-modal-title"
            className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300">{item.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-zinc-800 pt-4 text-xs text-zinc-400">
            {item.specs.map((spec, idx) => (
              <React.Fragment key={spec}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <span>{spec}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
