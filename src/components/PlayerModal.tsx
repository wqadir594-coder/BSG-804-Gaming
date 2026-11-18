import React, { useEffect } from 'react';
import { Award, Cpu, Shield, X } from 'lucide-react';
import type { Player } from '../data/bsgData';

interface PlayerModalProps {
  player: Player | null;
  onClose: () => void;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ player, onClose }) => {
  useEffect(() => {
    if (!player) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, onClose]);

  if (!player) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-zinc-800 bg-[#111115] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-xs font-medium text-amber-400">
              {player.divisionName} · {player.nationality}
            </p>
            <h3
              id="player-modal-title"
              className="mt-1 font-display text-3xl font-bold tracking-tight text-white"
            >
              {player.handle}
            </h3>
            <p className="text-sm text-zinc-400">
              {player.fullName} · {player.role}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close player dossier"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-zinc-300">{player.bio}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 border-y border-zinc-800 py-4">
          <div>
            <div className="text-xs text-zinc-400">Rating</div>
            <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-white">
              {player.rating}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">K/D Ratio</div>
            <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-white">
              {player.kdRatio}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-400">Map Win %</div>
            <div className="mt-1 font-mono text-xl font-semibold tabular-nums text-amber-400">
              {player.winRate}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
            <div>
              <span className="text-zinc-400">Signature Loadout: </span>
              <span className="font-medium text-zinc-100">{player.signatureWeaponOrMain}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <div>
              <span className="text-zinc-400">Hardware Setup: </span>
              <span className="font-medium text-zinc-100">{player.hardwareSetup}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <div>
              <span className="text-zinc-400">Recent Honor: </span>
              <span className="font-medium text-zinc-100">{player.recentAchievement}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] w-full sm:w-auto rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
