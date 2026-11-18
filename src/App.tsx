import React, { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  BellRing,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Home,
  RefreshCw,
  Shield,
  Swords,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import {
  DIVISIONS,
  HERO_MEDIA,
  MATCHES,
  MEDIA_HIGHLIGHTS,
  PLAYERS,
  TROPHIES,
  type DivisionId,
  type MediaHighlight,
  type Player,
} from './data/bsgData';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PlayerModal } from './components/PlayerModal';
import { MediaModal } from './components/MediaModal';

interface TryoutSubmission {
  id: string;
  requestType: 'academy' | 'scrim';
  handle: string;
  email: string;
  division: string;
  rank: string;
  notes: string;
  submittedAt: string;
}

const STORAGE_REMINDERS_KEY = 'bsg804_match_reminders_v1';
const STORAGE_SUBMISSIONS_KEY = 'bsg804_tryout_submissions_v1';

function readStoredArray<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [selectedDivision, setSelectedDivision] = useState<DivisionId>('all');
  const [scheduleTab, setScheduleTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [matchDivisionFilter, setMatchDivisionFilter] = useState<DivisionId>('all');
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [activeMedia, setActiveMedia] = useState<MediaHighlight | null>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [failedMediaIds, setFailedMediaIds] = useState<Record<string, boolean>>({});
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const [reminders, setReminders] = useState<string[]>(() =>
    readStoredArray<string>(STORAGE_REMINDERS_KEY)
  );
  const [submissions, setSubmissions] = useState<TryoutSubmission[]>(() =>
    readStoredArray<TryoutSubmission>(STORAGE_SUBMISSIONS_KEY)
  );

  // Tryouts / Scrim Form State
  const [requestType, setRequestType] = useState<'academy' | 'scrim'>('academy');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [divisionInput, setDivisionInput] = useState('Valorant');
  const [rankInput, setRankInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    const onUpdate = () => setUpdateAvailable(true);
    window.addEventListener('bsg-sw-update-available', onUpdate);
    return () => window.removeEventListener('bsg-sw-update-available', onUpdate);
  }, []);

  const filteredPlayers = useMemo(() => {
    if (selectedDivision === 'all') return PLAYERS;
    return PLAYERS.filter((p) => p.division === selectedDivision);
  }, [selectedDivision]);

  const filteredMatches = useMemo(() => {
    return MATCHES.filter((m) => {
      if (m.status !== scheduleTab) return false;
      if (matchDivisionFilter !== 'all' && m.division !== matchDivisionFilter) return false;
      return true;
    });
  }, [scheduleTab, matchDivisionFilter]);

  const toggleReminder = (matchId: string) => {
    setReminders((prev) => {
      const next = prev.includes(matchId)
        ? prev.filter((id) => id !== matchId)
        : [...prev, matchId];
      try {
        window.localStorage.setItem(STORAGE_REMINDERS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const trimmedHandle = handle.trim();
    const trimmedEmail = email.trim();
    const trimmedRank = rankInput.trim();

    if (trimmedHandle.length < 2) {
      setFormError('Enter your player handle, Discord tag, or team name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFormError('Enter a valid email address for scheduling confirmation.');
      return;
    }

    if (trimmedRank.length < 2) {
      setFormError(
        requestType === 'academy'
          ? 'Specify your current competitive rank or tournament experience.'
          : 'Specify your team tier or target scrim server region.'
      );
      return;
    }

    const newEntry: TryoutSubmission = {
      id: `sub-${Date.now()}`,
      requestType,
      handle: trimmedHandle,
      email: trimmedEmail,
      division: divisionInput,
      rank: trimmedRank,
      notes: notesInput.trim(),
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const nextSubmissions = [newEntry, ...submissions].slice(0, 5);
    setSubmissions(nextSubmissions);
    try {
      window.localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(nextSubmissions));
    } catch {
      // Ignore storage quota errors
    }

    setHandle('');
    setEmail('');
    setRankInput('');
    setNotesInput('');
    setFormSuccess(
      requestType === 'academy'
        ? 'Tryout application saved. Our coaching staff reviews submissions every Tuesday and Friday.'
        : 'Scrim request logged. Our team manager will confirm map pool and server block via email.'
    );
  };

  const handleDeleteSubmission = (id: string) => {
    const next = submissions.filter((item) => item.id !== id);
    setSubmissions(next);
    try {
      window.localStorage.setItem(STORAGE_SUBMISSIONS_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#09090B] text-zinc-50 pb-20 md:pb-0">
      {/* Top Bar Contract: 3 Zones (Brand | 5 Nav Links | 1 Primary CTA) */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#09090B]/90 backdrop-blur-md pt-safe">
        <div className="mx-auto flex h-12 md:h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark + Crest */}
          <a
            href="#top"
            className="flex items-center gap-2.5 text-lg font-display font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
          >
            <img
              src="/icon.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-md shrink-0"
            />
            <span>BSG 804 Gaming</span>
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400"
          >
            <a
              href="#rosters"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Rosters
            </a>
            <a
              href="#matches"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Matches
            </a>
            <a
              href="#tournaments"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Tournaments
            </a>
            <a
              href="#facility"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Facility
            </a>
            <a
              href="#tryouts"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Tryouts
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action (PWA Install button, auto-hides in standalone mode) */}
          <div className="flex items-center shrink-0">
            <PWAInstallButton fallbackHref="#tryouts" fallbackLabel="Apply Now" />
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative border-b border-zinc-800/80">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="flex flex-col justify-center lg:col-span-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Competitive Esports Organization · Est. 804
                </p>
                <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.03] [text-wrap:balance]">
                  Precision, Discipline, Championship Caliber.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">
                  BSG 804 Gaming fields championship rosters across Valorant, Counter-Strike 2,
                  Apex Legends, and Street Fighter 6—backed by dedicated analytical coaching, LAN
                  bootcamp infrastructure, and a structured academy pipeline.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#tryouts"
                    className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    Apply for Tryouts
                  </a>
                  <a
                    href="#rosters"
                    className="inline-flex min-h-[46px] items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-[#141418] px-5 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:text-white whitespace-nowrap shrink-0"
                  >
                    <span>Explore Pro Rosters</span>
                    <ChevronRight className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative aspect-video lg:aspect-auto lg:h-full min-h-[240px] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#111115]">
                  {!heroImgFailed ? (
                    <img
                      src={HERO_MEDIA.image}
                      alt={HERO_MEDIA.alt}
                      referrerPolicy="no-referrer"
                      decoding="async"
                      onError={() => setHeroImgFailed(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-red-950/35 to-zinc-900 p-8 text-center">
                      <Shield className="h-14 w-14 text-amber-400" aria-hidden="true" />
                      <p className="mt-3 font-display text-2xl font-bold text-white">
                        BSG 804 Championship Stage
                      </p>
                    </div>
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/90 via-[#09090B]/20 to-transparent"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-300">
                    <span className="font-medium text-white">Main Stage Lineup · 2026 Season</span>
                    <span className="font-mono text-amber-400">Valorant · CS2 · Apex · SF6</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Championship Metrics Strip below Hero Split */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-8 lg:grid-cols-4 lg:gap-8">
              <div className="rounded-xl border border-zinc-800/80 bg-[#111115] p-5">
                <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-white">
                  14
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-200">
                  Regional & LAN Titles
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">Sanctioned Wins · 2022–2026</div>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-[#111115] p-5">
                <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-amber-400">
                  68.4%
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-200">Official Match Win Rate</div>
                <div className="mt-0.5 text-xs text-zinc-400">Rolling 12-Month Record</div>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-[#111115] p-5">
                <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-white">
                  4
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-200">Active Pro Divisions</div>
                <div className="mt-0.5 text-xs text-zinc-400">Valorant · CS2 · Apex · SF6</div>
              </div>
              <div className="rounded-xl border border-zinc-800/80 bg-[#111115] p-5">
                <div className="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-red-500">
                  $240K+
                </div>
                <div className="mt-1 text-sm font-medium text-zinc-200">Career Prize Earnings</div>
                <div className="mt-0.5 text-xs text-zinc-400">Verified LAN & Major Finals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pro Rosters Section */}
        <section id="rosters" className="scroll-mt-16 border-b border-zinc-800/80">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                  01. Active Squads
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                  Pro Rosters & Starting Lineups
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                  Select a competitive division to inspect active starters, seasonal ratings, and
                  tournament hardware setups.
                </p>
              </div>

              {/* Interactive Filter Controls */}
              <div
                role="tablist"
                aria-label="Filter roster by division"
                className="flex items-center gap-1 overflow-x-auto rounded-xl border border-zinc-800 bg-[#111115] p-1"
              >
                {DIVISIONS.map((div) => {
                  const active = selectedDivision === div.id;
                  return (
                    <button
                      key={div.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedDivision(div.id)}
                      className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-white'
                      }`}
                    >
                      {div.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => setActivePlayer(player)}
                  className="group flex flex-col justify-between rounded-2xl border border-zinc-800 bg-[#111115] p-6 text-left transition-colors hover:border-amber-500/50 hover:bg-[#15151a] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                      <span className="font-medium text-amber-400">
                        {player.divisionName} · {player.nationality}
                      </span>
                      <span className="font-mono tabular-nums text-zinc-300">
                        {player.rating} RTG
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                      {player.handle}
                    </h3>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      {player.fullName} · {player.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300 line-clamp-2">
                      {player.bio}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs">
                    <span className="font-mono tabular-nums text-zinc-400">
                      {player.kdRatio} K/D · {player.winRate} Win
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-red-400 group-hover:text-red-300">
                      View Dossier
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Match Center & Tournament Proof (Claim-to-Proof Adjacency) */}
        <section id="matches" className="scroll-mt-16 border-b border-zinc-800/80">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Left 7 Columns: Interactive Match Center */}
              <div className="lg:col-span-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                      02. Match Center
                    </p>
                    <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      Schedule & Official Results
                    </h2>
                  </div>

                  <div className="flex items-center gap-1 self-start rounded-xl border border-zinc-800 bg-[#111115] p-1">
                    <button
                      type="button"
                      onClick={() => setScheduleTab('upcoming')}
                      className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        scheduleTab === 'upcoming'
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Upcoming
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleTab('completed')}
                      className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        scheduleTab === 'completed'
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Recent Results
                    </button>
                  </div>
                </div>

                {/* Secondary Division Filter */}
                <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
                  {DIVISIONS.map((div) => (
                    <button
                      key={div.id}
                      type="button"
                      onClick={() => setMatchDivisionFilter(div.id)}
                      className={`min-h-[38px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        matchDivisionFilter === div.id
                          ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                          : 'border-zinc-800 bg-[#111115] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {div.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 divide-y divide-zinc-800/80 rounded-2xl border border-zinc-800 bg-[#111115]">
                  {filteredMatches.length === 0 ? (
                    <div className="p-8 text-center text-sm text-zinc-400">
                      No {scheduleTab} matches scheduled for this division right now.
                    </div>
                  ) : (
                    filteredMatches.map((match) => {
                      const hasReminder = reminders.includes(match.id);
                      return (
                        <div
                          key={match.id}
                          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                              <span className="font-medium text-amber-400">
                                {match.divisionName}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{match.tournament}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono">{match.format}</span>
                            </div>

                            <div className="mt-2 flex items-center gap-3">
                              <span className="font-display text-xl font-bold text-white">
                                BSG 804 vs {match.opponent}
                              </span>
                              {match.status === 'completed' && (
                                <span className="font-mono text-sm font-semibold tabular-nums text-amber-400">
                                  {match.bsgScore}–{match.opponentScore} {match.result}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-zinc-400">
                              {match.mapSummary}
                              {match.mvp ? ` · MVP: ${match.mvp}` : ''}
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center shrink-0">
                            <div className="text-left sm:text-right">
                              <div className="font-mono text-xs font-medium tabular-nums text-zinc-200">
                                {match.dateLabel}
                              </div>
                              <div className="font-mono text-xs tabular-nums text-zinc-400">
                                {match.timeUtc}
                              </div>
                            </div>

                            {match.status === 'upcoming' && (
                              <button
                                type="button"
                                onClick={() => toggleReminder(match.id)}
                                aria-pressed={hasReminder}
                                className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                  hasReminder
                                    ? 'border-amber-500/60 bg-amber-500/15 text-amber-300'
                                    : 'border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:text-white'
                                }`}
                              >
                                {hasReminder ? (
                                  <>
                                    <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>Reminder Set</span>
                                  </>
                                ) : (
                                  <>
                                    <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                                    <span>Remind Me</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right 5 Columns: Tournament Championships & Proof */}
              <div id="tournaments" className="scroll-mt-16 lg:col-span-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  03. Championship Proof
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Recent Trophy Runs
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Verified LAN tournament finishes backed by round-by-round preparation.
                </p>

                <div className="mt-5 space-y-4">
                  {TROPHIES.map((trophy) => (
                    <article
                      key={trophy.id}
                      className="rounded-2xl border border-zinc-800 bg-[#111115] p-6"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                        <span className="font-medium text-amber-400">
                          {trophy.placement} · {trophy.division}
                        </span>
                        <span className="font-mono tabular-nums text-zinc-300">
                          {trophy.prizePool}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-bold text-white">
                        {trophy.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                        {trophy.summary}
                      </p>
                      <div className="mt-4 flex items-center gap-2 border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
                        <Trophy className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                        <span>{trophy.date} · Official Sanctioned Event</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facility, Apparel & Media Bento Grid */}
        <section id="facility" className="scroll-mt-16 border-b border-zinc-800/80">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                04. Infrastructure & Identity
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                Bootcamp Facility, Pro Kit & Archive
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Built around our black, crimson, and gold competitive standard. Click any feature to
                inspect specifications.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-12">
              {MEDIA_HIGHLIGHTS.map((item, idx) => {
                const spanClass =
                  idx === 0
                    ? 'md:col-span-6'
                    : idx === 1
                    ? 'md:col-span-6'
                    : 'md:col-span-12';
                const aspectClass = idx === 2 ? 'aspect-[16/7]' : 'aspect-[4/3]';
                const failed = !!failedMediaIds[item.id];

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveMedia(item)}
                    className={`group overflow-hidden rounded-2xl border border-zinc-800 bg-[#111115] text-left transition-colors hover:border-amber-500/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${spanClass}`}
                  >
                    <div className={`relative w-full overflow-hidden bg-zinc-900 ${aspectClass}`}>
                      {!failed ? (
                        <img
                          src={item.image}
                          alt={item.alt}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedMediaIds((prev) => ({ ...prev, [item.id]: true }))
                          }
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-red-950/30 to-zinc-900 p-6 text-center">
                          <Shield className="h-10 w-10 text-amber-400" aria-hidden="true" />
                          <span className="mt-2 font-display text-xl font-bold text-white">
                            {item.title}
                          </span>
                        </div>
                      )}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B]/90 via-[#09090B]/20 to-transparent"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-medium text-amber-400">
                        {item.category} · {item.date}
                      </p>
                      <h3 className="mt-1.5 font-display text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Academy Tryouts & Scrim Desk */}
        <section id="tryouts" className="scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                  05. Recruitment & Operations
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
                  Academy Tryouts & Scrim Desk
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  Submit an individual player trial application for our 2026 Academy intake or
                  schedule a structured BO3 scrim block against BSG 804 Gaming starting squads.
                  Submissions save locally when offline.
                </p>

                <div className="mt-6 space-y-4 border-t border-zinc-800 pt-6 text-sm text-zinc-300">
                  <div className="flex items-start gap-3">
                    <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-white">Academy Evaluation Windows</div>
                      <p className="text-xs text-zinc-400">
                        Live tryout lobbies hosted Tuesdays & Fridays at 19:00 UTC.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Swords className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-white">Pro Scrim Verification</div>
                      <p className="text-xs text-zinc-400">
                        Open to Tier-1 and Tier-2 collegiate/challenger rosters with VOD privacy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Persistent Submission History */}
                {submissions.length > 0 && (
                  <div className="mt-8 rounded-2xl border border-zinc-800 bg-[#111115] p-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Your Saved Requests ({submissions.length})
                    </h3>
                    <ul className="mt-3 divide-y divide-zinc-800/80">
                      {submissions.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between gap-3 py-2.5 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-white">
                              {item.handle} · {item.division}
                            </div>
                            <div className="text-zinc-400">
                              {item.requestType === 'academy' ? 'Academy Tryout' : 'Scrim Request'}{' '}
                              · {item.submittedAt}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubmission(item.id)}
                            className="min-h-[36px] shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7">
                <form
                  onSubmit={handleFormSubmit}
                  noValidate
                  className="rounded-2xl border border-zinc-800 bg-[#111115] p-6 sm:p-8"
                >
                  {/* Request Type Segmented Control */}
                  <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-[#09090B] p-1">
                    <button
                      type="button"
                      onClick={() => setRequestType('academy')}
                      className={`min-h-[42px] flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        requestType === 'academy'
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Academy Tryout
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestType('scrim')}
                      className={`min-h-[42px] flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        requestType === 'scrim'
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Book Team Scrim
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="bsg-handle"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        {requestType === 'academy'
                          ? 'Player Handle / Discord Tag'
                          : 'Team Name & Manager Tag'}
                      </label>
                      <input
                        id="bsg-handle"
                        type="text"
                        required
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder={
                          requestType === 'academy' ? 'e.g., Viper804#NA1' : 'e.g., Redline Five'
                        }
                        className="mt-1.5 w-full min-h-[44px] rounded-lg border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bsg-email"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        Contact Email
                      </label>
                      <input
                        id="bsg-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="player@domain.com"
                        className="mt-1.5 w-full min-h-[44px] rounded-lg border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="bsg-division"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        Game Division
                      </label>
                      <select
                        id="bsg-division"
                        value={divisionInput}
                        onChange={(e) => setDivisionInput(e.target.value)}
                        className="mt-1.5 w-full min-h-[44px] rounded-lg border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white focus:border-amber-400 focus:outline-none"
                      >
                        <option value="Valorant">Valorant</option>
                        <option value="Counter-Strike 2">Counter-Strike 2</option>
                        <option value="Apex Legends">Apex Legends</option>
                        <option value="Street Fighter 6">Street Fighter 6</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="bsg-rank"
                        className="block text-xs font-medium text-zinc-300"
                      >
                        {requestType === 'academy'
                          ? 'Current Peak Rank / ELO'
                          : 'Server Region & Scrim Tier'}
                      </label>
                      <input
                        id="bsg-rank"
                        type="text"
                        required
                        value={rankInput}
                        onChange={(e) => setRankInput(e.target.value)}
                        placeholder={
                          requestType === 'academy'
                            ? 'e.g., Radiant / Faceit Lv 10'
                            : 'e.g., EU Central · Challengers'
                        }
                        className="mt-1.5 w-full min-h-[44px] rounded-lg border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="bsg-notes" className="block text-xs font-medium text-zinc-300">
                      Role, Availability & Tracker / VOD Link
                    </label>
                    <textarea
                      id="bsg-notes"
                      rows={3}
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Primary role, time zone availability, and optional tracker URL."
                      className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="mt-4 rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-3 text-xs font-medium text-red-200"
                    >
                      {formError}
                    </div>
                  )}

                  {formSuccess && (
                    <div
                      role="status"
                      className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-950/30 px-4 py-3 text-xs font-medium text-amber-200"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-end">
                    <button
                      type="submit"
                      className="min-h-[46px] w-full sm:w-auto rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      {requestType === 'academy' ? 'Submit Application' : 'Request Scrim Block'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#09090B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="" width={20} height={20} className="h-5 w-5 rounded" />
            <span className="font-semibold text-zinc-200">BSG 804 Gaming</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#rosters" className="hover:text-white transition-colors">
              Rosters
            </a>
            <a href="#matches" className="hover:text-white transition-colors">
              Matches
            </a>
            <a href="#tryouts" className="hover:text-white transition-colors">
              Tryouts
            </a>
            <a href="/offline.html" className="hover:text-white transition-colors">
              Offline Fallback
            </a>
            <a href="/manifest.json" className="hover:text-white transition-colors">
              App Manifest
            </a>
          </div>
        </div>
      </footer>

      {/* Mobile Thumb-Zone Bottom Tab Bar (visible < md, compact 52px + safe inset) */}
      <nav
        aria-label="Mobile quick navigation"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800 bg-[#09090B]/95 backdrop-blur-md pb-safe md:hidden"
      >
        <div className="grid h-[52px] grid-cols-4 items-center">
          <a
            href="#top"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-zinc-300 hover:text-white"
          >
            <Home className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-[10px] font-medium tracking-tight">Home</span>
          </a>
          <a
            href="#rosters"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-zinc-300 hover:text-white"
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] font-medium tracking-tight">Rosters</span>
          </a>
          <a
            href="#matches"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-zinc-300 hover:text-white"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span className="text-[10px] font-medium tracking-tight">Matches</span>
          </a>
          <a
            href="#tryouts"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 text-zinc-300 hover:text-white"
          >
            <UserPlus className="h-4 w-4 text-red-500" aria-hidden="true" />
            <span className="text-[10px] font-medium tracking-tight">Tryouts</span>
          </a>
        </div>
      </nav>

      {/* Service Worker Update Banner */}
      {updateAvailable && (
        <div className="fixed bottom-16 md:bottom-5 right-4 z-40 flex items-center gap-3 rounded-xl border border-zinc-700 bg-[#141418] px-4 py-2.5 text-xs text-zinc-100 shadow-2xl">
          <span>New BSG 804 update ready</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('bsg-sw-apply-update'))}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-700 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reload</span>
          </button>
        </div>
      )}

      {/* Offline Status Indicator */}
      <OfflineIndicator />

      {/* Interactive Detail Modals */}
      <PlayerModal player={activePlayer} onClose={() => setActivePlayer(null)} />
      <MediaModal item={activeMedia} onClose={() => setActiveMedia(null)} />
    </div>
  );
}
